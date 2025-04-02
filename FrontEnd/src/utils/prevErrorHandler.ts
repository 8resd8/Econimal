// 에러 발생 시 해당하는 페이지로 리다이렉팅 하려고 했던 흔적
// 각 페이지로 라우팅 하는 로직이 비효율적이라고 생각해서 다른 로직(404는 페이지, 400 에러는 토스트창)으로 재구성

// import axios, { AxiosError } from 'axios';

// // 에러 타입 정의
// type ErrorType =
//   | 'network'
//   | 'server'
//   | 'permission'
//   | 'notFound'
//   | 'timeout'
//   | 'badRequest'
//   | 'general';

// // 에러 응답 인터페이스
// interface ErrorResponse {
//   timestamp: string;
//   status: number;
//   error: string;
//   message: string;
//   path: string;
// }

// // unknown을 꼭 사용해야할까
// export const handleApiError = (error: Error | AxiosError | unknown): void => {
//   console.error('API 에러 발생:', error);

//   // 기본 에러 유형
//   let errorType: ErrorType = 'general';

//   // Axios 에러인지 확인
//   if (axios.isAxiosError(error)) {
//     const axiosError: AxiosError = error;

//     if (axiosError.response) {
//       // 서버 응답이 있는 경우 (4xx, 5xx 상태 코드)
//       const status: number = axiosError.response.status;

//       // 백엔드 에러 응답 데이터 추출
//       try {
//         const errorData = axiosError.response.data as ErrorResponse;

//         // 상세 에러 정보 로깅 - 개발자 디버깅용
//         console.error('백엔드 에러 상세정보:', {
//           timestamp: errorData.timestamp,
//           status: errorData.status,
//           error: errorData.error,
//           message: errorData.message,
//           path: errorData.path,
//         });
//       } catch (parseError) {
//         console.error('에러 응답 파싱 실패:', parseError);
//       }

//       // 에러 유형 결정
//       if (status === 401 || status === 403) {
//         errorType = 'permission';

//         // 401 에러 로깅
//         if (status === 401) {
//           console.log('401 인증 오류 발생');
//         }
//       } else if (status === 404) {
//         errorType = 'notFound';
//       } else if (status === 408) {
//         errorType = 'timeout';
//       } else if (status >= 500) {
//         errorType = 'server';
//       } else if (status >= 400 && status < 500) {
//         errorType = 'badRequest';
//       }
//     } else if (axiosError.request) {
//       // 요청은 보냈지만 응답이 없는 경우
//       errorType = axiosError.code === 'ECONNABORTED' ? 'timeout' : 'network';
//     } else {
//       // 요청 설정 중 에러
//       errorType = 'network';
//     }
//   } else if (error instanceof Error) {
//     // 일반 JavaScript Error
//     console.error('일반 에러:', error.message);
//     errorType = 'general';
//   }

//   // 에러 페이지로 리다이렉션 (에러 타입만 전달)
//   window.location.href = `/error?type=${errorType}`;
// };
