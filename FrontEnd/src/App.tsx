import './App.css';
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { router } from './router';
import { RouterProvider } from 'react-router-dom';
import AspectRatioContainer from '@/components/AspectRatioContainer';
import { ToastContainer } from 'react-toastify';
import { TOAST_CONTAINER_ID } from './components/toast/toastUtil';
import ErrorOverlay from './components/ErrorOverlay';
import { queryErrorHandler } from '@/utils/errorHandler';
// import ErrorQueryListener from '@/components/ErrorQueryListener';

// const queryClient = new QueryClient(); // 일단 기본 옵션으로 설정. 추가 옵션 설정 후 파일 분리 및 import 해서 사용해도 됨
// 쿼리 클라이언트 : 쿼리, 캐시, 쿼리 캐시를 조작하는 도구가 속함.
// 대부분 이 도구를 직접 사용하는 대신 쿼리 클라이언트를 속성으로 쓰는 QueryClientProvider를 추가해서 사용한다.

// QueryClient 설정
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: queryErrorHandler,
  }),
  mutationCache: new MutationCache({
    onError: queryErrorHandler,
  }),
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <ErrorQueryListener /> */}

      <AspectRatioContainer>
        <RouterProvider router={router} />
      </AspectRatioContainer>

      {/* 토스트 컨테이너에 ID 추가 및 옵션 명시적 설정 */}
      <ToastContainer
        containerId={TOAST_CONTAINER_ID}
        draggable={false}
        pauseOnHover={false}
      />

      <ErrorOverlay />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};

export default App;
