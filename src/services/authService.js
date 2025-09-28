import { httpClient } from './httpClient.js';
import { API_CONFIG } from '../config/api.js';
import { setTokens, setToken, setUser, removeToken } from '../utils/auth.js';

export const authService = {
  async login(email, password) {
    const response = await httpClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
      email,
      password
    });

    if (response.success) {
      const { tokens, user } = response.data;
      setTokens(tokens.access_token);
      setUser(user);
      return response;
    }

    throw new Error(response.errors || 'Login failed');
  },

  async logout() {
    try {
      await httpClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, {});
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      removeToken();
    }
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

  async getProfile() {
    const response = await httpClient.get(API_CONFIG.ENDPOINTS.AUTH.ME);
    
    if (response.success) {
      setUser(response.data);
      return response.data;
    }

    throw new Error(response.errors || 'Failed to get profile');
  }
};
