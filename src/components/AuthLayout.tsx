import { useContext } from 'react';
import { AppContext } from '../App';
import { Navigate, Outlet } from 'react-router-dom';

export default function AuthLayout(): JSX.Element {
  const { user } = useContext(AppContext);

  if (user) return <Outlet />;

  return <Navigate to='/login' />;
}
