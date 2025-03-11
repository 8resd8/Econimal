import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Town from './pages/Town';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/town',
    element: <Town />,
  },
]);
