import { AdminDashboard } from '../components/Dashboard/AdminDashboard';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

export const AdminDashboardPage = () => {
  const { user } = useAuth();

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/" />;
  }

  return <AdminDashboard />;
};