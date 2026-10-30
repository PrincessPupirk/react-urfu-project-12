import { Outlet } from 'react-router-dom';
import AppHeader from '../components/AppHeader.jsx';

function AppLayout() {
  return (
    <>
      <AppHeader />
      <Outlet />
    </>
  );
}

export default AppLayout;
