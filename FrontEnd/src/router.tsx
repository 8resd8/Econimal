import { createBrowserRouter } from 'react-router-dom';
// import Home from './pages/Home';
import Town from './pages/town/Town';
import CharacterSelect from './pages/character/CharacterSelect';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/SignUp';
import MyPage from './pages/Auth/UserInfo';
import Earth from './pages/earth/Earth';
import Animation from './pages/animation/Animation';
import Edit from './pages/Auth/InfoEdit';
import MyCharacter from './pages/character/MyCharacter';
import CharacterShop from './pages/character/feature/shop/ItemShop';
import PrologVideo from './components/PrologVideo';

import NetworkErrorScreen from './components/ErrorScreen';
import LoadingScreen from './components/LoadingScreen';
import NotFoundScreen from './components/NotFoundScreen';

import ProtectedRoute from './components/ProtectedRoute';
import PublicOnlyRoute from './components/PublicOnlyRoute';
import RootLayout from '@/components/RootLayout';

// 인증이 불필요하지만 로그인한 사용자는 접근 불가한 라우트
const publicOnlyRoutes = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
];

// 인증 여부와 관계없이 모두 접근 가능한 라우트
const publicRoutes = [
  {
    path: '/prolog',
    element: (
      <PrologVideo
        onComplete={() => localStorage.setItem('prologViewed', 'true')}
      />
    ),
  },
  // 에러 및 로딩 페이지 테스트(추후 삭제 예정)
  {
    path: '/error',
    element: <NetworkErrorScreen />,
  },
  {
    path: '/loading',
    element: <LoadingScreen />,
  },
  {
    path: '*',
    element: <NotFoundScreen />,
  },
];

// 보호된 라우트트(인증 필요)
const protectedRoutes = [
  {
    index: true,
    // element: <Home />,
    element: <MyCharacter />,
  },
  {
    path: '/store',
    element: <CharacterShop />,
  },
  {
    path: '/town',
    element: <Town />,
  },
  {
    path: '/charsel',
    element: <CharacterSelect />,
  },
  {
    path: '/my',
    element: <MyPage />,
  },
  {
    path: '/earth',
    element: <Earth />,
  },
  {
    path: '/animation',
    element: <Animation />,
  },
  {
    path: '/edit-profile',
    element: <Edit />,
  },
  {
    path: '/shop',
    element: <CharacterShop />,
  },
];

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />, // 루트 레이아웃(이벤트 감지기)으로 모든 라우트를 감싸기
    children: [
      // 인증이 필요한 라우트는 ProtectedRoute로 감싸기
      {
        element: <ProtectedRoute />,
        children: protectedRoutes,
      },
      // 인증된 사용자가 접근하면 리다이렉트되는 라우트(로그인, 회원가입)
      {
        element: <PublicOnlyRoute />,
        children: publicOnlyRoutes,
      },
      // 인증 상태와 관계없이 모두 접근 가능한 라우트
      ...publicRoutes,
    ],
  },
]);