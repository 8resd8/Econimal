// ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingScreen from './LoadingScreen';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  // 인증 상태 확인 중일 때 로딩 화면 표시
  if (loading) {
    return <LoadingScreen />;
  }
  
  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // 인증된 경우 자식 라우트로 진행
  return <Outlet />;
};

export default ProtectedRoute;