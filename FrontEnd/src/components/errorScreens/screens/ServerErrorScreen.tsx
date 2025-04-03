import ErrorScreen from '../ErrorScreen';
import { ErrorScreenProps } from '@/components/errorScreens/types/errorScreenProps';

// 서버 에러 스크린 (500 에러)
const ServerErrorScreen = (props: Partial<ErrorScreenProps>) => {
  return (
    <ErrorScreen
      message={props.message || '서버에 문제가 발생했습니다'}
      subMessage={
        props.subMessage ||
        '잠시 후 다시 시도해 주세요. 불편을 드려 죄송합니다.'
      }
      retryText={props.retryText || '새로고침하기'}
      onRetry={props.onRetry}
      iconType='server'
      tipType='eco'
    />
  );
};
export default ServerErrorScreen;
