import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import EventDetector from '@/components/EventDetector';
import { clearAllToasts } from './toast/toastUtil';

// 모든 라우트의 루트 레이아웃 컴포넌트
const RootLayout = () => {
  const location = useLocation();

  // 로그인 페이지로 이동 시 토스트 제거
  useEffect(() => {
    if (location.pathname === '/login') {
      clearAllToasts();
    }
  }, [location]);

  return (
    <>
      <EventDetector />
      <Outlet />
    </>
  );
};

export default RootLayout;
