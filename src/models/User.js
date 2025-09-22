/**
 * Model User
 * Representasi data pengguna dalam aplikasi
 */
class User {
  constructor(data = {}) {
    this.id = data.id || null;
    this.username = data.username || '';
    this.email = data.email || '';
    this.name = data.name || '';
    this.role = data.role || 'user';
    this.created_at = data.created_at || new Date().toISOString();
    this.updated_at = data.updated_at || new Date().toISOString();
  }

  /**
   * Mengubah objek User menjadi format JSON
   * @returns {Object} Representasi JSON dari User
   */
  toJSON() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      name: this.name,
      role: this.role,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }

  /**
   * Membuat instance User dari data JSON
   * @param {Object} json - Data JSON
   * @returns {User} Instance User baru
   */
  static fromJSON(json) {
    return new User(json);
  }
}

export default User;