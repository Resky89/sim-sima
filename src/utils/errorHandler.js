// Error handler utility - Display server error messages directly
export const getErrorMessage = (error) => {
  // Handle network errors
  if (!error.response) {
    return 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
  }

  const errorData = error.response?.data || error;

  // First priority: Use server error messages directly
  if (errorData.errors) {
    return handleValidationErrors(errorData.errors);
  }

  if (errorData.message) {
    return errorData.message;
  }

  // Fallback for specific status codes if no server message
  const status = error.response?.status || error.status;
  switch (status) {
    case 400:
      return 'Permintaan tidak valid.';
    case 401:
      return 'Tidak memiliki akses. Silakan login kembali.';
    case 403:
      return 'Akses ditolak.';
    case 404:
      return 'Data tidak ditemukan.';
    case 409:
      return 'Data sudah ada dalam sistem.';
    case 422:
      return 'Data tidak dapat diproses.';
    case 500:
      return 'Terjadi kesalahan pada server.';
    case 503:
      return 'Layanan tidak tersedia.';
    default:
      return 'Terjadi kesalahan yang tidak diketahui.';
  }
};

// Handle validation errors from API
const handleValidationErrors = (errors) => {
  if (!errors) return null;

  // If errors is a string
  if (typeof errors === 'string') {
    return errors;
  }

  // If errors is an array of validation errors
  if (Array.isArray(errors)) {
    const errorMessages = errors.map(error => {
      if (typeof error === 'string') {
        return error;
      }
      if (error.message) {
        return `${error.path ? error.path + ': ' : ''}${error.message}`;
      }
      return 'Validation error';
    });
    
    return errorMessages.join(', ');
  }

  // If errors is an object
  if (typeof errors === 'object') {
    const errorMessages = Object.entries(errors).map(([field, message]) => {
      return `${field}: ${message}`;
    });
    
    return errorMessages.join(', ');
  }

  return null;
};

// Specific error messages for form validation
export const getFieldErrorMessage = (field, value) => {
  switch (field) {
    case 'email':
      if (!value) return 'Email wajib diisi';
      if (!/\S+@\S+\.\S+/.test(value)) return 'Format email tidak valid';
      if (value.length > 255) return 'Email maksimal 255 karakter';
      break;

    case 'password':
      if (!value) return 'Password wajib diisi';
      if (value.length < 8) return 'Password minimal 8 karakter';
      if (value.length > 255) return 'Password maksimal 255 karakter';
      break;

    case 'full_name':
      if (!value) return 'Nama lengkap wajib diisi';
      if (value.length > 255) return 'Nama lengkap maksimal 255 karakter';
      break;

    case 'nik':
      if (!value) return 'NIK wajib diisi';
      if (!/^\d{16}$/.test(value)) return 'NIK harus 16 digit angka';
      break;

    case 'alamat':
      if (!value) return 'Alamat wajib diisi';
      if (value.length > 1000) return 'Alamat maksimal 1000 karakter';
      break;

    case 'tempat_lahir':
      if (!value) return 'Tempat lahir wajib diisi';
      if (value.length > 100) return 'Tempat lahir maksimal 100 karakter';
      break;

    case 'tanggal_lahir':
      if (!value) return 'Tanggal lahir wajib diisi';
      if (new Date(value) > new Date()) return 'Tanggal lahir tidak boleh di masa depan';
      break;

    case 'pekerjaan':
      if (!value) return 'Pekerjaan wajib diisi';
      if (value.length > 100) return 'Pekerjaan maksimal 100 karakter';
      break;

    case 'kewarganegaraan':
      if (!value) return 'Kewarganegaraan wajib diisi';
      if (value.length > 50) return 'Kewarganegaraan maksimal 50 karakter';
      break;

    case 'nomor_sim':
      if (!value) return 'Nomor SIM wajib diisi';
      if (!/^\d{16}$/.test(value)) return 'Nomor SIM harus 16 digit angka';
      break;

    case 'tanggal_terbit':
      if (!value) return 'Tanggal terbit wajib diisi';
      if (new Date(value) > new Date()) return 'Tanggal terbit tidak boleh di masa depan';
      break;

    case 'tanggal_expired':
      if (!value) return 'Tanggal expired wajib diisi';
      if (new Date(value) <= new Date()) return 'Tanggal expired harus di masa depan';
      break;

    case 'ktp_id':
      if (!value) return 'Data KTP wajib dipilih';
      break;

    default:
      return null;
  }
  
  return null;
};
