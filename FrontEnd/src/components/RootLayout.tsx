import { useEffect, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import EventDetector from '@/components/EventDetector';
import { clearAllToasts } from './toast/toastUtil';
import { useErrorStore } from '@/store/errorStore';

// 알려진 라우트 경로 목록
const KNOWN_ROUTES = [
  '/',
  '/town',
  '/charsel',
  '/my',
  '/earth',
  '/animation',
  '/edit-profile',
  '/shop',
  '/store',
  '/prolog',
  '/login',
  '/signup',
  '/loading',
  '/error',
];

// 모든 라우트의 루트 레이아웃 컴포넌트
const RootLayout = () => {
  const location = useLocation();
  const hideError = useErrorStore((state) => state.hideError);
  const showError = useErrorStore((state) => state.showError);

  // 현재 경로가 404 페이지인지 확인
  const is404Page = useMemo(() => {
    // 정의된 경로 중 하나에 매칭되는지 확인
    const isKnownPath = KNOWN_ROUTES.some((path) => {
      if (path === '/') {
        return location.pathname === '/';
      }
      return location.pathname.startsWith(path);
    });

    // 알려진 경로가 아니면 404로 간주
    return !isKnownPath;
  }, [location.pathname]);

  // [여기] 404 페이지일 때 토스트 제거 및 에러 상태 설정
  useEffect(() => {
    if (is404Page) {
      // 토스트 제거
      clearAllToasts();

      // 에러 상태 설정 (경로가 너무 자주 변경될 수 있으므로 추가 검증 필요)
      // 추가 검증: 일반적으로 사용하는 파일 확장자나 API 경로가 아닌 경우에만 에러 상태 설정
      const isAPIPath = location.pathname.includes('/api/');
      const hasFileExtension = /\.(jpg|jpeg|png|gif|svg|js|css|html)$/.test(
        location.pathname,
      );

      if (!isAPIPath && !hasFileExtension) {
        showError({
          errorType: 'notFound',
          errorMessage: '페이지를 찾을 수 없습니다',
          errorSubMessage: '요청하신 페이지가 존재하지 않거나 이동되었습니다.',
        });
      }
    }
  }, [is404Page, showError, location.pathname]);

  // 라우트 변경 시 에러 상태 초기화 (정상 경로로 이동할 때)
  useEffect(() => {
    if (!is404Page) {
      hideError();
    }
  }, [location.pathname, hideError, is404Page]);

  return (
    <>
      <EventDetector />
      <Outlet />
    </>
  );
};

export default RootLayout;

// 모든 라우트의 루트 레이아웃 컴포넌트
// const RootLayout = () => {
//   const location = useLocation();
//   const hideError = useErrorStore((state) => state.hideError);

//   // 라우트 변경 시 에러 상태 초기화
//   useEffect(() => {
//     hideError();
//   }, [location.pathname, hideError]);

//   // 라우트 변경 시 모든 토스트 제거
//   useEffect(() => {
//     clearAllToasts();
//   }, [location.pathname]);

//   return (
//     <>
//       <EventDetector />
//       <Outlet />
//     </>
//   );
// };

// export default RootLayout;
