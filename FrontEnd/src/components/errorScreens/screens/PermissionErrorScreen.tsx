import ErrorScreen from '../ErrorScreen';
import { ErrorScreenProps } from '@/components/errorScreens/types/errorScreenProps';

// 권한 에러 스크린 (401, 403 에러)
const PermissionErrorScreen = (props: Partial<ErrorScreenProps>) => {
  return (
    <ErrorScreen
      message={props.message || '접근 권한이 없습니다'}
      subMessage={
        props.subMessage || '로그인이 필요하거나 접근할 수 없는 페이지입니다.'
      }
      retryText={props.retryText || '로그인 페이지로 이동'}
      onRetry={props.onRetry || (() => (window.location.href = '/login'))}
      iconType='permission'
      tipType='recycle'
    />
  );
};
export default PermissionErrorScreen;
