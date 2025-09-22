/**
 * Model SIM
 * Representasi data Surat Izin Mengemudi dalam aplikasi
 */
class SIM {
  constructor(data = {}) {
    this.id = data.id || null;
    this.user_id = data.user_id || null;
    this.no_pengajuan = data.no_pengajuan || '';
    this.no_sim = data.no_sim || '';
    this.nik = data.nik || '';
    this.nama_lengkap = data.nama_lengkap || '';
    this.tempat_lahir = data.tempat_lahir || '';
    this.tanggal_lahir = data.tanggal_lahir || null;
    this.jenis_kelamin = data.jenis_kelamin || '';
    this.tinggi_badan = data.tinggi_badan || null;
    this.pekerjaan = data.pekerjaan || '';
    this.alamat = data.alamat || '';
    this.provinsi = data.provinsi || '';
    this.kabupaten = data.kabupaten || '';
    this.kecamatan = data.kecamatan || '';
    this.kelurahan = data.kelurahan || '';
    this.jenis_sim = data.jenis_sim || '';
    this.ktp_path = data.ktp_path || null;
    this.pas_foto_path = data.pas_foto_path || null;
    this.surat_kesehatan_path = data.surat_kesehatan_path || null;
    this.status = data.status || 'pending';
    this.catatan = data.catatan || null;
    this.tanggal_pengajuan = data.tanggal_pengajuan || new Date().toISOString();
    this.tanggal_selesai = data.tanggal_selesai || null;
    this.tanggal_berlaku = data.tanggal_berlaku || null;
    this.tanggal_expired = data.tanggal_expired || null;
    this.created_at = data.created_at || new Date().toISOString();
    this.updated_at = data.updated_at || new Date().toISOString();
    this.user_name = data.user_name || '';
    this.user_email = data.user_email || '';
  }

  /**
   * Mengubah objek SIM menjadi format JSON
   * @returns {Object} Representasi JSON dari SIM
   */
  toJSON() {
    return {
      id: this.id,
      user_id: this.user_id,
      no_pengajuan: this.no_pengajuan,
      no_sim: this.no_sim,
      nik: this.nik,
      nama_lengkap: this.nama_lengkap,
      tempat_lahir: this.tempat_lahir,
      tanggal_lahir: this.tanggal_lahir,
      jenis_kelamin: this.jenis_kelamin,
      tinggi_badan: this.tinggi_badan,
      pekerjaan: this.pekerjaan,
      alamat: this.alamat,
      provinsi: this.provinsi,
      kabupaten: this.kabupaten,
      kecamatan: this.kecamatan,
      kelurahan: this.kelurahan,
      jenis_sim: this.jenis_sim,
      ktp_path: this.ktp_path,
      pas_foto_path: this.pas_foto_path,
      surat_kesehatan_path: this.surat_kesehatan_path,
      status: this.status,
      catatan: this.catatan,
      tanggal_pengajuan: this.tanggal_pengajuan,
      tanggal_selesai: this.tanggal_selesai,
      tanggal_berlaku: this.tanggal_berlaku,
      tanggal_expired: this.tanggal_expired,
      created_at: this.created_at,
      updated_at: this.updated_at,
      user_name: this.user_name,
      user_email: this.user_email
    };
  }

  /**
   * Membuat instance SIM dari data JSON
   * @param {Object} json - Data JSON
   * @returns {SIM} Instance SIM baru
   */
  static fromJSON(json) {
    return new SIM(json);
  }
}

export default SIM;