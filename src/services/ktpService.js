import { httpClient } from './httpClient.js';
import { API_CONFIG } from '../config/api.js';

export const ktpService = {
  async getKTPs(params = {}) {
    const queryParams = {
      page: 1,
      limit: 10,
      sort_by: 'created_at',
      sort_order: 'desc',
      ...params
    };
    
    return await httpClient.get(API_CONFIG.ENDPOINTS.KTP.BASE, queryParams);
  },

  async getKTPById(ktpId) {
    return await httpClient.get(API_CONFIG.ENDPOINTS.KTP.BY_ID(ktpId));
  }
};
