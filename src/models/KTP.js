/**
 * Model KTP
 * Representasi data Kartu Tanda Penduduk dalam aplikasi
 */
class KTP {
  constructor(data = {}) {
    this.id = data.id || null;
    this.user_id = data.user_id || null;
    this.no_pengajuan = data.no_pengajuan || '';
    this.nik = data.nik || '';
    this.nama_lengkap = data.nama_lengkap || '';
    this.tempat_lahir = data.tempat_lahir || '';
    this.tanggal_lahir = data.tanggal_lahir || null;
    this.jenis_kelamin = data.jenis_kelamin || '';
    this.golongan_darah = data.golongan_darah || '';
    this.agama = data.agama || '';
    this.status_perkawinan = data.status_perkawinan || '';
    this.pekerjaan = data.pekerjaan || '';
    this.kewarganegaraan = data.kewarganegaraan || 'WNI';
    this.alamat = data.alamat || '';
    this.provinsi = data.provinsi || '';
    this.kabupaten = data.kabupaten || '';
    this.kecamatan = data.kecamatan || '';
    this.kelurahan = data.kelurahan || '';
    this.rt = data.rt || '';
    this.rw = data.rw || '';
    this.kode_pos = data.kode_pos || '';
    this.no_telepon = data.no_telepon || '';
    this.akta_kelahiran_path = data.akta_kelahiran_path || null;
    this.kartu_keluarga_path = data.kartu_keluarga_path || null;
    this.pas_foto_path = data.pas_foto_path || null;
    this.status = data.status || 'pending';
    this.catatan = data.catatan || null;
    this.tanggal_pengajuan = data.tanggal_pengajuan || new Date().toISOString();
    this.tanggal_selesai = data.tanggal_selesai || null;
    this.created_at = data.created_at || new Date().toISOString();
    this.updated_at = data.updated_at || new Date().toISOString();
    this.user_name = data.user_name || '';
    this.user_email = data.user_email || '';
  }

  /**
   * Mengubah objek KTP menjadi format JSON
   * @returns {Object} Representasi JSON dari KTP
   */
  toJSON() {
    return {
      id: this.id,
      user_id: this.user_id,
      no_pengajuan: this.no_pengajuan,
      nik: this.nik,
      nama_lengkap: this.nama_lengkap,
      tempat_lahir: this.tempat_lahir,
      tanggal_lahir: this.tanggal_lahir,
      jenis_kelamin: this.jenis_kelamin,
      golongan_darah: this.golongan_darah,
      agama: this.agama,
      status_perkawinan: this.status_perkawinan,
      pekerjaan: this.pekerjaan,
      kewarganegaraan: this.kewarganegaraan,
      alamat: this.alamat,
      provinsi: this.provinsi,
      kabupaten: this.kabupaten,
      kecamatan: this.kecamatan,
      kelurahan: this.kelurahan,
      rt: this.rt,
      rw: this.rw,
      kode_pos: this.kode_pos,
      no_telepon: this.no_telepon,
      akta_kelahiran_path: this.akta_kelahiran_path,
      kartu_keluarga_path: this.kartu_keluarga_path,
      pas_foto_path: this.pas_foto_path,
      status: this.status,
      catatan: this.catatan,
      tanggal_pengajuan: this.tanggal_pengajuan,
      tanggal_selesai: this.tanggal_selesai,
      created_at: this.created_at,
      updated_at: this.updated_at,
      user_name: this.user_name,
      user_email: this.user_email
    };
  }

  /**
   * Membuat instance KTP dari data JSON
   * @param {Object} json - Data JSON
   * @returns {KTP} Instance KTP baru
   */
  static fromJSON(json) {
    return new KTP(json);
  }
}

export default KTP;