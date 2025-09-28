// Authentication utilities
const USER_KEY = 'sima_user';

// Fungsi untuk mendapatkan cookies berdasarkan nama
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

// Fungsi untuk menghapus cookie
const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export const getToken = () => {
  // Access token tidak disimpan di cookies karena sudah ada di memory aplikasi
  // Kita hanya perlu menyimpan user data di localStorage
  return sessionStorage.getItem('access_token');
};

export const setToken = (token) => {
  sessionStorage.setItem('access_token', token);
};

export const getRefreshToken = () => {
  // Refresh token disimpan di httpOnly cookie oleh backend
  // Frontend tidak perlu mengakses refresh token secara langsung
  return null;
};

export const getCsrfToken = () => {
  // CSRF token disimpan di cookie oleh backend
  return getCookie('csrf-token');
};

export const setTokens = (accessToken) => {
  sessionStorage.setItem('access_token', accessToken);
};

export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const setUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const removeToken = () => {
  sessionStorage.removeItem('access_token');
  localStorage.removeItem(USER_KEY);
  // Hapus cookies yang mungkin ada
  deleteCookie('refresh_token');
  deleteCookie('csrf-token');
};

export const isAuthenticated = () => {
  return !!getToken();
};
