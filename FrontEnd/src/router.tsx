import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Town from './pages/town/Town';
import CharacterSelect from './pages/character/CharacterSelect';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/SignUp';
import MyCharacter from './pages/character/MyCharacter';
import Earth from './pages/earth/Earth';

export const router = createBrowserRouter([
  {
    path: '/',
    // element: <Home />,
    element: <MyCharacter />,
  },
  {
    path: '/town',
    element: <Town />,
  },
  {
    path: '/charsel',
    element: <CharacterSelect />,
  },
  // {
  //   path: '/my',
  //   element: <MyCharacter />,
  // },
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
]);
