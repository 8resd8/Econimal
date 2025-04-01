import { ErrorScreenProps } from '@/components/errorScreens/types/errorScreenProps';
import ErrorScreen from '../ErrorScreen';

const NotFoundScreen = (props: Partial<ErrorScreenProps>) => {
  return (
    <ErrorScreen
      message={props.message || '페이지를 찾을 수 없습니다'}
      subMessage={
        props.subMessage ||
        '요청하신 페이지가 삭제되었거나 주소가 변경되었어요.'
      }
      retryText={props.retryText || '홈으로 돌아가기'}
      onRetry={props.onRetry || (() => (window.location.href = '/'))}
      iconType='notFound'
      tipType='water'
    />
  );
};

export default NotFoundScreen;
