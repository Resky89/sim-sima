import { useState } from "react";
import CRUDManager from "../components/common/CRUDManager";
import { pendaftaranService } from "../services/pendaftaranService";

const STATUS_OPTIONS = [
  { value: "diajukan", label: "Diajukan" },
  { value: "diperiksa", label: "Diperiksa" },
  { value: "disetujui", label: "Disetujui" },
  { value: "proses_ujian", label: "Proses Ujian" },
  { value: "ujian_gagal", label: "Ujian Gagal" },
  { value: "selesai", label: "Selesai" },
  { value: "ditolak", label: "Ditolak" },
];

const getStatusConfig = (status) => {
  const configs = {
    diajukan: { 
      color: "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border-gray-300", 
      icon: "📋",
      step: 1 
    },
    diperiksa: { 
      color: "bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-300", 
      icon: "🔍",
      step: 2 
    },
    disetujui: { 
      color: "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border-emerald-300", 
      icon: "✅",
      step: 3 
    },
    proses_ujian: { 
      color: "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-300", 
      icon: "📝",
      step: 4 
    },
    ujian_gagal: { 
      color: "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-300", 
      icon: "❌",
      step: 0 
    },
    selesai: { 
      color: "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-300", 
      icon: "🎉",
      step: 5 
    },
    ditolak: { 
      color: "bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700 border-rose-300", 
      icon: "🚫",
      step: 0 
    },
  };
  return configs[status] || configs.diajukan;
};

const Pendaftaran = () => {
  const [errorMessage, setErrorMessage] = useState(null);

  const columns = [
    {
      key: "kode_pendaftaran",
      title: "Kode Pendaftaran",
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white text-xs">📝</span>
          </div>
          <span className="font-mono text-sm font-semibold text-gray-900">
            {value || row.id || row.pendaftaran_id || "-"}
          </span>
        </div>
      ),
    },
    {
      key: "jenis_sim",
      title: "Jenis SIM",
      render: (value) => (
        <span className="inline-flex px-3 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 shadow-sm">
          SIM {(value || "-").toString().toUpperCase()}
        </span>
      ),
    },
    {
      key: "tanggal_ujian",
      title: "Tanggal Ujian",
      render: (value) => (
        <div className="flex items-center gap-2 text-gray-700">
          <span className="text-sm">📅</span>
          <span className="text-sm font-medium">
            {value ? new Date(value).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "short",
              year: "numeric"
            }) : "-"}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      title: "Status",
      render: (value) => {
        const v = (value || "diajukan").toString().toLowerCase();
        const config = getStatusConfig(v);
        const label = STATUS_OPTIONS.find((o) => o.value === v)?.label || value || "-";
        return (
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border ${config.color}`}>
            <span>{config.icon}</span>
            {label}
          </span>
        );
      },
    },
  ];

  const formFields = [
    {
      name: "status",
      label: "Ubah Status",
      type: "select",
      required: true,
      options: STATUS_OPTIONS,
      icon: "🔄",
    },
  ];

  const validationRules = {
    status: {
      required: () => true,
      label: "Status",
      custom: (value) => (!STATUS_OPTIONS.some((o) => o.value === value) ? "Status tidak valid" : null),
    },
  };

  const filterOptions = [
    {
      key: "status",
      label: "Status",
      placeholder: "Filter Status",
      options: [{ value: "", label: "Semua Status" }, ...STATUS_OPTIONS],
    },
  ];

  const onDataTransform = (items) => {
    if (!Array.isArray(items)) return [];
    return items.map((it) => {
      const normalizedId = it.id ?? it.pendaftaran_id ?? it.kode_pendaftaran ?? it.uuid;
      return {
        ...it,
        id: normalizedId,
        pendaftaran_id: it.pendaftaran_id ?? normalizedId,
        kode_pendaftaran: it.kode_pendaftaran ?? it.code ?? it.pendaftaran_id ?? normalizedId ?? "",
        jenis_sim: it.jenis_sim ?? it.jenis ?? "",
        tanggal_ujian: it.tanggal_ujian ?? it.tanggal ?? it.schedule_date ?? "",
        status: it.status ?? "",
      };
    });
  };

  const beforeSubmit = (data) => ({ status: data.status });

  const handleError = (error) => {
    setErrorMessage(error);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderView = (item) => {
    const status = (item.status || "diajukan").toLowerCase();
    const config = getStatusConfig(status);
    const statusLabel = STATUS_OPTIONS.find((o) => o.value === status)?.label || item.status;

    return (
      <div className="max-w-lg mx-auto animate-fade-in">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 p-6 text-center relative">
            <div className="absolute inset-0 bg-black/5"></div>
            <div className="relative">
              <div className="w-16 h-16 mx-auto bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 shadow-lg mb-3">
                <span className="text-3xl">📝</span>
              </div>
              <h3 className="text-lg font-bold text-white">Pendaftaran SIM</h3>
              <p className="text-blue-100 text-sm mt-1 font-mono">
                {item.kode_pendaftaran || item.id}
              </p>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className="px-6 -mt-4 relative z-10">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 shadow-lg bg-white ${config.color}`}>
              <span className="text-lg">{config.icon}</span>
              <span className="font-bold">{statusLabel}</span>
            </div>
          </div>
          
          {/* Details */}
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-xl">
                <p className="text-xs text-blue-600 font-medium mb-1">Jenis SIM</p>
                <p className="text-xl font-bold text-gray-900">
                  {(item.jenis_sim || "-").toUpperCase()}
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl">
                <p className="text-xs text-purple-600 font-medium mb-1">Tanggal Ujian</p>
                <p className="text-gray-900 font-semibold">
                  {item.tanggal_ujian 
                    ? new Date(item.tanggal_ujian).toLocaleDateString("id-ID")
                    : "-"
                  }
                </p>
              </div>
            </div>
            
            {/* Progress Steps */}
            <div className="mt-6">
              <p className="text-sm font-semibold text-gray-700 mb-3">Progress Pendaftaran</p>
              <div className="flex items-center justify-between">
                {["Ajukan", "Periksa", "Setuju", "Ujian", "Selesai"].map((step, i) => {
                  const stepNum = i + 1;
                  const isActive = config.step >= stepNum;
                  const isCurrent = config.step === stepNum;
                  return (
                    <div key={step} className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isActive 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                          : 'bg-gray-100 text-gray-400'
                      } ${isCurrent ? 'ring-4 ring-blue-200 scale-110' : ''}`}>
                        {stepNum}
                      </div>
                      <span className={`text-[10px] mt-1 ${isActive ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
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
        <div className="sticky top-4 z-50 mx-auto max-w-4xl animate-fade-in">
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
        title="Pendaftaran SIM"
        description="Kelola pendaftaran SIM pengguna"
        service={pendaftaranService}
        columns={columns}
        formFields={formFields}
        initialFormData={{}}
        validationRules={validationRules}
        searchPlaceholder="Cari kode pendaftaran..."
        filterOptions={filterOptions}
        icon="📝"
        onError={handleError}
        onDataTransform={onDataTransform}
        onBeforeSubmit={beforeSubmit}
        enableCreate={false}
        showViewAction={true}
        showDeleteAction={false}
        renderView={renderView}
      />
    </div>
  );
};

export default Pendaftaran;
