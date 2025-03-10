import './App.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient(); // 일단 기본 옵션으로 설정. 추가 옵션 설정 후 파일 분리 및 import 해서 사용해도 됨
// 쿼리 클라이언트 : 쿼리, 캐시, 쿼리 캐시를 조작하는 도구가 속함.
// 대부분 이 도구를 직접 사용하는 대신 쿼리 클라이언트를 속성으로 쓰는 QueryClientProvider를 추가해서 사용한다.

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className='flex h-screen items-center justify-center bg-gray-100'>
        <h1 className='text-4xl font-bold text-blue-600'>에코니멀</h1>
      </div>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
