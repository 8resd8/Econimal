// import { useEffect } from 'react';
// import { QueryClient, useQueryClient } from '@tanstack/react-query';
// import { queryErrorHandler } from '@/utils/errorHandler';

// interface QueryErrorListenerProps {
//   client?: QueryClient;
// }

// const ErrorQueryListener = <T extends { error: unknown }>({
//   client,
// }: QueryErrorListenerProps) => {
//   const queryClient = useQueryClient();
//   const clientToUse = client || queryClient;

//   useEffect(() => {
//     const unsubscribeQuery = clientToUse.getQueryCache().subscribe({
//       onError: (event: T) => {
//         queryErrorHandler(event.error);
//       },
//     });

//     const unsubscribeMutation = clientToUse.getMutationCache().subscribe({
//       onError: (event: T) => {
//         queryErrorHandler(event.error);
//       },
//     });

//     return () => {
//       unsubscribeQuery();
//       unsubscribeMutation();
//     };
//   }, [clientToUse]);

//   return null;
// };

// export default ErrorQueryListener;
