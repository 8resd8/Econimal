// 에러 타입 정의
export type ErrorType =
  | 'network'
  | 'server'
  | 'permission'
  | 'notFound'
  | 'timeout'
  | 'badRequest'
  | 'general';

// 에러 응답 인터페이스
export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

// 에러 상태 인터페이스
export interface ErrorState {
  isError: boolean;
  errorType: ErrorType | null;
  errorMessage?: string;
  errorSubMessage?: string;
  retryAction?: () => void;
  prevPath?: string;
}
