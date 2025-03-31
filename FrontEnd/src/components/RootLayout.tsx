import { Outlet } from 'react-router-dom';
import EventDetector from '../components/EventDetector';

// 모든 라우트의 루트 레이아웃 컴포넌트
const RootLayout = () => {
  return (
    <>
      <EventDetector />
      <Outlet />
    </>
  );
};

export default RootLayout;