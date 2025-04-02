// Zustand 스토어를 사용한 에러 핸들러
import axios, { AxiosError } from 'axios';
import {
  ErrorType,
  ErrorResponse,
} from '@/components/errorScreens/types/error';
import { useErrorStore } from '@/store/errorStore';
import { showErrorToast } from '@/components/toast/toastUtil';

// [여기] 에러 핸들링 함수
export const handleApiError = (error: Error | AxiosError | unknown): void => {
  console.error('API 에러 발생:', error);

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

      // 백엔드 에러 응답 데이터 추출
      try {
        const errorData = axiosError.response.data as ErrorResponse;

        // 상세 에러 정보 로깅 - 개발자 디버깅용
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

  // [여기] Zustand 스토어를 직접 호출하여 에러 상태 업데이트
  useErrorStore.getState().showError({
    errorType,
    errorMessage,
    errorSubMessage,
  });
};

// 경미한 에러(400 등)를 토스트 메시지로만 처리하는 함수
export const handleMinorError = (error: Error | AxiosError | unknown): void => {
  console.error('Minor API 에러 발생:', error);

  if (axios.isAxiosError(error) && error.response) {
    const status = error.response.status;

    // 400 에러는 토스트 메시지로만 처리
    if (status === 400) {
      try {
        const errorData = error.response.data as ErrorResponse;
        // 토스트 메시지로 에러 표시
        showErrorToast(errorData.message || '입력 정보를 확인해주세요');
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
  // unknown이 최선이야?
  if (axios.isAxiosError(error) && error.response?.status === 400) {
    handleMinorError(error);
  } else {
    handleApiError(error);
  }
};
