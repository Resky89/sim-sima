import { httpClient } from './httpClient.js';
import { API_CONFIG } from '../config/api.js';
import { store } from '../redux/store';
import { setCredentials, logOut } from '../redux/authSlice';

export const authService = {
  async login(email, password) {
    const response = await httpClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    });

    if (response.success) {
      const resData = response?.data || {};
      const tokens = resData?.tokens || resData?.data?.tokens || {};
      const user = resData?.user || resData?.admin || resData?.data?.user || resData?.data?.admin || null;
      store.dispatch(
        setCredentials({
          user,
          accessToken: tokens?.access_token || tokens?.accessToken || null,
          csrfToken: tokens?.csrf_token || tokens?.csrfToken || null,
        })
      );
      return response;
    }

    throw new Error(response.errors || 'Login failed');
  },

  async logout() {
    try {
      await httpClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, {});
    } catch (error) {
      console.error('Logout API call failed, but logging out on client-side.', error);
    } finally {
      // Always dispatch logout to clear the state and persisted data
      store.dispatch(logOut());
    }
  },

  async getProfile() {
    const response = await httpClient.get(API_CONFIG.ENDPOINTS.AUTH.ME);

    if (response.success) {
      const resData = response?.data || {};
      const profile = resData?.user || resData?.admin || resData;
      const currentState = store.getState().auth;
      store.dispatch(setCredentials({ ...currentState, user: profile }));
      return profile;
    }

    throw new Error(response.errors || 'Failed to get profile');
  },

  async refreshToken() {
    const response = await httpClient.post(API_CONFIG.ENDPOINTS.AUTH.REFRESH);

    if (response.success) {
      const { tokens, user } = response.data;
      setToken(tokens.access_token);
      setUser(user);
      return response;
    }

    throw new Error(response.errors || 'Token refresh failed');
  },
};

