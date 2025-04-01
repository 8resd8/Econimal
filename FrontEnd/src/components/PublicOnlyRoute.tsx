// PublicOnlyRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingScreen from './LoadingScreen';

const PublicOnlyRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  // 인증 상태 확인 중일 때 로딩 화면 표시
  if (loading) {
    return <LoadingScreen />;
  }

  // 이미 인증된 사용자는 홈 페이지로 리다이렉트
  if (isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  // 인증되지 않은 사용자는 로그인/회원가입 페이지에 접근 가능
  return <Outlet />;
};

export default PublicOnlyRoute;