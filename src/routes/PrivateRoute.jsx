import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/stores.jsx';

function PrivateRoute({ children }) {
  const token = useAuth((state) => state.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default PrivateRoute;
