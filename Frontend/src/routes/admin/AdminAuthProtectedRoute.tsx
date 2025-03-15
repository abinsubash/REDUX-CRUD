import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

interface AdminAuthProtectedRouteProps {
  children: React.ReactNode;
}

export const AdminAuthProtectedRoute: React.FC<AdminAuthProtectedRouteProps> = ({ children }) => {
  const admin = useSelector((state: RootState) => state.admin);

  // If admin is already authenticated, redirect to admin home
  if (admin.isAuthenticated && admin.accessToken) {
    return <Navigate to="/adminHome" />;
  }

  return <>{children}</>;
};