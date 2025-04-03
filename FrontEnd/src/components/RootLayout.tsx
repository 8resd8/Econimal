import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import EventDetector from '@/components/EventDetector';
import { clearAllToasts } from './toast/toastUtil';
import { useErrorStore } from '@/store/errorStore';

// 모든 라우트의 루트 레이아웃 컴포넌트
const RootLayout = () => {
  const location = useLocation();
  const hideError = useErrorStore((state) => state.hideError);

  // 라우트 변경 시 에러 상태 초기화
  useEffect(() => {
    hideError();
  }, [location.pathname, hideError]);

  // 로그인 페이지로 이동 시 토스트 제거
  // useEffect(() => {
  //   if (location.pathname === '/login') {
  //     clearAllToasts();
  //   }
  // }, [location]);

  // 라우트 변경 시 모든 토스트 제거
  useEffect(() => {
    clearAllToasts();
  }, [location.pathname]);

  return (
    <>
      <EventDetector />
      <Outlet />
    </>
  );
};

export default RootLayout;
