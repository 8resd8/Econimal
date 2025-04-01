import ErrorScreen from '../ErrorScreen';
import { ErrorScreenProps } from '@/components/errorScreens/types/errorScreenProps';
// 404 Not Found 에러 스크린
const NotFoundScreen = (props: Partial<ErrorScreenProps>) => {
  return (
    <ErrorScreen
      message={props.message || '페이지를 찾을 수 없습니다'}
      subMessage={
        props.subMessage || '요청하신 페이지가 존재하지 않거나 이동되었습니다.'
      }
      retryText={props.retryText || '홈으로 이동'}
      onRetry={props.onRetry || (() => (window.location.href = '/'))}
      iconType='notFound'
      tipType='water'
    />
  );
};

export default NotFoundScreen;
