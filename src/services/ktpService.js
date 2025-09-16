import { httpClient } from './httpClient.js';
import { API_CONFIG } from '../config/api.js';

export const ktpService = {
  async getKTPList(params = {}) {
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
  },

  async create(ktpData) {
    return await httpClient.post(API_CONFIG.ENDPOINTS.KTP.BASE, ktpData);
  },

  async update(ktpId, ktpData) {
    return await httpClient.put(API_CONFIG.ENDPOINTS.KTP.BY_ID(ktpId), ktpData);
  },

  async delete(ktpId) {
    return await httpClient.delete(API_CONFIG.ENDPOINTS.KTP.BY_ID(ktpId));
  },

  // Legacy methods for backward compatibility
  async createKTP(ktpData) {
    return this.create(ktpData);
  },

  async updateKTP(ktpId, ktpData) {
    return this.update(ktpId, ktpData);
  },

  async deleteKTP(ktpId) {
    return this.delete(ktpId);
  }
};
