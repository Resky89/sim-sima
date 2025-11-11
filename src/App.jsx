import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { authService } from './services/authService';
import { selectIsAuthLoading, setLoading, logOut } from './redux/authSlice';
import { store } from './redux/store';
import ProtectedRoute from './components/common/ProtectedRoute';
import GuestRoute from './components/common/GuestRoute';
import LoginPage from './pages/Login.jsx';
import DashboardPage from './pages/Dashboard.jsx';
import KTPListPage from './pages/KTP.jsx';
import SIMListPage from './pages/SIM.jsx';
import SatpasListPage from './pages/Satpas.jsx';
import UserListPage from './pages/Users.jsx';
import ProfilePage from './pages/Profile.jsx';

function App() {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsAuthLoading);

  useEffect(() => {
    const validateSession = async () => {
      const token = store.getState().auth.accessToken;
      if (token) {
        try {
          await authService.getProfile();
        } catch (error) {
          console.error("Session validation failed on app load:", error.message);
          dispatch(logOut());
        } finally {
          if (store.getState().auth.loading) {
            dispatch(setLoading(false));
          }
        }
      } else {
        dispatch(setLoading(false));
      }
    };

    validateSession();
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute />}>
        <Route index element={<DashboardPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="ktp" element={<KTPListPage />} />
        <Route path="sim" element={<SIMListPage />} /> 
        <Route path="satpas" element={<SatpasListPage />} />
        <Route path="users" element={<UserListPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="/" element={<GuestRoute />}>
        <Route path="login" element={<LoginPage />} />
      </Route>
    </Routes>
  );
}

export default App;
