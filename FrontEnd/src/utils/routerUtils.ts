// 라우팅 관련 유틸리티 함수 모음
import { router } from '@/router';
import { RouteObject } from 'react-router-dom'; // 라우터 객체에 올바른 타입을 지정

// 라우터에서 모든 경로를 추출하는 헬퍼 함수
export const getAllRoutes = () => {
  return extractPaths(router.routes);
};

// 라우터 객체에서 경로를 재귀적으로 추출하는 함수
export const extractPaths = (routes: RouteObject[]) => {
  return routes.flatMap((route) => {
    const paths: string[] = [];
    if (route.path) paths.push(route.path);
    if (route.children) {
      paths.push(...extractPaths(route.children));
    }
    return paths;
  });
};

// 라우터에서 유효한 모든 경로를 추출하여 중복 제거 및 정규화
export const getValidRoutes = () => {
  // 기본 경로('/')는 항상 포함
  const paths = ['/'];

  // router 객체에서 경로 추출
  if (router.routes && router.routes.length > 0) {
    // 첫 번째 경로('/')의 자식 라우트들 처리
    const rootRoute = router.routes[0];
    if (rootRoute.children) {
      // 보호된 라우트, 공개 라우트 등 모든 자식 라우트 처리
      rootRoute.children.forEach((childRoute) => {
        if (childRoute.path) {
          paths.push(childRoute.path);
        }

        // 자식 라우트가 또 다른 자식을 가질 경우 (ProtectedRoute, PublicOnlyRoute 등)
        if (childRoute.children) {
          childRoute.children.forEach((grandChild) => {
            if (grandChild.path) {
              paths.push(grandChild.path);
            }
          });
        }
      });
    }
  }

  // 중복 제거 및 정규화
  return [...new Set(paths)].filter(Boolean);
};

// API 경로나 정적 파일 요청 여부 체크
export const isFileOrApiRequest = (pathname: string): boolean => {
  const isAPIPath = pathname.includes('/api/');
  const hasFileExtension =
    /\.(jpg|jpeg|png|gif|svg|js|css|html|ico|woff|woff2|ttf|eot)$/.test(
      pathname,
    );

  return isAPIPath || hasFileExtension;
};
