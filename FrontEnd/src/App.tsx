import './App.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { router } from './router';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { TOAST_CONTAINER_ID } from './components/toast/toastUtil';
import AspectRatioContainer from '@/components/AspectRatioContainer'; // 16:9 비율 유지
import ErrorOverlay from './components/ErrorOverlay';
import queryClient from '@/lib/queryClient';
import QueryDevtools from '@/utils/dev/QueryDevtools'; // 개발환경에서만
import { RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import RotateScreenNotice from './components/lotate-screen/RotateScreenNote';

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <QueryDevtools>
        <AspectRatioContainer>
          <RouterProvider router={router} />
        </AspectRatioContainer>
        {/* 토스트 컨테이너에 ID 추가 및 옵션 명시적 설정 */}
        <RotateScreenNotice />
        <ToastContainer
          containerId={TOAST_CONTAINER_ID}
          draggable={false}
          pauseOnHover={false}
        />
        <ErrorOverlay />
      </QueryDevtools>
    </QueryClientProvider>
  );
};

export default App;
