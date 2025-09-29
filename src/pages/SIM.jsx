import CRUDManager from "../components/common/CRUDManager";
import { simService } from "../services/simService";
import { ktpService } from "../services/ktpService";
import { SIM_ENUMS } from "../constants/enums.jsx";
import { useState, useEffect } from "react";
import "../styles/error.css";

const SIM = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [nikOptions, setNikOptions] = useState([]);

  // Helper: map nilai KTP ke enum SIM
  const mapJenisKelamin = (jk) => {
    if (!jk) return "";
    const v = String(jk).toUpperCase();
    if (v === "L" || v.includes("LAKI")) return "laki_laki";
    if (v === "P" || v.includes("PEREMPUAN")) return "perempuan";
    return "";
  };

  const mapGolDarah = (gd) => {
    if (!gd) return "";
    const v = String(gd).toUpperCase();
    if (["A", "B", "AB", "O"].includes(v)) return v.toLowerCase();
    if (v === "TIDAK_TAHU" || v === "-" || v === "UNKNOWN") return "tidak_tahu";
    return "";
  };

  const toDateInput = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const da = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${da}`;
  };

  // Formatting helpers for SIM Detail Card
  const formatDateID = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? "-" : d.toLocaleDateString("id-ID");
  };

  const formatNomorSim = (num) => {
    if (!num) return "-";
    const digits = String(num).replace(/\D/g, "");
    return digits.replace(/(.{4})/g, "$1-").replace(/-$/, "");
  };

  const getJenisSimText = (value) => {
    const found = SIM_ENUMS.JENIS_SIM.find((i) => i.value === value);
    return found?.label || (value ? String(value).toUpperCase() : "-");
  };

  const getJenisSimCode = (value) => (value ? String(value).toUpperCase() : "-");

  const getGenderText = (val) => {
    if (!val) return "-";
    const v = String(val).toLowerCase();
    if (v.includes("laki")) return "PRIA";
    if (v.includes("perempuan")) return "PEREMPUAN";
    return String(val).toUpperCase();
  };

  const getGolDarahText = (v) => {
    if (!v) return "-";
    const u = String(v).toLowerCase();
    if (["a", "b", "ab", "o"].includes(u)) return u.toUpperCase();
    if (u === "tidak_tahu") return "TIDAK TAHU";
    return String(v).toUpperCase();
  };

  const formatAlamat = (item) => {
    const parts = [];
    if (item.rt || item.rw) parts.push(`RT ${item.rt || '-'} / RW ${item.rw || '-'}`);
    if (item.kecamatan) parts.push(item.kecamatan);
    if (item.kabupaten) parts.push(item.kabupaten);
    if (item.provinsi) parts.push(item.provinsi);
    return parts.length ? parts.join(", ") : "-";
  };

  const getImageSrc = (val) => {
    if (!val) return null;
    if (typeof val === "string") {
      if (val.startsWith("http") || val.startsWith("blob:") || val.startsWith("data:")) return val;
      return `${import.meta.env.VITE_API_URL || ""}${val}`;
    }
    if (typeof val === "object" && (val.url || val.preview || val.path)) {
      const imgSrc = val.url || val.preview || val.path;
      if (imgSrc.startsWith("http") || imgSrc.startsWith("blob:") || imgSrc.startsWith("data:")) return imgSrc;
      return `${import.meta.env.VITE_API_URL || ""}${imgSrc}`;
    }
    return null;
  };

  const renderSIMView = (item) => {
    const nomorSim = formatNomorSim(item.nomor_sim);
    const jenisSimCode = getJenisSimCode(item.jenis_sim);
    const jenisSimText = getJenisSimText(item.jenis_sim);
    const ttl = [item.tempat_lahir, formatDateID(item.tanggal_lahir)].filter(Boolean).join(", ");
    const golKel = `${getGolDarahText(item.gol_darah)} - ${getGenderText(item.jenis_kelamin)}`;
    const pekerjaan = item.pekerjaan || "-";
    const alamat = formatAlamat(item);
    const photo = getImageSrc(item.picture_path);

    return (
      <div className="max-w-3xl mx-auto">
        <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200">
          {/* Header */}
          <div className="bg-red-600 text-white p-4 sm:p-5 flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="hidden sm:block text-2xl">🛡️</div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold tracking-widest">INDONESIA</div>
                <div className="text-xs sm:text-sm tracking-widest uppercase opacity-90">SURAT IJIN MENGEMUDI</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] sm:text-xs uppercase opacity-90">DRIVING LICENCE</div>
              <div className="text-2xl sm:text-4xl font-extrabold leading-none">{jenisSimCode}</div>
            </div>
          </div>

          {/* Body */}
          <div className="relative bg-gray-50 p-4 sm:p-6">
            {/* Nomor SIM */}
            <div className="absolute right-4 top-4 text-gray-800 font-mono font-semibold text-sm sm:text-base">
              {nomorSim}
            </div>

            <div className="grid grid-cols-3 gap-4 sm:gap-6">
              {/* Photo */}
              <div className="col-span-1 flex items-start">
                <div className="h-28 w-28 sm:h-32 sm:w-32 bg-white rounded-lg overflow-hidden border-4 border-gray-300 shadow-inner flex items-center justify-center">
                  {photo ? (
                    <img src={photo} alt="Foto SIM" className="h-full w-full object-cover" />
                  ) : (
                    <div className="text-gray-400 text-6xl leading-none">👤</div>
                  )}
                </div>
              </div>

              {/* Details list */}
              <div className="col-span-2">
                <ol className="space-y-2 text-gray-900 text-sm sm:text-base font-semibold">
                  <li className="flex"><span className="w-6">1.</span><span className="flex-1">{item.full_name || "-"}</span></li>
                  <li className="flex"><span className="w-6">2.</span><span className="flex-1">{item.nik || "-"}</span></li>
                  <li className="flex"><span className="w-6">3.</span><span className="flex-1">{golKel}</span></li>
                  <li className="flex"><span className="w-6">4.</span><span className="flex-1">{ttl}</span></li>
                  <li className="flex"><span className="w-6">5.</span><span className="flex-1">{pekerjaan}</span></li>
                  <li className="flex"><span className="w-6">6.</span><span className="flex-1">{alamat}</span></li>
                </ol>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 flex items-end justify-between">
              <div className="text-xs sm:text-sm text-gray-600">
                <div className="font-semibold">{jenisSimText}</div>
              </div>
              <div className="text-right text-xs sm:text-sm text-gray-800 font-semibold">
                {formatDateID(item.tanggal_expired)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Load daftar NIK dari endpoint KTP (tampilkan NIK pada dropdown)
  useEffect(() => {
    const loadNIKs = async () => {
      try {
        const res = await ktpService.getAllKTP();
        const items = Array.isArray(res) ? res : (res?.data || []);
        const uniq = new Map();
        items.forEach((it) => {
          if (it?.nik) uniq.set(it.nik, { value: it.nik, label: it.nik });
        });
        setNikOptions(Array.from(uniq.values()));
      } catch (e) {
        setErrorMessage("Gagal memuat daftar NIK dari data KTP");
      }
    };
    loadNIKs();
  }, []);
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
      type: "select",
      required: false,
      placeholder: "Pilih NIK",
      options: nikOptions,
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

  // Callback perubahan form: saat NIK dipilih, ambil data KTP by NIK dan isi otomatis field terkait
  const handleSIMFormChange = async ({ field, value, setFormData }) => {
    if (field !== "nik" || !value) return;
    try {
      const res = await ktpService.getKTPByNIK(value);
      const ktp = res?.data ?? res; // dukung bentuk {success, data} atau langsung objek
      if (!ktp || !ktp.nik) return;

      const autofill = {
        full_name: ktp.nama_lengkap || "",
        jenis_kelamin: mapJenisKelamin(ktp.jenis_kelamin),
        gol_darah: mapGolDarah(ktp.golongan_darah),
        tempat_lahir: ktp.tempat_lahir || "",
        tanggal_lahir: toDateInput(ktp.tanggal_lahir),
        pekerjaan: ktp.pekerjaan || "",
        rt: ktp.rt || "",
        rw: ktp.rw || "",
        kecamatan: ktp.kecamatan || "",
        kabupaten: ktp.kabupaten || "",
        provinsi: ktp.provinsi || "",
      };

      // Jangan menimpa: nomor_sim, jenis_sim, picture_path, tanggal_expired
      setFormData((prev) => ({
        ...prev,
        ...autofill,
        nik: value,
      }));
    } catch (e) {
      setErrorMessage("Gagal mengambil data KTP berdasarkan NIK");
    }
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
        onFormChange={handleSIMFormChange}
        renderView={renderSIMView}
      />
    </div>
  );
};

export default SIM;
