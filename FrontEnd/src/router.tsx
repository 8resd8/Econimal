import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Town from './pages/town/Town';
import Login from './pages/Auth/Login';

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
    path: '/login',
    element: <Login />,
  },
]);
