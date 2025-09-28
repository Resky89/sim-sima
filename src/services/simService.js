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
    
    return await httpClient.get(API_CONFIG.ENDPOINTS.SIM.BASE, queryParams);
  },

  async getSIMById(simId) {
    return await httpClient.get(API_CONFIG.ENDPOINTS.SIM.BY_ID(simId));
  },

  async create(simData) {
    return await httpClient.post(API_CONFIG.ENDPOINTS.SIM.BASE, simData);
  },

  async update(simId, simData) {
    return await httpClient.put(API_CONFIG.ENDPOINTS.SIM.BY_ID(simId), simData);
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
