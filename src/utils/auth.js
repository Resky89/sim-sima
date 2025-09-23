// Authentication utilities
const TOKEN_KEY = 'sima_access_token';
const REFRESH_TOKEN_KEY = 'sima_refresh_token';
const USER_KEY = 'sima_user';
const CSRF_TOKEN_KEY = 'sima_csrf_token';

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setRefreshToken = (token) => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

export const getCsrfToken = () => {
  return localStorage.getItem(CSRF_TOKEN_KEY);
};

export const setCsrfToken = (token) => {
  localStorage.setItem(CSRF_TOKEN_KEY, token);
};

export const setTokens = (accessToken, refreshToken, csrfToken) => {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  if (csrfToken) {
    localStorage.setItem(CSRF_TOKEN_KEY, csrfToken);
  }
};

export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const setUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(CSRF_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const isAuthenticated = () => {
  return !!getToken();
};
