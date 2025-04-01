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
      // 로그인한 상태에서 라우팅하면 메인. 로그인 안한 상태에서 접근하면 로그인으로 보내야될 것 같은데
      // 라우팅 자체가 막혀있으면 상관없을듯
      iconType='notFound'
      tipType='water'
    />
  );
};

export default NotFoundScreen;
