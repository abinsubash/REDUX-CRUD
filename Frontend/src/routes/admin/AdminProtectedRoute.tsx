import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const adminState = useSelector((state: RootState) => state.admin);
  console.log(adminState)
  if (!adminState.accessToken) {
    return <Navigate to="/adminLogin" />;
  }

  // Verify admin status
  if (!adminState.admin?.isAdmin) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};