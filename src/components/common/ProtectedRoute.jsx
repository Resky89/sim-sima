import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { selectIsAuthenticated } from '../../redux/authSlice';
import Layout from './Layout'; // Impor komponen Layout

const ProtectedRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Jika sudah terotentikasi, render Layout yang membungkus konten halaman (Outlet)
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default ProtectedRoute;
