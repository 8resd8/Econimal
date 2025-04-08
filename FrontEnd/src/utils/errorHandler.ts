// Zustand 스토어를 사용한 에러 핸들러
import axios, { AxiosError } from 'axios';
import {
  ErrorType,
  ErrorResponse,
} from '@/components/errorScreens/types/error';
import { useErrorStore } from '@/store/errorStore';
import { showErrorToast } from '@/components/toast/toastUtil';
import { clearTokenData } from '@/api/axiosConfig';
import { setModalOpen } from '@/components/EventDetector';

// 에러 핸들러가 호출된 횟수를 추적하는 변수
let tokenRefreshErrorCount = 0;
const MAX_TOKEN_REFRESH_ERRORS = 3;
let lastTokenRefreshErrorTime = 0;

// [최적화] 공통 에러 전처리 함수 - 모든 에러 핸들러에서 공통으로 처리하는 로직
const preprocessError = (error: Error | AxiosError | unknown): boolean => {
  // 에러 발생 시 모든 모달 닫기
  setModalOpen(false);

  // 토큰 리프레시 에러 처리
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

    // 에러가 여러 번 반복되면 토큰 데이터 정리
    if (tokenRefreshErrorCount >= MAX_TOKEN_REFRESH_ERRORS) {
      clearTokenData();
    }

    // 토큰 리프레시 에러는 사용자에게 표시하지 않음
    console.log('토큰 리프레시 요청 실패, 유저에게 에러 표시 생략');
    return true; // 에러 처리 완료
  }

  // Token refresh failed 에러 메시지도 차단
  if (error instanceof Error && error.message === 'Token refresh failed') {
    console.log('Token refresh failed 에러 감지, 사용자에게 표시하지 않음');
    return true; // 에러 처리 완료
  }

  // 400 에러는 토스트로만 처리
  if (
    axios.isAxiosError(error) &&
    error.response &&
    error.response.status === 400
  ) {
    console.log('400 에러 감지, 토스트로 처리');
    showErrorToast('잘못된 요청입니다.');
    return true; // 에러 처리 완료
  }

  // 처리되지 않은 에러는 false 반환
  return false;
};

// 에러 핸들링 함수
export const handleApiError = (error: Error | AxiosError | unknown): void => {
  console.error('API 에러 발생:', error);

  // 공통 전처리 로직으로 처리된 에러는 여기서 종료
  if (preprocessError(error)) {
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

      // 에러 유형 결정 (400 에러는 이미 처리되었으므로 여기서는 다른 에러 유형만 처리)
      if (status === 401 || status === 403) {
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

  // 공통 전처리 로직 실행 (대부분의 경미한 에러는 여기서 처리됨)
  if (preprocessError(error)) {
    return;
  }

  // 전처리에서 처리되지 않은 에러는 기본 에러 핸들러로 처리
  handleApiError(error);
};

// 탠스택쿼리 에러 핸들러 함수
export const queryErrorHandler = (error: unknown) => {
  // 공통 전처리 로직 실행 (400 에러, 토큰 에러 등은 여기서 처리됨)
  if (preprocessError(error)) {
    return;
  }

  // 전처리에서 처리되지 않은 에러는 기본 에러 핸들러로 처리
  handleApiError(error);
};
