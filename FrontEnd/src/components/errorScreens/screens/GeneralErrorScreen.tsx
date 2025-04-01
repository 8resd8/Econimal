import ErrorScreen from '../ErrorScreen';
import { ErrorScreenProps } from '@/components/errorScreens/types/errorScreenProps';

const GeneralErrorScreen = (props: Partial<ErrorScreenProps>) => {
  return (
    <ErrorScreen
      message={props.message || '오류가 발생했어요'}
      subMessage={
        props.subMessage || '에코니멀에 문제가 생겼어요. \n 다시 시도해 볼까요?'
      }
      retryText={props.retryText || '다시 시도하기'}
      onRetry={props.onRetry || (() => window.location.reload())}
      iconType='general'
      tipType='eco'
    />
  );
};

export default GeneralErrorScreen;
