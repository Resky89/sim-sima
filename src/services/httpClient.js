import { API_CONFIG } from '../config/api.js';
import { getToken, removeToken, getCsrfToken, setToken } from '../utils/auth.js';
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
      // Refresh token sekarang disimpan di httpOnly cookie
      // Kita tidak perlu mengirimkannya secara manual
      const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.AUTH.REFRESH}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Penting: untuk mengirim cookies
      });

      const data = await response.json();

      if (!response.ok) {
        // If refresh token is also expired, logout user
        if (response.status === 401) {
          removeToken();
          window.location.href = '/login';
          throw new Error('Session expired');
        }
        throw new Error(data.errors || data.message || 'Token refresh failed');
      }

      if (data.success && data.data.tokens.access_token) {
        setToken(data.data.tokens.access_token);
        return data.data.tokens.access_token;
      }

      throw new Error('Invalid token response');
    } catch (error) {
      removeToken();
      window.location.href = '/login';
      throw error;
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    let token = getToken();
    
    const makeRequest = async (accessToken) => {
      // Tambahkan CSRF token untuk operasi mutasi (POST, PUT, DELETE)
      const method = options.method || 'GET';
      const needsCsrfToken = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method);
      
      // Skip CSRF token untuk endpoint login
      const isLoginEndpoint = endpoint === API_CONFIG.ENDPOINTS.AUTH.LOGIN;
      
      // Dapatkan CSRF token dari cookie jika diperlukan
      const csrfToken = needsCsrfToken && !isLoginEndpoint ? getCsrfToken() : null;
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          ...(csrfToken && { 'X-CSRF-Token': csrfToken }),
          ...options.headers
        },
        credentials: 'include', // Penting: untuk mengirim cookies
        ...options
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
      return await makeRequest(token);
    } catch (error) {
      // If token expired, try to refresh it
      if (error.status === 401 && token && !this.isRefreshing) {
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
          this.onRefreshed(newToken);
          this.isRefreshing = false;
          
          // Retry the original request with new token
          return await makeRequest(newToken);
        } catch (refreshError) {
          this.isRefreshing = false;
          // If refresh fails, logout user
          removeToken();
          window.location.href = '/login';
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
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data, headers = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers
    });
  }

  delete(endpoint, headers = {}) {
    return this.request(endpoint, { 
      method: 'DELETE',
      headers 
    });
  }
}

export const httpClient = new HttpClient();
