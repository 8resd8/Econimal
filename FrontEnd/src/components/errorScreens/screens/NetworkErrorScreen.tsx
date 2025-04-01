import ErrorScreen from '../ErrorScreen';
import { ErrorScreenProps } from '@/components/errorScreens/types/errorScreenProps';

// 네트워크 에러 스크린 (기존 컴포넌트 대체)
const NetworkErrorScreen = (props: Partial<ErrorScreenProps>) => {
  return (
    <ErrorScreen
      message={props.message || '네트워크에 접속할 수 없습니다'}
      subMessage={props.subMessage || '네트워크 연결 상태를 확인해 주세요.'}
      retryText={props.retryText || '다시 시도하기'}
      onRetry={props.onRetry}
      iconType='network'
      tipType='energy'
    />
  );
};
export default NetworkErrorScreen;
