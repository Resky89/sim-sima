// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8026',
  KTP_BASE_URL: 'https://ktp.chasouluix.biz.id/api/ktp',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/admin/login',
      LOGOUT: '/api/auth/admin/logout',
      REFRESH: '/api/auth/admin/refresh',
      ME: '/api/auth/admin/me'
    },
    USERS: {
      BASE: '/api/admin',
      BY_ID: (id) => `/api/admin/${id}`
    },
    KTP: {
      BASE: '/api/ktp',
      BY_ID: (id) => `/api/ktp/${id}`
    },
    SIM: {
      BASE: '/api/sim',
      BY_ID: (id) => `/api/sim/${id}`
    },
    PENDAFTARAN: {
      BASE: '/api/pendaftaran',
      BY_ID: (id) => `/api/pendaftaran/${id}`,
      STATUS: (id) => `/api/pendaftaran/${id}/status`
    },
    SATPAS: {
      BASE: '/api/satpas',
      BY_ID: (id) => `/api/satpas/${id}`
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
