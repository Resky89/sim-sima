// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8026',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      LOGOUT: '/api/auth/logout',
      REFRESH: '/api/auth/refresh',
      ME: '/api/auth/me'
    },
    USERS: {
      BASE: '/api/users',
      BY_ID: (id) => `/api/users/${id}`
    },
    KTP: {
      BASE: '/api/ktp',
      BY_ID: (id) => `/api/ktp/${id}`
    },
    SIM: {
      BASE: '/api/sim',
      BY_ID: (id) => `/api/sim/${id}`
    }
  },
  DEFAULT_PAGINATION: {
    page: 1,
    limit: 10,
    sort_order: 'desc',
    sort_by: 'created_at'
  }
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};
