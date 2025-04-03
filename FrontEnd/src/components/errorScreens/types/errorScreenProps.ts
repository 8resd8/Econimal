// 에러 스크린 기본 Props 인터페이스
export interface ErrorScreenProps {
  message: string;
  subMessage: string;
  retryText: string;
  onRetry?: () => void;
  iconType:
    | 'network'
    | 'server'
    | 'permission'
    | 'notFound'
    | 'timeout'
    | 'general'
    | 'badRequest';
  tipType?: 'eco' | 'energy' | 'water' | 'recycle';
}
