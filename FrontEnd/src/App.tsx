import './App.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { router } from './router';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { TOAST_CONTAINER_ID } from './components/toast/toastUtil';
import AspectRatioContainer from '@/components/AspectRatioContainer'; // 16:9 비율 유지
import ErrorOverlay from './components/ErrorOverlay';
import queryClient from '@/lib/queryClient';
import RotateScreenNotice from './components/lotate-screen/RotateScreenNote';
import PWAInstallNotice from './components/installNotice/PWAInstallNotice';
import { useErrorToastManager } from '@/hooks/useErrorToastManager';
import BackgroundMusic from './components/gamBgm/BackgroundMusic';
// import QueryDevtools from '@/utils/dev/QueryDevtools'; // 개발환경에서만 -> 제대로 적용안되네

const App = () => {
  const { isError } = useErrorToastManager(); // 에러 상태 관리 및 토스트 제어를 위한 커스텀 훅

  return (
    <QueryClientProvider client={queryClient}>
      {/* <QueryDevtools> */}
      <BackgroundMusic
        src='/assets/sounds/eco_friendly_bgm.mp3'
        initialVolume={0.3}
      />
      <AspectRatioContainer>
        <RouterProvider router={router} />
      </AspectRatioContainer>

      <RotateScreenNotice />
      <PWAInstallNotice />

      {/* 에러 상태가 아닐 때만 ToastContainer 렌더링 */}
      {!isError && (
        <ToastContainer
          containerId={TOAST_CONTAINER_ID}
          draggable={false}
          pauseOnHover={false}
        />
      )}

      <ErrorOverlay />
      {/* </QueryDevtools> */}
    </QueryClientProvider>
  );
};

export default App;
