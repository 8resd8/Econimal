// src/utils/errorHandler.ts
import { clearTokenData } from '@/api/axiosConfig';

// 에러 코드에 따른 라우트 정의
const ERROR_ROUTES: Record<number, string> = {
  401: '/login', // 인증 에러: 로그인 페이지
  403: '/permission', // 권한 없음: 권한 에러 페이지
  404: '/not-found', // 찾을 수 없음
  408: '/timeout', // 타임아웃
  500: '/server-error', // 서버 에러
  0: '/network-error', // 네트워크 에러
};

// 기본 에러 경로 (기타 에러)
const DEFAULT_ERROR_ROUTE = '/server-error';

/**
 * 에러 처리 함수 - 상태 코드에 따라 적절한 에러 페이지로 리다이렉션
 */
export const handleApiError = (error: any) => {
  console.error('API 에러 발생:', error);

  // 에러 상태 코드 추출
  let status: number;

  if (error.response) {
    // 서버 응답이 있는 경우 (4xx, 5xx 상태 코드)
    status = error.response.status;

    // 401 에러는 토큰 정리?
    if (status === 401) {
      console.log('401 인증 오류 발생');

      // clearTokenData();
    }
  } else if (error.request) {
    // 요청은 보냈지만 응답이 없는 경우
    status = error.code === 'ECONNABORTED' ? 408 : 0;
  } else {
    // 요청 설정 중 에러
    status = 0;
  }

  // 에러 상태에 맞는 경로 또는 기본 에러 경로
  const errorRoute = ERROR_ROUTES[status] || DEFAULT_ERROR_ROUTE;

  // 페이지 이동 (window.location 사용)
  window.location.href = errorRoute;
};
