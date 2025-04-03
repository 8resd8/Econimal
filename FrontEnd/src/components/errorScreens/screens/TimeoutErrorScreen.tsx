import ErrorScreen from '../ErrorScreen';
import { ErrorScreenProps } from '@/components/errorScreens/types/errorScreenProps';

// 타임아웃 에러 스크린
const TimeoutErrorScreen = (props: Partial<ErrorScreenProps>) => {
  return (
    <ErrorScreen
      message={props.message || '요청 시간이 초과되었습니다'}
      subMessage={
        props.subMessage ||
        '서버 응답 시간이 너무 오래 걸려요. 잠시 후 다시 시도해 주세요.'
      }
      retryText={props.retryText || '다시 시도하기'}
      onRetry={props.onRetry}
      iconType='timeout'
      tipType='eco'
    />
  );
};

export default TimeoutErrorScreen;
