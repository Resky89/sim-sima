import { httpClient } from './httpClient.js';
import { API_CONFIG } from '../config/api.js';

export const pendaftaranService = {
  async getList(params = {}) {
    const queryParams = {
      page: 1,
      limit: 10,
      sort_by: 'created_at',
      sort_order: 'desc',
      ...params,
    };

    const resp = await httpClient.get(API_CONFIG.ENDPOINTS.PENDAFTARAN.BASE, queryParams);
    // Normalize common response shapes
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

  async getById(id) {
    return await httpClient.get(API_CONFIG.ENDPOINTS.PENDAFTARAN.BY_ID(id));
  },

  async update(id, data) {
    if (data && Object.prototype.hasOwnProperty.call(data, 'status')) {
      const resp = await httpClient.patch(API_CONFIG.ENDPOINTS.PENDAFTARAN.STATUS(id), { status: data.status });
      return (resp && typeof resp === 'object' && Object.prototype.hasOwnProperty.call(resp, 'success'))
        ? resp
        : { success: true, ...resp };
    }
    const resp = await httpClient.put(API_CONFIG.ENDPOINTS.PENDAFTARAN.BY_ID(id), data);
    return (resp && typeof resp === 'object' && Object.prototype.hasOwnProperty.call(resp, 'success'))
      ? resp
      : { success: true, ...resp };
  },

  async updateStatus(id, status) {
    const resp = await httpClient.patch(API_CONFIG.ENDPOINTS.PENDAFTARAN.STATUS(id), { status });
    return (resp && typeof resp === 'object' && Object.prototype.hasOwnProperty.call(resp, 'success'))
      ? resp
      : { success: true, ...resp };
  },
};
