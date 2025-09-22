import { simService } from '../services/simService';
import SIM from '../models/SIM';

/**
 * Controller untuk menangani operasi terkait SIM
 */
export const SIMController = {
  /**
   * Mendapatkan daftar SIM
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getSIMs(req, res) {
    try {
      const params = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        search: req.query.search || '',
        sort_by: req.query.sort_by || 'created_at',
        sort_order: req.query.sort_order || 'desc',
        // Tambahkan filter berdasarkan tampilan SIM.jsx
        jenis_sim: req.query.jenis_sim || '',
        jenis_kelamin: req.query.jenis_kelamin || ''
      };

      const response = await simService.getSIMList(params);
      return res.json(response);
    } catch (error) {
      console.error('Error in getSIMs controller:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Gagal mengambil data SIM', 
        error: error.message 
      });
    }
  },

  /**
   * Mendapatkan detail SIM berdasarkan ID
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getSIMById(req, res) {
    try {
      const simId = req.params.simId;
      const response = await simService.getSIMById(simId);
      
      if (response.data) {
        return res.json({
          success: true,
          status_code: 200,
          message: 'Operasi berhasil',
          data: new SIM(response.data).toJSON()
        });
      }
      
      return res.json(response);
    } catch (error) {
      console.error('Error in getSIMById controller:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Gagal mengambil detail SIM', 
        error: error.message 
      });
    }
  },

  /**
   * Membuat SIM baru
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async createSIM(req, res) {
    try {
      const simData = req.body;
      const sim = new SIM(simData);
      const response = await simService.create(sim.toJSON());
      return res.status(201).json(response);
    } catch (error) {
      console.error('Error in createSIM controller:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Gagal membuat SIM baru', 
        error: error.message 
      });
    }
  },

  /**
   * Memperbarui data SIM
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async updateSIM(req, res) {
    try {
      const simId = req.params.id;
      const simData = req.body;
      const sim = new SIM({ id: simId, ...simData });
      const response = await simService.update(simId, sim.toJSON());
      return res.json(response);
    } catch (error) {
      console.error('Error in updateSIM controller:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Gagal memperbarui data SIM', 
        error: error.message 
      });
    }
  },

  /**
   * Menghapus SIM
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async deleteSIM(req, res) {
    try {
      const simId = req.params.id;
      const response = await simService.delete(simId);
      return res.json(response);
    } catch (error) {
      console.error('Error in deleteSIM controller:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Gagal menghapus SIM', 
        error: error.message 
      });
    }
  }
};

export default SIMController;