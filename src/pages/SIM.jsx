import CRUDManager from "../components/common/CRUDManager";
import { simService } from "../services/simService";
import { pendaftaranService } from "../services/pendaftaranService";
import { SIM_ENUMS, KTP_ENUMS } from "../constants/enums.jsx";
import { useState, useEffect } from "react";
import { API_CONFIG } from "../config/api.js";
import "../styles/error.css";

const SIM = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [pendaftaranOptions, setPendaftaranOptions] = useState([]);

  const beforeSubmitSIM = (data) => {
    console.log('beforeSubmitSIM - Original data:', data);
    
    // Validasi field wajib
    const errors = [];
    
    if (!data.pendaftaran_id) {
      errors.push('Pendaftaran ID harus dipilih');
    }
    
    if (!data.tanggal_terbit) {
      errors.push('Tanggal terbit harus diisi');
    }
    
    if (!data.tanggal_expired) {
      errors.push('Tanggal expired harus diisi');
    }
    
    // Validasi picture dengan berbagai format yang mungkin
    const hasPicture = 
      (data.picture instanceof File) ||
      (data.picture instanceof FileList && data.picture.length > 0) ||
      (data.picture && typeof data.picture === 'object' && data.picture.file instanceof File);
    
    if (!hasPicture) {
      errors.push('Foto SIM harus dilampirkan');
    }
    
    // Jika ada error, throw error untuk ditangani oleh CRUDManager
    if (errors.length > 0) {
      const errorMsg = 'Validasi gagal:\\n' + errors.join('\\n');
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    // Siapkan FormData sesuai permintaan Postman
    const formData = new FormData();
    
    // Wajib: pendaftaran_id
    formData.append("pendaftaran_id", data.pendaftaran_id);
    console.log('Added pendaftaran_id:', data.pendaftaran_id);
    
    // Wajib: tanggal_terbit (YYYY-MM-DD)
    formData.append("tanggal_terbit", data.tanggal_terbit);
    console.log('Added tanggal_terbit:', data.tanggal_terbit);
    
    // Wajib: tanggal_expired (YYYY-MM-DD)
    formData.append("tanggal_expired", data.tanggal_expired);
    console.log('Added tanggal_expired:', data.tanggal_expired);
    
    // Wajib: picture (File)
    let pictureFile = null;
    if (data.picture instanceof File) {
      pictureFile = data.picture;
    } else if (data.picture instanceof FileList && data.picture.length > 0) {
      pictureFile = data.picture[0];
    } else if (data.picture && typeof data.picture === 'object' && data.picture.file instanceof File) {
      pictureFile = data.picture.file;
    }
    
    if (pictureFile) {
      formData.append("picture", pictureFile);
      console.log('Added picture:', pictureFile.name, 'Size:', pictureFile.size, 'bytes');
    }
    
    // Log semua entries dalam FormData untuk debugging
    console.log('FormData entries:');
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}:`, value.name, `(${value.size} bytes)`);
      } else {
        console.log(`  ${key}:`, value);
      }
    }

    return formData;
  };

  const formatDateID = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? "-" : d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  const formatNomorSim = (num) => {
    if (!num) return "-";
    const digits = String(num).replace(/\D/g, "");
    return digits.replace(/(.{4})/g, "$1-").replace(/-$/, "");
  };

  const normalizeJenisSimKey = (val) =>
    (val ?? "")
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[\s_]/g, "");

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
    const v = String(val).toUpperCase().trim();
    if (v === "L" || v.includes("LAKI")) return "PRIA";
    if (v === "P" || v.includes("PEREMPUAN")) return "WANITA";
    return v;
  };

  const getGolDarahText = (v) => {
    if (!v) return "-";
    const u = String(v).toLowerCase();
    if (["a", "b", "ab", "o"].includes(u)) return u.toUpperCase();
    if (u === "tidak_tahu") return "-";
    return String(v).toUpperCase();
  };

  const getVehicleInfo = (jenis) => {
    const key = normalizeJenisSimKey(jenis);
    if (key === "c") return { icon: "🏍️", vehicle: "Motor", ccInfo: "≤ 250 cc", color: "blue" };
    if (key === "ci" || key === "c1") return { icon: "🏍️", vehicle: "Motor", ccInfo: "250–500 cc", color: "purple" };
    if (key === "cii" || key === "c2") return { icon: "🏍️", vehicle: "Motor Besar", ccInfo: "≥ 500 cc", color: "indigo" };
    if (key === "bi" || key === "b1" || key === "biumum") return { icon: "🚚", vehicle: "Truk/Bus", ccInfo: null, color: "orange" };
    if (key === "bii" || key === "b2" || key === "biiumum") return { icon: "🚛", vehicle: "Truk Berat", ccInfo: null, color: "red" };
    if (key === "d" || key === "di") return { icon: "♿", vehicle: "Khusus", ccInfo: null, color: "gray" };
    return { icon: "🚗", vehicle: "Mobil", ccInfo: null, color: "emerald" };
  };

  const getSimBadgeClasses = (jenis) => {
    const key = normalizeJenisSimKey(jenis);
    const map = {
      a: "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border-emerald-200",
      aumum: "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border-emerald-200",
      bi: "bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 border-orange-200",
      biumum: "bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 border-orange-200",
      bii: "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200",
      biiumum: "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200",
      c: "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-200",
      ci: "bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 border-purple-200",
      cii: "bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 border-indigo-200",
      d: "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border-gray-300",
      di: "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border-gray-300",
      b1: "bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 border-orange-200",
      b2: "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200",
      c1: "bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 border-purple-200",
      c2: "bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 border-indigo-200",
    };
    return map[key] || "bg-gradient-to-r from-slate-50 to-gray-50 text-slate-700 border-slate-200";
  };

  const dmyToISO = (s) => {
    if (!s) return null;
    const str = String(s).trim();
    const parts = str.split(/[\/-]/);
    if (parts.length !== 3) return null;
    const [a, b, c] = parts;
    if (a.length === 4) return `${a.padStart(4, "0")}-${b.padStart(2, "0")}-${c.padStart(2, "0")}`;
    if (c.length === 4) return `${c.padStart(4, "0")}-${b.padStart(2, "0")}-${a.padStart(2, "0")}`;
    return null;
  };

  const transformSIMList = (items = []) => {
    return (items || []).map((x) => {
      const pem = x?.data_pemohon || {};
      const tanggalTerbit = dmyToISO(x?.tanggal_terbit) || x?.tanggal_terbit || null;
      const tanggalExpired = dmyToISO(x?.tanggal_expired) || x?.tanggal_expired || null;
      const tanggalLahir = dmyToISO(pem?.tanggal_lahir) || pem?.tanggal_lahir || null;
      return {
        ...x,
        id: x?.id || x?.sim_id,
        sim_id: x?.sim_id || x?.id,
        full_name: x?.full_name ?? pem?.full_name ?? null,
        nik: x?.nik ?? pem?.nik ?? null,
        tempat_lahir: x?.tempat_lahir ?? pem?.tempat_lahir ?? null,
        tanggal_lahir: tanggalLahir,
        jenis_kelamin: x?.jenis_kelamin ?? pem?.jenis_kelamin ?? null,
        gol_darah: x?.gol_darah ?? pem?.gol_darah ?? null,
        pekerjaan: x?.pekerjaan ?? pem?.pekerjaan ?? null,
        rt: x?.rt ?? x?.alamat_rt ?? pem?.alamat_rt ?? null,
        rw: x?.rw ?? x?.alamat_rw ?? pem?.alamat_rw ?? null,
        kecamatan: x?.kecamatan ?? pem?.kecamatan ?? null,
        kabupaten: x?.kabupaten ?? pem?.kabupaten ?? null,
        provinsi: x?.provinsi ?? pem?.provinsi ?? null,
        tanggal_terbit: tanggalTerbit,
        tanggal_expired: tanggalExpired,
      };
    });
  };

  const formatAlamat = (item) => {
    const parts = [];
    if (item.rt || item.rw) parts.push(`RT ${item.rt || '-'}/RW ${item.rw || '-'}`);
    if (item.kecamatan) parts.push(item.kecamatan);
    if (item.kabupaten) parts.push(item.kabupaten);
    if (item.provinsi) parts.push(item.provinsi);
    return parts.length ? parts.join(", ") : "-";
  };

  const getImageSrc = (val) => {
    if (!val) return null;
    if (typeof val === "string") {
      if (val.startsWith("http") || val.startsWith("blob:") || val.startsWith("data:")) return val;
      return `${(import.meta.env.VITE_API_URL || API_CONFIG.BASE_URL || "").replace(/\/$/, "")}${val.startsWith("/") ? "" : "/"}${val}`;
    }
    if (typeof val === "object" && (val.url || val.preview || val.path)) {
      const imgSrc = val.url || val.preview || val.path;
      if (imgSrc.startsWith("http") || imgSrc.startsWith("blob:") || imgSrc.startsWith("data:")) return imgSrc;
      return `${(import.meta.env.VITE_API_URL || API_CONFIG.BASE_URL || "").replace(/\/$/, "")}${imgSrc.startsWith("/") ? "" : "/"}${imgSrc}`;
    }
    return null;
  };

  const isExpired = (tanggalExpired) => {
    return new Date(tanggalExpired) < new Date();
  };

  const renderSIMView = (item) => {
    const nomorSim = formatNomorSim(item.nomor_sim);
    const jenisSimCode = getJenisSimCode(item.jenis_sim);
    const tglLahirText = formatDateID(item.tanggal_lahir);
    const ttl = [item.tempat_lahir, tglLahirText !== "-" ? tglLahirText : ""].filter(Boolean).join(", ");
    const golDarah = getGolDarahText(item.gol_darah);
    const gender = getGenderText(item.jenis_kelamin);
    const pekerjaan = item.pekerjaan || "-";
    const alamat = formatAlamat(item);
    const photo = getImageSrc(item.picture_path); // Note: server returns picture_path usually
    const vehicleInfo = getVehicleInfo(item.jenis_sim);
    const expired = isExpired(item.tanggal_expired);

    return (
      <div className="max-w-2xl mx-auto animate-scale-in">
        {/* SIM Card - Realistic Design */}
        <div className="sim-card relative">
          {/* Garuda Watermark */}
          <div className="sim-garuda left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 text-[150px]">
            🦅
          </div>
          
          {/* Header - Red Section */}
          <div className="sim-card-header relative px-5 py-4 md:px-6 md:py-5">
            {/* Stars Decoration */}
            <div className="absolute top-3 left-4 flex gap-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-300 text-xs drop-shadow">★</span>
              ))}
            </div>
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                {/* Garuda Emblem */}
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center shadow-lg border-2 border-yellow-200">
                  <span className="text-2xl md:text-3xl drop-shadow-sm">🦅</span>
                </div>
                <div>
                  <div className="text-xl md:text-2xl font-extrabold text-white tracking-widest drop-shadow-lg">
                    INDONESIA
                  </div>
                  <div className="text-[10px] md:text-xs text-red-100 tracking-[0.15em] uppercase">
                    Surat Izin Mengemudi
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-[9px] md:text-[10px] text-red-200 uppercase tracking-wider mb-1">
                  Driving Licence
                </div>
                <div className="text-3xl md:text-4xl font-black text-white tracking-wide drop-shadow-lg">
                  {jenisSimCode}
                </div>
              </div>
            </div>
            
            {/* Hologram Strip */}
            <div className="sim-hologram-strip absolute bottom-0 left-0 right-0 h-1.5 md:h-2"></div>
          </div>

          {/* Body - Light Section */}
          <div className="sim-card-body relative px-5 py-4 md:px-6 md:py-5">
            {/* SIM Number Row */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">No. SIM</span>
              </div>
              <div className="font-mono font-bold text-gray-900 text-lg md:text-xl tracking-wider">
                {nomorSim}
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-3 gap-4 md:gap-6">
              {/* Photo Column */}
              <div className="col-span-1">
                <div className="sim-photo-frame w-24 h-32 md:w-28 md:h-36 rounded-lg overflow-hidden flex items-center justify-center relative">
                  {photo ? (
                    <img src={photo} alt="Foto SIM" className="h-full w-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <div className="text-5xl text-gray-300 mb-1">👤</div>
                      <div className="text-[9px] text-gray-400">Foto</div>
                    </div>
                  )}
                  {/* Photo shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none"></div>
                </div>
                
                {/* Vehicle Badge */}
                <div className="mt-3 flex items-center gap-1 text-xs">
                  <span className="text-lg">{vehicleInfo.icon}</span>
                  <span className="text-gray-600 font-medium">{vehicleInfo.vehicle}</span>
                </div>
              </div>

              {/* Details Column */}
              <div className="col-span-2 space-y-2">
                <div className="grid gap-y-1.5 text-[12px] md:text-[13px]">
                  {/* Row 1 - Name */}
                  <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                    <span className="font-bold text-gray-500 text-right">1.</span>
                    <span className="font-bold text-gray-900 uppercase truncate">{item.full_name || "-"}</span>
                  </div>
                  
                  {/* Row 2 - Tempat Lahir + Tanggal Lahir */}
                  <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                    <span className="font-bold text-gray-500 text-right">2.</span>
                    <span className="font-medium text-gray-800">
                      {item.tempat_lahir || "-"}, {tglLahirText}
                    </span>
                  </div>
                  
                  {/* Row 3 - Blood Type - Gender */}
                  <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                    <span className="font-bold text-gray-500 text-right">3.</span>
                    <span className="font-semibold text-gray-800">{golDarah} - {gender}</span>
                  </div>
                  
                  {/* Row 4 - Alamat Lengkap */}
                  <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                    <span className="font-bold text-gray-500 text-right">4.</span>
                    <div className="font-medium text-gray-800 text-[11px] leading-4">
                      <div>RT {item.rt || "-"}/{item.rw || "-"} {item.kecamatan || "-"}</div>
                      <div>{item.kabupaten || "-"}</div>
                    </div>
                  </div>
                  
                  {/* Row 5 - Pekerjaan */}
                  <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                    <span className="font-bold text-gray-500 text-right">5.</span>
                    <span className="font-medium text-gray-800 uppercase truncate">{pekerjaan}</span>
                  </div>
                  
                  {/* Row 6 - Domisili (Provinsi) */}
                  <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                    <span className="font-bold text-gray-500 text-right">6.</span>
                    <span className="font-medium text-gray-800 uppercase truncate">{item.provinsi || "-"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-gray-200 flex items-end justify-between">
              {/* Left - SIM Type Badge */}
              <div className="flex items-center gap-3">
                <span className={`inline-flex px-3 py-1.5 text-xs font-bold rounded-lg border shadow-sm ${getSimBadgeClasses(item.jenis_sim)}`}>
                  SIM {jenisSimCode}
                </span>
                {vehicleInfo.ccInfo && (
                  <span className="text-xs text-gray-500 font-medium">
                    {vehicleInfo.ccInfo}
                  </span>
                )}
              </div>
              
              {/* Right - Expiry Date */}
              <div className="text-right">
                <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-0.5">Berlaku s/d</div>
                <div className={`font-bold text-sm ${expired ? 'text-red-600' : 'text-gray-900'}`}>
                  {formatDateID(item.tanggal_expired)}
                </div>
                {expired && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 mt-1 text-[10px] font-semibold bg-red-100 text-red-700 rounded-full animate-pulse">
                    <span>⚠️</span> EXPIRED
                  </span>
                )}
              </div>
            </div>
            
            {/* Barcode Simulation */}
            <div className="mt-4 flex items-center justify-center gap-[1px] opacity-60">
              {[...Array(40)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-800"
                  style={{
                    width: Math.random() > 0.6 ? '2px' : '1px',
                    height: '16px'
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Status Card */}
        <div className={`mt-4 p-4 rounded-xl border ${expired 
          ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200' 
          : 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              expired ? 'bg-red-100' : 'bg-emerald-100'
            }`}>
              <span className="text-xl">{expired ? '⏰' : '✅'}</span>
            </div>
            <div>
              <div className={`font-semibold ${expired ? 'text-red-700' : 'text-emerald-700'}`}>
                {expired ? 'SIM Sudah Kedaluwarsa' : 'SIM Masih Berlaku'}
              </div>
              <div className="text-sm text-gray-600">
                {expired 
                  ? 'Silakan perpanjang SIM Anda segera' 
                  : `Berlaku hingga ${formatDateID(item.tanggal_expired)}`
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const loadPendaftaran = async () => {
      try {
        // API SIM Create memerlukan pendaftaran dengan status 'disetujui' (approved)
        const res = await pendaftaranService.getList({ status: 'disetujui' });
        const items = res?.data || [];
        const options = items.map((it) => ({
          value: it.id || it.pendaftaran_id,
          label: `${it.code || it.kode_pendaftaran} - ${it.jenis_sim?.toUpperCase()} (${it.user_name || it.nik || 'User'})`,
          original: it,
        }));
        setPendaftaranOptions(options);
        console.log(`Loaded ${options.length} approved pendaftaran for SIM creation`);
      } catch (e) {
        console.error('Failed to load pendaftaran:', e);
        setErrorMessage("Gagal memuat daftar pendaftaran yang disetujui");
      }
    };
    loadPendaftaran();
  }, []);

  const columns = [
    {
      key: "nomor_sim",
      title: "Nomor SIM",
      render: (value) => (
        <div className="font-mono text-sm bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
          {value}
        </div>
      ),
    },
    {
      key: "full_name",
      title: "Nama Lengkap",
      render: (value) => <div className="text-gray-800 font-medium">{value}</div>,
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
          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border shadow-sm ${getSimBadgeClasses(value)}`}>
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
          <div className={`font-medium ${isExpired(value) ? "text-red-600" : "text-gray-700"}`}>
            {value
              ? (isNaN(new Date(value).getTime())
                ? "-"
                : new Date(value).toLocaleDateString("id-ID"))
              : "-"}
          </div>
          {isExpired(value) && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-gradient-to-r from-red-100 to-orange-100 text-red-700 mt-1">
              ⚠️ Expired
            </span>
          )}
        </div>
      ),
    },
  ];

  const formFields = ({ formData, mode }) => {
    const isCreate = mode === "create";
    
    // Untuk validasi tanggal
    const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
    const tanggalTerbit = formData?.tanggal_terbit;
    
    // Tanggal expired minimal 1 hari setelah tanggal terbit
    let minTanggalExpired = today;
    let tanggalTerbitLabel = null;
    if (tanggalTerbit) {
      const terbitDate = new Date(tanggalTerbit);
      if (!isNaN(terbitDate.getTime())) {
        tanggalTerbitLabel = terbitDate.toLocaleDateString('id-ID');
        terbitDate.setDate(terbitDate.getDate() + 1); // Minimal 1 hari setelah terbit
        minTanggalExpired = terbitDate.toISOString().split('T')[0];
      }
    }

    return [
      {
        name: "pendaftaran_id",
        label: "Pendaftaran (Disetujui)",
        type: "select",
        required: isCreate,
        options: pendaftaranOptions,
        disabled: !isCreate,
        icon: "📝",
        className: !isCreate ? "hidden" : "",
      },
      {
        name: "jenis_sim",
        label: "Jenis SIM",
        type: "text",
        disabled: true,
        icon: "📋",
      },
      {
        name: "tanggal_terbit",
        label: "Tanggal Terbit",
        type: "date",
        required: isCreate,
        icon: "📅",
        min: today, 
        helpText: "Tanggal terbit tidak boleh di masa lalu",
      },
      {
        name: "tanggal_expired",
        label: "Tanggal Expired",
        type: "date",
        required: true,
        icon: "⏰",
        min: minTanggalExpired, 
        helpText: tanggalTerbitLabel 
          ? `Minimal 1 hari setelah tanggal terbit (${tanggalTerbitLabel})` 
          : "Pilih tanggal terbit terlebih dahulu",
      },
      {
        name: "picture",
        label: "Foto SIM",
        type: "file",
        required: isCreate,
        accept: "image/*",
        icon: "📷",
      },
    ];
  };

  const initialFormData = {};

  const validationRules = {
    pendaftaran_id: {
      required: (_, isCreate) => isCreate,
      label: "Pendaftaran",
    },
    tanggal_terbit: {
      required: (_, isCreate) => isCreate,
      label: "Tanggal Terbit",
      custom: (value) => {
        if (!value) return null; // Will be caught by required
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const terbitDate = new Date(value);
        terbitDate.setHours(0, 0, 0, 0);
        
        if (terbitDate < today) {
          return "Tanggal terbit tidak boleh di masa lalu";
        }
        return null;
      }
    },
    tanggal_expired: {
      required: true,
      label: "Tanggal Expired",
      custom: (value, formData) => {
        if (!value) return null; // Will be caught by required
        
        const expiredDate = new Date(value);
        const terbitDate = formData?.tanggal_terbit ? new Date(formData.tanggal_terbit) : null;
        
        if (terbitDate && !isNaN(terbitDate.getTime())) {
          // Tanggal expired harus lebih dari tanggal terbit
          if (expiredDate <= terbitDate) {
            return "Tanggal expired harus lebih dari tanggal terbit";
          }
          
          // Minimal 1 hari setelah tanggal terbit
          const minExpired = new Date(terbitDate);
          minExpired.setDate(minExpired.getDate() + 1);
          
          if (expiredDate < minExpired) {
            return "Tanggal expired minimal 1 hari setelah tanggal terbit";
          }
        }
        
        return null;
      }
    },
    picture: {
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

  const handleError = (error) => {
    setErrorMessage(error);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSIMFormChange = async ({ field, value, setFormData }) => {
    if (field === "pendaftaran_id" && value) {
      setFormData(prev => ({ ...prev, pendaftaran_id: value, _pendaftaran: null }));

      try {
        const res = await pendaftaranService.getById(value);
        const item = res?.data || res;

        if (item) {
          setFormData((prev) => ({
            ...prev,
            _pendaftaran: item,
            jenis_sim: item.jenis_sim || prev.jenis_sim,
          }));
        }
      } catch (e) {
        console.error("Gagal memuat detail pendaftaran", e);
        setErrorMessage("Gagal mengambil detail pendaftaran dari server");
      }
    }
  };

  // Preview Pendaftaran & KTP Component
  const PendaftaranDetailInline = ({ formData }) => {
    const pendaftaran = formData?._pendaftaran;
    const ktp = formData?._ktp;
    
    // Jika belum pilih dan ini mode create
    if (!formData?.pendaftaran_id && !formData?.nomor_sim) {
      return (
         <div className="p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 text-center mb-6">
           <span className="text-4xl block mb-2">📝</span>
           <p className="text-gray-500 font-medium">Silakan pilih Pendaftaran SIM terlebih dahulu</p>
           <p className="text-xs text-gray-400 mt-1">Hanya pendaftaran dengan status "selesai" yang dapat diproses</p>
         </div>
      );
    }
    
    // Jika data pendaftaran belum ada (misal mode edit sedang loading atau baru set ID)
    if (!pendaftaran && formData?.pendaftaran_id) {
       return <div className="text-sm text-gray-500 italic mb-4">Memuat detail pendaftaran...</div>;
    }

    if (!pendaftaran && !ktp) return null;

    return (
      <div className="space-y-4 mb-6 animate-fade-in">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-4">
          <h4 className="flex items-center gap-2 font-bold text-blue-900 mb-3 pb-2 border-b border-blue-200/50">
            <span>📄</span> Detail Pendaftaran
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
             <div>
               <span className="text-xs text-blue-600 block mb-0.5">Kode Pendaftaran</span>
               <span className="font-mono font-bold text-gray-800">{pendaftaran?.code || pendaftaran?.kode_pendaftaran || '-'}</span>
             </div>
             <div>
               <span className="text-xs text-blue-600 block mb-0.5">Jenis SIM</span>
               <span className="font-bold text-gray-800 bg-white px-2 py-0.5 rounded border border-blue-100 inline-block shadow-sm">
                 {pendaftaran?.jenis_sim ? `SIM ${getJenisSimCode(pendaftaran.jenis_sim)}` : '-'}
               </span>
             </div>
             <div>
               <span className="text-xs text-blue-600 block mb-0.5">Tanggal Ujian</span>
               <span className="font-medium text-gray-800">
                 {pendaftaran?.tanggal_ujian ? formatDateID(pendaftaran.tanggal_ujian) : '-'}
               </span>
             </div>
             <div>
               <span className="text-xs text-blue-600 block mb-0.5">Status</span>
               <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                 <span>✅</span> {pendaftaran?.status ? pendaftaran.status.toUpperCase() : 'SELESAI'}
               </span>
             </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Error Notification */}
      {errorMessage && (
        <div className="sticky top-4 z-50 mx-auto max-w-4xl animate-fade-in-down">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-4 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl">⚠️</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-red-800">Terjadi Kesalahan</h3>
                <p className="text-sm text-red-600 mt-1">{errorMessage}</p>
              </div>
              <button 
                className="text-red-400 hover:text-red-600 transition-colors p-1" 
                onClick={() => setErrorMessage(null)}
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      <CRUDManager
        title="Data SIM"
        description="Surat Izin Mengemudi"
        service={simService}
        columns={columns}
        formFields={formFields}
        initialFormData={initialFormData}
        validationRules={validationRules}
        onDataTransform={transformSIMList}
        searchPlaceholder="Cari nomor SIM, nama, atau NIK..."
        filterOptions={filterOptions}
        icon="🚗"
        onError={handleError}
        onFormChange={handleSIMFormChange}
        onBeforeSubmit={beforeSubmitSIM}
        renderView={renderSIMView}
        renderCreateExtra={({ formData }) => (
          <PendaftaranDetailInline formData={formData} />
        )}
        renderEditExtra={({ formData }) => (
          <PendaftaranDetailInline formData={formData} />
        )}
      />
    </div>
  );
};

export default SIM;
