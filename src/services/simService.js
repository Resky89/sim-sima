import { httpClient } from './httpClient.js';
import { API_CONFIG } from '../config/api.js';

export const simService = {
  async getSIMList(params = {}) {
    const queryParams = {
      page: 1,
      limit: 10,
      sort_by: 'created_at',
      sort_order: 'desc',
      ...params
    };
    const resp = await httpClient.get(API_CONFIG.ENDPOINTS.SIM.BASE, queryParams);
    // Normalize response to a common shape expected by useCRUD
    if (resp && typeof resp === 'object') {
      const success = resp.success !== undefined ? resp.success : true;
      const items = Array.isArray(resp.data)
        ? resp.data
        : Array.isArray(resp?.data?.items)
          ? resp.data.items
          : Array.isArray(resp?.items)
            ? resp.items
            : Array.isArray(resp?.data?.data)
              ? resp.data.data
              : [];
      const pagination = resp.pagination || resp?.data?.pagination || resp?.meta || {};
      return { ...resp, success, data: items, pagination };
    }
    return resp;
  },

  async getSIMById(simId) {
    return await httpClient.get(API_CONFIG.ENDPOINTS.SIM.BY_ID(simId));
  },

  async create(simData) {
    return await httpClient.post(API_CONFIG.ENDPOINTS.SIM.BASE, simData);
  },

  async update(simId, simData) {
    // API uses PATCH for SIM update per Postman collection
    return await httpClient.patch(API_CONFIG.ENDPOINTS.SIM.BY_ID(simId), simData);
  },

  async delete(simId) {
    return await httpClient.delete(API_CONFIG.ENDPOINTS.SIM.BY_ID(simId));
  },

  // Legacy methods for backward compatibility
  async createSIM(simData) {
    return this.create(simData);
  },

  async updateSIM(simId, simData) {
    return this.update(simId, simData);
  },

  async deleteSIM(simId) {
    return this.delete(simId);
  }
};
