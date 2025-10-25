import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FaSpinner } from 'react-icons/fa';

const AdminRoute = () => {
  const { isAuthenticated, roles, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <FaSpinner className="animate-spin text-primary text-4xl" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!roles.includes('ADMIN')) {
    return <Navigate to="/forbidden" />;
  }

  return <Outlet />;
};

export default AdminRoute;
