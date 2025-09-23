import CRUDManager from "../components/common/CRUDManager";
import { simService } from "../services/simService";
import { SIM_ENUMS } from "../constants/enums.jsx";
import { useState } from "react";
import "../styles/error.css";

const SIM = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  // Check if SIM is expired
  const isExpired = (tanggalExpired) => {
    return new Date(tanggalExpired) < new Date();
  };

  const columns = [
    {
      key: "nomor_sim",
      title: "Nomor SIM",
      render: (value) => (
        <div className="font-mono text-sm text-gray-900">{value}</div>
      ),
    },
    {
      key: "full_name",
      title: "Nama Lengkap",
      render: (value) => <div className="text-gray-900">{value}</div>,
    },
    {
      key: "nik",
      title: "NIK",
      render: (value) => (
        <div className="font-mono text-sm text-gray-600">{value}</div>
      ),
    },
    {
      key: "jenis_sim",
      title: "Jenis SIM",
      render: (value) => {
        const jenisSim = SIM_ENUMS.JENIS_SIM.find(
          (item) => item.value === value
        );
        return (
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
            {jenisSim ? jenisSim.label : value}
          </span>
        );
      },
    },

    {
      key: "tanggal_expired",
      title: "Tanggal Expired",
      render: (value) => (
        <div className="text-sm">
          <div
            className={`${isExpired(value) ? "text-red-600" : "text-gray-600"}`}
          >
            {value ? new Date(value).toLocaleDateString("id-ID") : "-"}
          </div>
          {isExpired(value) && (
            <span className="inline-flex px-1 py-0.5 text-xs font-semibold rounded bg-red-100 text-red-800 mt-1">
              Expired
            </span>
          )}
        </div>
      ),
    },
    {
      key: "creator_name",
      title: "Dibuat Oleh",
      render: (value) => <div className="text-gray-600">{value || "-"}</div>,
    },
  ];

  const formFields = [
    {
      name: "nomor_sim",
      label: "Nomor SIM",
      type: "text",
      required: false,
      placeholder: "16 digit angka",
      icon: "🚗",
    },
    {
      name: "full_name",
      label: "Nama Lengkap",
      type: "text",
      required: false,
      placeholder: "Nama lengkap sesuai KTP",
      icon: "👤",
    },
    {
      name: "nik",
      label: "NIK",
      type: "text",
      required: false,
      placeholder: "16 digit angka NIK",
      icon: "🆔",
    },
    {
      name: "jenis_sim",
      label: "Jenis SIM",
      type: "select",
      required: false,
      options: SIM_ENUMS.JENIS_SIM,
      icon: "📋",
    },
    {
      name: "tanggal_expired",
      label: "Tanggal Expired",
      type: "date",
      required: false,
      icon: "⏰",
    },
    {
      name: "jenis_kelamin",
      label: "Jenis Kelamin",
      type: "select",
      required: true,
      options: SIM_ENUMS.JENIS_KELAMIN,
      icon: "👤",
    },
    {
      name: "gol_darah",
      label: "Golongan Darah",
      type: "select",
      required: true,
      options: SIM_ENUMS.GOLONGAN_DARAH,
      icon: "🩸",
    },
    {
      name: "tempat_lahir",
      label: "Tempat Lahir",
      type: "text",
      required: false,
      placeholder: "Kota kelahiran",
      icon: "🏙️",
    },
    {
      name: "tanggal_lahir",
      label: "Tanggal Lahir",
      type: "date",
      required: false,
      icon: "📅",
    },
    {
      name: "pekerjaan",
      label: "Pekerjaan",
      type: "text",
      required: false,
      placeholder: "Profesi/pekerjaan",
      icon: "💼",
    },
    {
      name: "rt",
      label: "RT",
      type: "text",
      required: false,
      placeholder: "Nomor RT",
      icon: "🏘️",
    },
    {
      name: "rw",
      label: "RW",
      type: "text",
      required: false,
      placeholder: "Nomor RW",
      icon: "🏘️",
    },
    {
      name: "kecamatan",
      label: "Kecamatan",
      type: "text",
      required: false,
      placeholder: "Nama kecamatan",
      icon: "🏙️",
    },
    {
      name: "kabupaten",
      label: "Kabupaten/Kota",
      type: "text",
      required: false,
      placeholder: "Nama kabupaten/kota",
      icon: "🏙️",
    },
    {
      name: "provinsi",
      label: "Provinsi",
      type: "text",
      required: false,
      placeholder: "Nama provinsi",
      icon: "🏙️",
    },
    {
      name: "picture_path",
      label: "Foto SIM",
      type: "file",
      required: false,
      accept: "image/*",
      icon: "📷",
      renderPreview: (value) => {
        if (!value) return null;

        // Handle jika value adalah File object (saat upload)
        if (value instanceof File) {
          return (
            <div className="mt-2 border rounded-lg overflow-hidden w-full max-w-xs">
              <img
                src={URL.createObjectURL(value)}
                alt="Foto SIM Preview"
                className="w-full h-auto object-contain"
              />
            </div>
          );
        }

        // Handle jika value adalah object dengan property path atau url (dari FormData)
        if (
          typeof value === "object" &&
          (value.path || value.url || value.preview)
        ) {
          const imgSrc = value.url || value.preview || value.path;
          return (
            <div className="mt-2 border rounded-lg overflow-hidden w-full max-w-xs">
              <img
                src={
                  imgSrc.startsWith("http") ||
                  imgSrc.startsWith("blob:") ||
                  imgSrc.startsWith("data:")
                    ? imgSrc
                    : `${import.meta.env.VITE_API_URL || ""}${imgSrc}`
                }
                alt="Foto SIM"
                className="w-full h-auto object-contain"
              />
            </div>
          );
        }

        // Handle jika value adalah string (dari server)
        return (
          <div className="mt-2 border rounded-lg overflow-hidden w-full max-w-xs">
            <img
              src={
                typeof value === "string" &&
                (value.startsWith("http") ||
                  value.startsWith("blob:") ||
                  value.startsWith("data:"))
                  ? value
                  : `${import.meta.env.VITE_API_URL || ""}${value}`
              }
              alt="Foto SIM"
              className="w-full h-auto object-contain"
            />
          </div>
        );
      },
    },
  ];

  // Gunakan objek kosong untuk initialFormData agar form tambah SIM kosong saat dibuka
  const initialFormData = {};

  const validationRules = {
    nomor_sim: {
      required: (_, isCreate) => isCreate, // Hanya required saat create
      label: "Nomor SIM",
      pattern: /^[0-9]{16}$/,
      patternMessage: "Nomor SIM harus 16 digit angka",
    },
    full_name: {
      required: (_, isCreate) => isCreate, // Hanya required saat create
      label: "Nama Lengkap",
      maxLength: 255,
    },
    nik: {
      required: (_, isCreate) => isCreate, // Hanya required saat create
      label: "NIK",
      pattern: /^[0-9]{16}$/,
      patternMessage: "NIK harus 16 digit angka",
    },
    jenis_sim: {
      required: (_, isCreate) => isCreate, // Hanya required saat create
      label: "Jenis SIM",
    },
    tanggal_expired: {
      required: (_, isCreate) => isCreate, // Hanya required saat create
      label: "Tanggal Expired",
    },
    jenis_kelamin: {
      required: (_, isCreate) => isCreate, // Hanya required saat create
      label: "Jenis Kelamin",
    },
    gol_darah: {
      required: (_, isCreate) => isCreate, // Hanya required saat create
      label: "Golongan Darah",
    },
    tempat_lahir: {
      required: (_, isCreate) => isCreate, // Hanya required saat create
      label: "Tempat Lahir",
      maxLength: 100,
    },
    tanggal_lahir: {
      required: (_, isCreate) => isCreate, // Hanya required saat create
      label: "Tanggal Lahir",
    },
    pekerjaan: {
      required: (_, isCreate) => isCreate, // Hanya required saat create
      label: "Pekerjaan",
      maxLength: 100,
    },
    rt: {
      required: (_, isCreate) => isCreate, // Hanya required saat create
      label: "RT",
      maxLength: 10,
    },
    rw: {
      required: (_, isCreate) => isCreate, // Hanya required saat create
      label: "RW",
      maxLength: 10,
    },
    kecamatan: {
      required: (_, isCreate) => isCreate, // Hanya required saat create
      label: "Kecamatan",
      maxLength: 100,
    },
    kabupaten: {
      required: (_, isCreate) => isCreate, // Hanya required saat create
      label: "Kabupaten/Kota",
      maxLength: 100,
    },
    provinsi: {
      required: (_, isCreate) => isCreate, // Hanya required saat create
      label: "Provinsi",
      maxLength: 100,
    },
    picture_path: {
      required: (_, isCreate) => isCreate, // Hanya required saat create
      label: "Foto SIM",
    },
  };

  const filterOptions = [
    {
      key: "jenis_sim",
      label: "Jenis SIM",
      placeholder: "Filter Jenis SIM",
      options: SIM_ENUMS.JENIS_SIM,
    },
    {
      key: "jenis_kelamin",
      label: "Jenis Kelamin",
      placeholder: "Filter Jenis Kelamin",
      options: SIM_ENUMS.JENIS_KELAMIN,
    },
  ];

  // Fungsi untuk menangani error dari CRUDManager
  const handleError = (error) => {
    setErrorMessage(error);
    // Scroll ke atas halaman agar notifikasi error terlihat
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-4">
      {/* Notifikasi Error yang lebih terlihat */}
      {errorMessage && (
        <div className="error-container sticky top-4 z-50 mx-auto max-w-4xl shadow-lg">
          <div className="flex items-center">
            <span className="error-icon text-xl">⚠️</span>
            <h3 className="error-title">Terjadi Kesalahan</h3>
            <button 
              className="ml-auto text-red-700 hover:text-red-900" 
              onClick={() => setErrorMessage(null)}
            >
              ✕
            </button>
          </div>
          <p className="error-message">{errorMessage}</p>
        </div>
      )}

      <CRUDManager
        title="Data SIM"
        description="Kelola data Surat Izin Mengemudi"
        service={simService}
        columns={columns}
        formFields={formFields}
        initialFormData={initialFormData}
        validationRules={validationRules}
        searchPlaceholder="Cari nomor SIM, nama, atau NIK..."
        filterOptions={filterOptions}
        icon="🚗"
        onError={handleError}
      />
    </div>
  );
};

export default SIM;
