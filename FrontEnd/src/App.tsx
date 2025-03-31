import './App.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { router } from './router';
import { RouterProvider } from 'react-router-dom';
import AspectRatioContainer from '@/components/AspectRatioContainer';
// import EventDetector from './components/EventDetector';
import { ToastContainer } from 'react-toastify';

const queryClient = new QueryClient(); // 일단 기본 옵션으로 설정. 추가 옵션 설정 후 파일 분리 및 import 해서 사용해도 됨
// 쿼리 클라이언트 : 쿼리, 캐시, 쿼리 캐시를 조작하는 도구가 속함.
// 대부분 이 도구를 직접 사용하는 대신 쿼리 클라이언트를 속성으로 쓰는 QueryClientProvider를 추가해서 사용한다.

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AspectRatioContainer>
        <RouterProvider router={router} />
        {/* RouterProvider만 렌더링하고 EventDetector는 라우터 내부에서 처리 */}
        {/* 전역 이벤트 감지기 */}
        {/* <EventDetector /> */}
      </AspectRatioContainer>

      <ToastContainer />

      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};

export default App;
