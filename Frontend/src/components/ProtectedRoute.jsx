import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

const ProtectedRoute = ({ children }) => {
  const { authUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Optional: Show a loading spinner while checking auth
  }

  return authUser ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
