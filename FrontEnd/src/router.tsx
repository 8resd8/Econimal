import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Town from './pages/town/Town';
import CharacterSelect from './pages/character/CharacterSelect';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/town',
    element: <Town />,
  },
  {
    path: '/charsel',
    element: <CharacterSelect />,
  },
]);
