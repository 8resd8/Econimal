import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Town from './pages/town/Town';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/SignUp';

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
  {
    path: '/signup',
    element: <Signup />
  },
]);
