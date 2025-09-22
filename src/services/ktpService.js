import { httpClient } from './httpClient.js';
import { API_CONFIG } from '../config/api.js';

// API endpoint untuk KTP
const KTP_API_BASE_URL = 'https://ktp.chasouluix.biz.id/api/ktp';

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
  },

  /**
   * Mengambil semua data KTP dari API eksternal
   * @returns {Promise<Object>} Response data KTP
   */
  async getAllKTP() {
    try {
      const response = await fetch(`${KTP_API_BASE_URL}/all`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching all KTP data:', error);
      throw error;
    }
  },

  /**
   * Mengambil data KTP berdasarkan NIK
   * @param {string} nik - Nomor Induk Kependudukan
   * @returns {Promise<Object>} Response data KTP
   */
  async getKTPByNIK(nik) {
    try {
      if (!nik) {
        throw new Error('NIK tidak boleh kosong');
      }
      
      const response = await fetch(`${KTP_API_BASE_URL}/nik/${nik}`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching KTP data for NIK ${nik}:`, error);
      throw error;
    }
  }
};
