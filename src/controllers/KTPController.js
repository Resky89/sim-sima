import { ktpService } from '../services/ktpService';
import KTP from '../models/KTP';

/**
 * Controller untuk menangani operasi terkait KTP
 */
export const KTPController = {
  /**
   * Mendapatkan semua data KTP dari API eksternal
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getAllKTP(req, res) {
    try {
      const response = await ktpService.getAllKTP();
      return res.json(response);
    } catch (error) {
      console.error('Error in getAllKTP controller:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Gagal mengambil semua data KTP dari API eksternal', 
        error: error.message 
      });
    }
  },

  /**
   * Mendapatkan data KTP berdasarkan NIK dari API eksternal
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getKTPByNIK(req, res) {
    try {
      const nik = req.params.nik;
      if (!nik) {
        return res.status(400).json({
          success: false,
          message: 'NIK tidak boleh kosong'
        });
      }
      
      const response = await ktpService.getKTPByNIK(nik);
      return res.json(response);
    } catch (error) {
      console.error(`Error in getKTPByNIK controller:`, error);
      return res.status(500).json({ 
        success: false, 
        message: 'Gagal mengambil data KTP berdasarkan NIK', 
        error: error.message 
      });
    }
  }
};

export default KTPController;