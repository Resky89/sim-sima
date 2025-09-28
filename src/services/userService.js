import { httpClient } from './httpClient.js';
import { API_CONFIG } from '../config/api.js';

export const userService = {
  async getUsers(params = {}) {
    const queryParams = {
      page: 1,
      limit: 10,
      sort_by: 'created_at',
      sort_order: 'desc',
      ...params
    };
    
    return await httpClient.get(API_CONFIG.ENDPOINTS.USERS.BASE, queryParams);
  },

  async getUserById(userId) {
    return await httpClient.get(API_CONFIG.ENDPOINTS.USERS.BY_ID(userId));
  },

  async create(userData) {
    return await httpClient.post(API_CONFIG.ENDPOINTS.USERS.BASE, userData);
  },

  async update(userId, userData) {
    return await httpClient.put(API_CONFIG.ENDPOINTS.USERS.BY_ID(userId), userData);
  },

  async delete(userId) {
    return await httpClient.delete(API_CONFIG.ENDPOINTS.USERS.BY_ID(userId));
  },

  // Legacy methods for backward compatibility
  async createUser(userData) {
    return this.create(userData);
  },

  async updateUser(userId, userData) {
    return this.update(userId, userData);
  },

  async deleteUser(userId) {
    return this.delete(userId);
  }
};
