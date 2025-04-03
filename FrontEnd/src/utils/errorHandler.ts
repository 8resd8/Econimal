// Zustand 스토어를 사용한 에러 핸들러
import axios, { AxiosError } from 'axios';
import {
  ErrorType,
  ErrorResponse,
} from '@/components/errorScreens/types/error';
import { useErrorStore } from '@/store/errorStore';
import { showErrorToast } from '@/components/toast/toastUtil';
import { clearTokenData } from '@/api/axiosConfig';

// 에러 핸들러가 호출된 횟수를 추적하는 변수
let tokenRefreshErrorCount = 0;
const MAX_TOKEN_REFRESH_ERRORS = 3;
let lastTokenRefreshErrorTime = 0;

// 에러 핸들링 함수
export const handleApiError = (error: Error | AxiosError | unknown): void => {
  console.error('API 에러 발생:', error);

  // 리프레시 요청 관련 에러 처리 개선
  if (
    axios.isAxiosError(error) &&
    error.config?.url?.includes('/users/refresh')
  ) {
    const now = Date.now();

    // 마지막 에러로부터 10초가 지났으면 카운터 리셋
    if (now - lastTokenRefreshErrorTime > 10000) {
      tokenRefreshErrorCount = 0;
    }

    // 카운터 증가 및 시간 갱신
    tokenRefreshErrorCount++;
    lastTokenRefreshErrorTime = now;

    console.log(
      `토큰 리프레시 에러 카운트: ${tokenRefreshErrorCount}/${MAX_TOKEN_REFRESH_ERRORS}`,
    );

    // 에러가 여러 번 반복되면 토큰 데이터 정리
    if (tokenRefreshErrorCount >= MAX_TOKEN_REFRESH_ERRORS) {
      console.log('토큰 리프레시 에러 한계에 도달, 토큰 데이터 정리');
      clearTokenData();

      // 이후 요청에서 새로 로그인하도록 유도 (선택 사항)
      // window.location.href = '/login';
    }

    // 토큰 리프레시 에러는 사용자에게 표시하지 않음
    console.log('토큰 리프레시 요청 실패, 유저에게 에러 표시 생략');
    return;
  }

  // Token refresh failed 에러 메시지도 차단
  if (error instanceof Error && error.message === 'Token refresh failed') {
    console.log('Token refresh failed 에러 감지, 사용자에게 표시하지 않음');
    return;
  }

  // 기본 에러 유형
  let errorType: ErrorType = 'general';
  let errorMessage = '';
  let errorSubMessage = '';

  // Axios 에러인지 확인
  if (axios.isAxiosError(error)) {
    const axiosError: AxiosError = error;

    if (axiosError.response) {
      // 서버 응답이 있는 경우 (4xx, 5xx 상태 코드)
      const status: number = axiosError.response.status;

      try {
        const errorData = axiosError.response.data as ErrorResponse;

        // 상세 에러 정보 디버깅용
        console.error('백엔드 에러 상세정보:', {
          timestamp: errorData.timestamp,
          status: errorData.status,
          error: errorData.error,
          message: errorData.message,
          path: errorData.path,
        });

        // 서버에서 전달한 에러 메시지가 있으면 사용
        if (errorData.message) {
          errorMessage = errorData.error || '오류가 발생했습니다';
          errorSubMessage = errorData.message;
        }
      } catch (parseError) {
        console.error('에러 응답 파싱 실패:', parseError);
      }

      // 에러 유형 결정
      if (status === 400) {
        errorType = 'badRequest';
      } else if (status === 401 || status === 403) {
        errorType = 'permission';

        // 401 에러는 별도 로깅만 수행
        if (status === 401) {
          console.log('401 인증 오류 발생');
        }
      } else if (status === 404) {
        errorType = 'notFound';
      } else if (status === 408) {
        errorType = 'timeout';
      } else if (status >= 500) {
        errorType = 'server';
      } else if (status >= 400 && status < 500) {
        // 다른 4xx 에러도 badRequest로 처리
        errorType = 'badRequest';
      }
    } else if (axiosError.request) {
      // 요청은 보냈지만 응답이 없는 경우
      errorType = axiosError.code === 'ECONNABORTED' ? 'timeout' : 'network';
    } else {
      // 요청 설정 중 에러
      errorType = 'network';
    }
  } else if (error instanceof Error) {
    // 일반 JavaScript Error
    console.error('일반 에러:', error.message);
    errorType = 'general';
    errorSubMessage = error.message;
  }

  // Zustand 스토어를 직접 호출하여 에러 상태 업데이트
  useErrorStore.getState().showError({
    errorType,
    errorMessage,
    errorSubMessage,
  });
};

// 경미한 에러(400 등)를 토스트 메시지로만 처리하는 함수
export const handleMinorError = (error: Error | AxiosError | unknown): void => {
  console.error('Minor API 에러 발생:', error);

  // 리프레시 요청 관련 에러인 경우 처리하지 않고 조기 반환 (기존과 동일)
  if (
    axios.isAxiosError(error) &&
    error.config?.url?.includes('/users/refresh')
  ) {
    console.log('토큰 리프레시 요청 실패, 무시');
    return;
  }

  // Token refresh failed 에러 메시지도 차단
  if (error instanceof Error && error.message === 'Token refresh failed') {
    console.log('Token refresh failed 에러 감지, 사용자에게 표시하지 않음');
    return;
  }

  if (axios.isAxiosError(error) && error.response) {
    const status = error.response.status;

    // 400 에러는 토스트 메시지로만 처리
    if (status === 400) {
      try {
        // const errorData = error.response.data as ErrorResponse;
        // 토스트 메시지로 에러 표시
        // showErrorToast(errorData.message || '입력 정보를 확인해주세요');
        showErrorToast('잘못된 요청입니다.');
        return; // 추가 처리 없이 종료
      } catch (e) {
        console.error('에러 데이터 파싱 실패:', e);
      }
    }
  }

  // 400 에러가 아니거나 파싱에 실패한 경우 기본 에러 핸들러로 처리
  handleApiError(error);
};

// 탠스택쿼리 에러 핸들러 함수
export const queryErrorHandler = (error: unknown) => {
  // 리프레시 요청 관련 에러인 경우 처리하지 않고 조기 반환 (기존과 동일)
  if (
    axios.isAxiosError(error) &&
    error.config?.url?.includes('/users/refresh')
  ) {
    console.log('토큰 리프레시 요청 실패, 무시');
    return;
  }

  // Token refresh failed 에러 메시지도 차단
  if (error instanceof Error && error.message === 'Token refresh failed') {
    console.log('Token refresh failed 에러 감지, 사용자에게 표시하지 않음');
    return;
  }
  // unknown이 최선이야?
  if (axios.isAxiosError(error) && error.response?.status === 400) {
    handleMinorError(error);
  } else {
    handleApiError(error);
  }
};
