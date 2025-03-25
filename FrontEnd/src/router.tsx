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
import CharacterShop from './pages/character/componet/shop/CharacterShop';

export const router = createBrowserRouter([
  {
    path: '/',
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
]);
