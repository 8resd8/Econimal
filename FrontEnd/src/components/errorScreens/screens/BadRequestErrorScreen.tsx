import ErrorScreen from '../ErrorScreen';
import { ErrorScreenProps } from '@/components/errorScreens/types/errorScreenProps';

// 클라이언트 측 오류 스크린 (400 에러)
const BadRequestErrorScreen = (props: Partial<ErrorScreenProps>) => {
  return (
    <ErrorScreen
      message={props.message || '요청에 문제가 있습니다'}
      subMessage={
        props.subMessage ||
        '입력한 정보나 요청 형식에 오류가 있습니다. 다시 확인해 주세요.'
      }
      retryText={props.retryText || '이전 페이지로 돌아가기'}
      onRetry={props.onRetry || (() => window.history.back())}
      iconType='badRequest'
      tipType='recycle'
    />
  );
};

export default BadRequestErrorScreen;
