import { API_CONFIG } from '../config/api.js';
import { store } from '../redux/store';
import { setCredentials, logOut } from '../redux/authSlice';
import { getErrorMessage } from '../utils/errorHandler.js';

class HttpClient {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.isRefreshing = false;
    this.refreshSubscribers = [];
  }

  // Add request to queue while token is being refreshed
  addRefreshSubscriber(callback) {
    this.refreshSubscribers.push(callback);
  }

  // Execute all queued requests after token refresh
  onRefreshed(token) {
    this.refreshSubscribers.map(callback => callback(token));
    this.refreshSubscribers = [];
  }

  // Refresh access token using refresh token
  async refreshAccessToken() {
    try {
      const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.AUTH.REFRESH}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const err = new Error((data && (data.errors || data.message)) || 'Session expired');
        err.status = response.status;
        throw err;
      }

      // Normalize tokens shape from server
      const tokens = data?.data?.tokens || data?.tokens || data;
      if (tokens) {
        const { user } = store.getState().auth; // Ambil user dari state
        const accessToken = tokens.accessToken || tokens.access_token;
        const csrfToken = tokens.csrfToken || tokens.csrf_token;
        store.dispatch(setCredentials({ user, accessToken, csrfToken }));
        return accessToken;
      }

      throw new Error('Invalid token response');
    } catch (error) {
      // Jika refresh gagal total, dispatch logout
      store.dispatch(logOut());
      throw error;
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const { accessToken, csrfToken } = store.getState().auth;
    
    const makeRequest = async (token) => {
      // Tambahkan CSRF token untuk operasi mutasi (POST, PUT, DELETE)
      const method = options.method || 'GET';
      const needsCsrfToken = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method);
      
      // Skip CSRF token untuk endpoint login dan refresh SAJA (logout tetap butuh CSRF)
      const isAuthEndpoint = endpoint === API_CONFIG.ENDPOINTS.AUTH.LOGIN || 
                             endpoint === API_CONFIG.ENDPOINTS.AUTH.REFRESH;
      
      const currentCsrfToken = needsCsrfToken && !isAuthEndpoint ? store.getState().auth.csrfToken : null;
      
      const { headers: optionHeaders, ...restOptions } = options;
      const isFormDataBody = restOptions && restOptions.body instanceof FormData;

      const config = {
        headers: {
          // Set Content-Type hanya jika bukan FormData
          ...(isFormDataBody ? {} : { 'Content-Type': 'application/json' }),
          ...optionHeaders,
          ...(token && { Authorization: `Bearer ${token}` }),
          ...(currentCsrfToken && { 'X-CSRF-Token': currentCsrfToken }),
        },
        credentials: 'include', // Penting: untuk mengirim cookies
        ...restOptions,
      };

      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(getErrorMessage(errorData));
        error.status = response.status;
        error.response = { status: response.status, data: errorData };
        throw error;
      }

      return await response.json();
    };

    try {
      return await makeRequest(accessToken);
    } catch (error) {
      // If token expired or unauthorized, try to refresh it
      const status = error.status || error.response?.status;
      const shouldRefresh = [401, 403, 419].includes(status);
      // Jangan pernah refresh saat request adalah endpoint LOGIN
      const isLoginRequest = endpoint === API_CONFIG.ENDPOINTS.AUTH.LOGIN;
      if (shouldRefresh && !isLoginRequest) {
        if (this.isRefreshing) {
          // If refresh is in progress, queue this request
          return new Promise((resolve, reject) => {
            this.addRefreshSubscriber((newToken) => {
              makeRequest(newToken).then(resolve).catch(reject);
            });
          });
        }

        try {
          this.isRefreshing = true;
          const newToken = await this.refreshAccessToken();
          this.isRefreshing = false;
          this.onRefreshed(newToken);
          // Retry the original request with new token
          return await makeRequest(newToken);
        } catch (refreshError) {
          this.isRefreshing = false;
          // store.dispatch(logOut()) sudah dipanggil di dalam refreshAccessToken, jadi kita hanya perlu melempar error.
          throw refreshError;
        }
      }

      throw error;
    }
  }

  get(endpoint, params = {}) {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        searchParams.append(key, params[key]);
      }
    });
    
    const queryString = searchParams.toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, { method: 'GET' });
  }

  post(endpoint, data = {}) {
    const isFormData = data instanceof FormData;
    const body = isFormData ? data : JSON.stringify(data);
    const headers = isFormData ? {} : { 'Content-Type': 'application/json' };

    return this.request(endpoint, {
      method: 'POST',
      body,
      headers,
    });
  }

  put(endpoint, data) {
    const isFormData = data instanceof FormData;
    const body = isFormData ? data : JSON.stringify(data);
    const headers = isFormData ? {} : { 'Content-Type': 'application/json' };

    return this.request(endpoint, {
      method: 'PUT',
      body,
      headers,
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { 
      method: 'DELETE',
    });
  }
}

export const httpClient = new HttpClient();
