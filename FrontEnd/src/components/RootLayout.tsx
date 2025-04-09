import { useEffect, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import EventDetector from '@/components/EventDetector';
import { clearAllToasts } from './toast/toastUtil';
import { useErrorStore } from '@/store/errorStore';
import { getValidRoutes, isFileOrApiRequest } from '@/utils/routerUtils';

// 알려진 라우트 경로 목록
// const KNOWN_ROUTES = [
//   '/',
//   '/town',
//   '/charsel',
//   '/my',
//   '/earth',
//   '/animation',
//   '/edit-profile',
//   '/shop',
//   '/store',
//   '/prolog',
//   '/login',
//   '/signup',
//   '/loading',
//   '/error',
// ];

const RootLayout = () => {
  const location = useLocation();
  const hideError = useErrorStore((state) => state.hideError);
  const showError = useErrorStore((state) => state.showError);

  // 라우터에서 모든 유효 경로 추출
  const validRoutes = useMemo(() => getValidRoutes(), []);

  // 현재 경로가 404 페이지인지 확인
  const is404Page = useMemo(() => {
    // API 경로나 파일 요청은 제외
    if (isFileOrApiRequest(location.pathname)) {
      return false;
    }

    // validRoutes 중 하나와 매칭되는지 확인
    return !validRoutes.some((path) => {
      // 루트 경로는 정확히 일치해야 함
      if (path === '/') {
        return location.pathname === '/';
      }

      // 그 외 경로는 시작 부분이 일치하는지 확인
      if (path.includes(':')) {
        // 동적 파라미터가 있는 경로 처리
        const pathParts = path.split('/').filter(Boolean);
        const locationParts = location.pathname.split('/').filter(Boolean);

        // 부분 수가 다르면 매칭 실패
        if (pathParts.length !== locationParts.length) {
          return false;
        }

        // 각 부분 비교
        return pathParts.every((part, index) => {
          // 동적 파라미터는 항상 매칭 성공으로 간주
          if (part.startsWith(':')) {
            return true;
          }
          // 일반 문자열은 정확히 일치해야 함
          return part === locationParts[index];
        });
      }

      // 일반 경로인 경우 prefix 매칭 확인
      // 정확한 경로 또는 하위 경로 매칭 (예: /earth는 /earth/sub와도 매칭)
      return (
        location.pathname === path || location.pathname.startsWith(`${path}/`)
      );
    });
  }, [location.pathname, validRoutes]);

  // 404 페이지일 때 토스트 제거 및 에러 상태 설정
  useEffect(() => {
    if (is404Page) {
      // 토스트 제거
      clearAllToasts();

      // 에러 상태 설정
      showError({
        errorType: 'notFound',
        errorMessage: '페이지를 찾을 수 없습니다',
        errorSubMessage: '요청하신 페이지가 존재하지 않거나 이동되었습니다.',
      });
    } else {
      // 정상 경로로 이동할 때 에러 상태 초기화
      hideError();
    }
  }, [is404Page, showError, hideError]);

  // 개발 모드에서만 경로 정보 로깅 (디버깅용)
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('유효한 경로 목록:', validRoutes);
      console.log('현재 경로:', location.pathname);
      console.log('404 페이지 여부:', is404Page);
    }
  }, [validRoutes, location.pathname, is404Page]);

  return (
    <>
      <EventDetector />
      <Outlet />
    </>
  );
};

export default RootLayout;
