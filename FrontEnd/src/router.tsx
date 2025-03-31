import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Town from './pages/town/Town';
import CharacterSelect from './pages/character/CharacterSelect';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/SignUp';
import MyPage from './pages/Auth/UserInfo';
import Earth from './pages/earth/Earth';
import Animation from './pages/animation/Animation';
import Edit from './pages/Auth/InfoEdit';
import MyCharacter from './pages/character/MyCharacter';
import CharacterShop from './pages/character/componet/shop/ItemShop';
import PrologVideo from './components/PrologVideo';

import NetworkErrorScreen from './components/ErrorScreen';
import LoadingScreen from './components/LoadingScreen';
import NotFoundScreen from './components/NotFoundScreen';
// import ProtectedRoute from './components/ProtectedRoute';

import RootLayout from '@/components/RootLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />, // 루트 레이아웃으로 모든 라우트를 감싸기
    children: [
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
        path: '/login',
        element: <Login />,
      },
      {
        path: '/signup',
        element: <Signup />,
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
    ],
    // {
    //   path: '/login',
    //   element: <Login />,
    // },
    // {
    //   path: '/signup',
    //   element: <Signup />,
    // },
    // {
    //   path: '/prolog',
    //   element: (
    //     <PrologVideo
    //       onComplete={() => localStorage.setItem('prologViewed', 'true')}
    //     />
    //   ),
    // },

    // 보호된 경로 (로그인 필요)
    // {
    //   element: <ProtectedRoute />,
    //   children: [
    //     {
    //       path: '/',
    //       element: <MyCharacter />,
    //     },
    //     {
    //       path: '/store',
    //       element: <CharacterShop />,
    //     },
    //     {
    //       path: '/town',
    //       element: <Town />,
    //     },
    //     {
    //       path: '/charsel',
    //       element: <CharacterSelect />,
    //     },
    //     {
    //       path: '/my',
    //       element: <MyPage />,
    //     },
    //     {
    //       path: '/earth',
    //       element: <Earth />,
    //     },
    //     {
    //       path: '/animation',
    //       element: <Animation />,
    //     },
    //     {
    //       path: '/edit-profile',
    //       element: <Edit />,
    //     },
    //     {
    //       path: '/shop',
    //       element: <CharacterShop />,
    //     },
    //   ]
    // },

    // 에러 및 로딩 페이지
    //   {
    //     path: '/error',
    //     element: <NetworkErrorScreen />,
    //   },
    //   {
    //     path: '/loading',
    //     element: <LoadingScreen />,
    //   },
    //   {
    //     path: '*',
    //     element: <NotFoundScreen />,
    //   },
  },
]);
