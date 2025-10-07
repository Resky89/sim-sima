import CRUDManager from "../components/common/CRUDManager";
import { simService } from "../services/simService";
import { ktpService } from "../services/ktpService";
import { SIM_ENUMS, KTP_ENUMS } from "../constants/enums.jsx";
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

  // Transform data sebelum submit: kirim hanya path untuk picture_path dan hapus field internal
  const beforeSubmitSIM = (data) => {
    const out = { ...data };
    // Hapus flag internal agar tidak terkirim ke backend
    if (Object.prototype.hasOwnProperty.call(out, "locked_by_ktp")) {
      delete out.locked_by_ktp;
    }
    if (Object.prototype.hasOwnProperty.call(out, "_ktp")) {
      delete out._ktp;
    }
    const v = out.picture_path;
    if (v instanceof File) {
      // Untuk sementara, gunakan pola path statis berbasis nama file
      out.picture_path = `/uploads/sim/${v.name}`;
    } else if (v && typeof v === "object") {
      const src = v.url || v.preview || v.path;
      if (src) out.picture_path = src;
    } // jika string, biarkan apa adanya
    return out;
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

  // Normalize key: lowercased, remove spaces and underscores
  const normalizeJenisSimKey = (val) =>
    (val ?? "")
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[\s_]/g, "");

  const getJenisSimText = (value) => {
    const key = normalizeJenisSimKey(value);
    const found = SIM_ENUMS.JENIS_SIM.find(
      (i) => normalizeJenisSimKey(i.value) === key
    );
    return found?.label || (value ? getJenisSimCode(value) : "-");
  };

  const getJenisSimCode = (value) => {
    const key = normalizeJenisSimKey(value);
    const map = {
      a: "A",
      aumum: "A UMUM",
      bi: "B I",
      biumum: "B I UMUM",
      bii: "B II",
      biiumum: "B II UMUM",
      c: "C",
      ci: "C I",
      cii: "C II",
      d: "D",
      di: "D I",
      b1: "B I",
      b2: "B II",
      c1: "C I",
      c2: "C II",
    };
    return map[key] || (value ? String(value).toUpperCase() : "-");
  };

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

  // Vehicle info mapping per jenis SIM
  const getVehicleInfo = (jenis) => {
    const key = normalizeJenisSimKey(jenis);
    if (key === "c") return { icon: "🏍️", vehicle: "Motor", ccInfo: "≤ 250 cc" };
    if (key === "ci" || key === "c1") return { icon: "🏍️", vehicle: "Motor", ccInfo: "250–500 cc" };
    if (key === "cii" || key === "c2") return { icon: "🏍️", vehicle: "Motor", ccInfo: "≥ 500 cc" };
    if (key === "bi" || key === "b1" || key === "biumum") return { icon: "🚚", vehicle: "Kendaraan Barang/Bus (B I)", ccInfo: null };
    if (key === "bii" || key === "b2" || key === "biiumum") return { icon: "🚛", vehicle: "Kendaraan Berat (B II)", ccInfo: null };
    if (key === "d" || key === "di") return { icon: "♿", vehicle: "Khusus Disabilitas", ccInfo: null };
    // default A / A Umum
    return { icon: "🚗", vehicle: "Mobil (A)", ccInfo: null };
  };

  // Badge color classes per jenis SIM
  const getSimBadgeClasses = (jenis) => {
    const key = normalizeJenisSimKey(jenis);
    const map = {
      a: "bg-emerald-100 text-emerald-800 border-emerald-200",
      aumum: "bg-emerald-100 text-emerald-800 border-emerald-200",
      bi: "bg-orange-100 text-orange-800 border-orange-200",
      biumum: "bg-orange-100 text-orange-800 border-orange-200",
      bii: "bg-red-100 text-red-800 border-red-200",
      biiumum: "bg-red-100 text-red-800 border-red-200",
      c: "bg-blue-100 text-blue-800 border-blue-200",
      ci: "bg-purple-100 text-purple-800 border-purple-200",
      cii: "bg-indigo-100 text-indigo-800 border-indigo-200",
      d: "bg-gray-200 text-gray-800 border-gray-300",
      di: "bg-gray-200 text-gray-800 border-gray-300",
      // backward compatibility
      b1: "bg-orange-100 text-orange-800 border-orange-200",
      b2: "bg-red-100 text-red-800 border-red-200",
      c1: "bg-purple-100 text-purple-800 border-purple-200",
      c2: "bg-indigo-100 text-indigo-800 border-indigo-200",
    };
    return map[key] || "bg-slate-100 text-slate-800 border-slate-200";
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
    const vehicleInfo = getVehicleInfo(item.jenis_sim);

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
              <div className="text-xs sm:text-sm text-gray-800 font-semibold flex items-center gap-2">
                <span className="text-base">{vehicleInfo.icon}</span>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded border border-gray-300 text-gray-800 bg-white">
                  {jenisSimText}
                </span>
                {vehicleInfo.ccInfo ? (
                  <span className="text-gray-600">• {vehicleInfo.ccInfo}</span>
                ) : null}
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
        const v = normalizeJenisSimKey(value);
        const jenisSim = SIM_ENUMS.JENIS_SIM.find(
          (item) => normalizeJenisSimKey(item.value) === v
        );
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getSimBadgeClasses(value)}`}>
            {jenisSim ? jenisSim.label : getJenisSimCode(value)}
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

  // Form fields: hanya tampilkan field manual (NIK, jenis SIM, tanggal expired, upload gambar)
  const formFields = () => {
    const baseFields = [
      {
        name: "nik",
        label: "NIK",
        type: "select",
        required: true,
        placeholder: "Pilih NIK",
        options: nikOptions,
        icon: "🆔",
      },
      {
        name: "jenis_sim",
        label: "Jenis SIM",
        type: "select",
        required: true,
        options: SIM_ENUMS.JENIS_SIM,
        icon: "📋",
      },
      {
        name: "tanggal_expired",
        label: "Tanggal Expired",
        type: "date",
        required: true,
        icon: "⏰",
      },
      {
        name: "picture_path",
        label: "Foto SIM",
        type: "file",
        required: true,
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

    return baseFields;
  };

  // Gunakan objek kosong untuk initialFormData agar form tambah SIM kosong saat dibuka
  const initialFormData = {};

  const validationRules = {
    nik: {
      required: (_, isCreate) => isCreate,
      label: "NIK",
      pattern: /^[0-9]{16}$/,
      patternMessage: "NIK harus 16 digit angka",
    },
    jenis_sim: {
      required: (_, isCreate) => isCreate,
      label: "Jenis SIM",
    },
    tanggal_expired: {
      required: (_, isCreate) => isCreate,
      label: "Tanggal Expired",
    },
    picture_path: {
      required: (_, isCreate) => isCreate,
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
      options: KTP_ENUMS.JENIS_KELAMIN,
    },
  ];

  // Fungsi untuk menangani error dari CRUDManager
  const handleError = (error) => {
    setErrorMessage(error);
    // Scroll ke atas halaman agar notifikasi error terlihat
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Callback perubahan form: saat NIK dipilih, ambil data KTP by NIK, isi otomatis field terkait, dan simpan detail KTP untuk kartu
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
        locked_by_ktp: true,
        _ktp: ktp,
      }));
    } catch (e) {
      setErrorMessage("Gagal mengambil data KTP berdasarkan NIK");
    }
  };

  // Komponen inline untuk menampilkan kartu detail KTP ketika NIK dipilih
  const KTPDetailInline = ({ formData, setFormData }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
      const ensureKTP = async () => {
        if (!formData?.nik) return;
        if (formData?._ktp && formData?._ktp?.nik === formData.nik) return;
        setLoading(true);
        setError("");
        try {
          const res = await ktpService.getKTPByNIK(formData.nik);
          const ktp = res?.data ?? res;
          if (ktp && ktp.nik) {
            setFormData((prev) => ({ ...prev, _ktp: ktp }));
          }
        } catch (err) {
          setError("Gagal memuat detail KTP");
        } finally {
          setLoading(false);
        }
      };
      ensureKTP();
    }, [formData?.nik]);

    const item = formData?._ktp;
    if (!formData?.nik) {
      return (
        <div className="mb-2 text-sm text-gray-600">Pilih NIK untuk melihat detail KTP.</div>
      );
    }
    if (loading) {
      return <div className="text-sm text-gray-600">Memuat detail KTP...</div>;
    }
    if (error) {
      return <div className="text-sm text-red-600">{error}</div>;
    }
    if (!item) return null;

    return (
      <div className="p-3 border-2 border-gray-200 rounded-md bg-blue-50">
        <div className="text-center mb-2">
          <div className="font-bold text-sm">PROVINSI {item.provinsi}</div>
          <div className="font-semibold text-xs">KABUPATEN {item.kabupaten}</div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="col-span-2 space-y-1">
            <div className="grid grid-cols-3 gap-x-1">
              <div className="font-semibold">NIK</div>
              <div className="col-span-2">: {item.nik}</div>
              <div className="font-semibold">Nama</div>
              <div className="col-span-2">: {item.nama_lengkap}</div>
              <div className="font-semibold">Tempat/Tgl Lahir</div>
              <div className="col-span-2">: {item.tempat_lahir}, {formatDateID(item.tanggal_lahir)}</div>
              <div className="font-semibold">Jenis Kelamin</div>
              <div className="col-span-2">: {item.jenis_kelamin === 'L' ? 'LAKI-LAKI' : 'PEREMPUAN'}</div>
              <div className="font-semibold">Gol Darah</div>
              <div className="col-span-2">: {item.golongan_darah}</div>
              <div className="font-semibold">Alamat</div>
              <div className="col-span-2">: {item.alamat}</div>
              <div className="font-semibold">RT/RW</div>
              <div className="col-span-2">: {item.rt}/{item.rw}</div>
              <div className="font-semibold">Kel/Desa</div>
              <div className="col-span-2">: {item.kelurahan}</div>
              <div className="font-semibold">Kecamatan</div>
              <div className="col-span-2">: {item.kecamatan}</div>
              <div className="font-semibold">Agama</div>
              <div className="col-span-2">: {item.agama}</div>
              <div className="font-semibold">Status Perkawinan</div>
              <div className="col-span-2">: {item.status_perkawinan}</div>
              <div className="font-semibold">Pekerjaan</div>
              <div className="col-span-2">: {item.pekerjaan}</div>
              <div className="font-semibold">Kewarganegaraan</div>
              <div className="col-span-2">: {item.kewarganegaraan}</div>
            </div>
          </div>
          <div className="col-span-1 flex flex-col items-center">
            <div className="border border-gray-300 h-24 w-20 bg-white flex items-center justify-center">
              {item.pas_foto_path ? (
                <img src={item.pas_foto_path} alt="Foto KTP" className="max-h-full max-w-full object-cover" />
              ) : (
                <div className="text-gray-400 text-[10px] text-center">Foto tidak tersedia</div>
              )}
            </div>
            <div className="text-[10px] text-center mt-1 text-gray-600">
              {item.kabupaten}, {formatDateID(item.tanggal_selesai)}
            </div>
          </div>
        </div>
      </div>
    );
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
        onBeforeSubmit={beforeSubmitSIM}
        renderView={renderSIMView}
        renderCreateExtra={({ formData, setFormData }) => (
          <KTPDetailInline formData={formData} setFormData={setFormData} />
        )}
        renderEditExtra={({ formData, setFormData }) => (
          <KTPDetailInline formData={formData} setFormData={setFormData} />
        )}
      />
    </div>
  );
};

export default SIM;
