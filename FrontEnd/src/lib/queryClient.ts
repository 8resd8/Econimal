import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { queryErrorHandler } from '@/utils/errorHandler';

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

export default queryClient;
