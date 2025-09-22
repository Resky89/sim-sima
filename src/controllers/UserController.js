import { userService } from '../services/userService';
import User from '../models/User';

/**
 * Controller untuk menangani operasi terkait User
 */
export const UserController = {
  /**
   * Mendapatkan daftar pengguna
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getUsers(req, res) {
    try {
      const params = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        search: req.query.search || '',
        sort_by: req.query.sort_by || 'created_at',
        sort_order: req.query.sort_order || 'desc',
        // Tambahkan filter berdasarkan tampilan Users.jsx
        is_active: req.query.is_active !== undefined ? req.query.is_active : ''
      };

      const response = await userService.getUsers(params);
      return res.json(response);
    } catch (error) {
      console.error('Error in getUsers controller:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Gagal mengambil data pengguna', 
        error: error.message 
      });
    }
  },

  /**
   * Mendapatkan detail pengguna berdasarkan ID
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getUserById(req, res) {
    try {
      const userId = req.params.id;
      const response = await userService.getUserById(userId);
      
      if (response.data) {
        return res.json({
          success: true,
          data: new User(response.data).toJSON()
        });
      }
      
      return res.json(response);
    } catch (error) {
      console.error('Error in getUserById controller:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Gagal mengambil detail pengguna', 
        error: error.message 
      });
    }
  },

  /**
   * Membuat pengguna baru
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async createUser(req, res) {
    try {
      const userData = req.body;
      const user = new User(userData);
      // Menggunakan metode create sesuai dengan userService
      const response = await userService.create(user.toJSON());
      return res.status(201).json(response);
    } catch (error) {
      console.error('Error in createUser controller:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Gagal membuat pengguna baru', 
        error: error.message 
      });
    }
  },

  /**
   * Memperbarui data pengguna
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async updateUser(req, res) {
    try {
      const userId = req.params.id;
      const userData = req.body;
      const user = new User({ id: userId, ...userData });
      // Menggunakan metode update sesuai dengan userService
      const response = await userService.update(userId, user.toJSON());
      return res.json(response);
    } catch (error) {
      console.error('Error in updateUser controller:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Gagal memperbarui data pengguna', 
        error: error.message 
      });
    }
  },

  /**
   * Menghapus pengguna
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async deleteUser(req, res) {
    try {
      const userId = req.params.id;
      // Menggunakan metode delete sesuai dengan userService
      const response = await userService.delete(userId);
      return res.json(response);
    } catch (error) {
      console.error('Error in deleteUser controller:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Gagal menghapus pengguna', 
        error: error.message 
      });
    }
  }
};

export default UserController;