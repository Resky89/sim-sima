import { httpClient } from './httpClient.js';
import { API_CONFIG } from '../config/api.js';

export const satpasService = {
  async getList(params = {}) {
    const queryParams = {
      page: 1,
      limit: 10,
      sort_by: 'created_at',
      sort_order: 'desc',
      ...params,
    };

    return await httpClient.get(API_CONFIG.ENDPOINTS.SATPAS.BASE, queryParams);
  },

  async getSatpasList(params = {}) {
    // Alias for clarity when used elsewhere
    return this.getList(params);
  },

  async getById(satpasId) {
    return await httpClient.get(API_CONFIG.ENDPOINTS.SATPAS.BY_ID(satpasId));
  },

  async getSatpasById(satpasId) {
    // Alias for clarity
    return this.getById(satpasId);
  },

  async create(satpasData) {
    return await httpClient.post(API_CONFIG.ENDPOINTS.SATPAS.BASE, satpasData);
  },

  async update(satpasId, satpasData) {
    return await httpClient.put(API_CONFIG.ENDPOINTS.SATPAS.BY_ID(satpasId), satpasData);
  },

  async delete(satpasId) {
    return await httpClient.delete(API_CONFIG.ENDPOINTS.SATPAS.BY_ID(satpasId));
  },

  // Legacy-style aliases for consistency with other services
  async createSatpas(data) {
    return this.create(data);
  },
  async updateSatpas(id, data) {
    return this.update(id, data);
  },
  async deleteSatpas(id) {
    return this.delete(id);
  },
};
