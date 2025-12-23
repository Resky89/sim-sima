import { useState } from "react";
import CRUDManager from "../components/common/CRUDManager";
import { pendaftaranService } from "../services/pendaftaranService";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";

const STATUS_OPTIONS = [
  { value: "diajukan", label: "Diajukan" },
  { value: "diperiksa", label: "Diperiksa" },
  { value: "disetujui", label: "Disetujui" },
  { value: "proses_ujian", label: "Proses Ujian" },
  { value: "ujian_gagal", label: "Ujian Gagal" },
  { value: "selesai", label: "Selesai" },
  { value: "ditolak", label: "Ditolak" },
];

// Valid transitions based on backend validation
const VALID_TRANSITIONS = {
  diajukan: ['diperiksa', 'ditolak'],
  diperiksa: ['disetujui', 'ditolak'],
  disetujui: ['proses_ujian'],
  proses_ujian: ['ujian_gagal', 'selesai'],
  ujian_gagal: ['proses_ujian'],
  selesai: [],
  ditolak: [],
};

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

const getNextStatusButton = (status) => {
  const buttonConfigs = {
    diperiksa: { label: "Tandai Diperiksa", color: "from-amber-500 to-yellow-500", icon: "🔍" },
    disetujui: { label: "Setujui", color: "from-emerald-500 to-teal-500", icon: "✅" },
    proses_ujian: { label: "Mulai Ujian", color: "from-blue-500 to-indigo-500", icon: "📝" },
    ujian_gagal: { label: "Gagal Ujian", color: "from-red-500 to-rose-500", icon: "❌" },
    selesai: { label: "Selesai", color: "from-green-500 to-emerald-500", icon: "🎉" },
    ditolak: { label: "Tolak", color: "from-rose-500 to-pink-500", icon: "🚫" },
  };
  return buttonConfigs[status] || { label: status, color: "from-gray-500 to-gray-600", icon: "📋" };
};

const Pendaftaran = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [statusModal, setStatusModal] = useState({ open: false, item: null });
  const [updating, setUpdating] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

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
    {
      key: "actions_status",
      title: "Update Status",
      render: (_, row) => {
        const currentStatus = (row.status || "diajukan").toLowerCase();
        const validNextStatuses = VALID_TRANSITIONS[currentStatus] || [];
        
        // Hide if final state
        if (validNextStatuses.length === 0) {
          return (
            <span className="text-xs text-gray-400 italic">Status Final</span>
          );
        }

        return (
          <div className="flex flex-wrap gap-1">
            {validNextStatuses.map((nextStatus) => {
              const btnConfig = getNextStatusButton(nextStatus);
              return (
                <button
                  key={nextStatus}
                  onClick={(e) => {
                    e.stopPropagation();
                    setStatusModal({ open: true, item: row, nextStatus });
                  }}
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-white rounded-lg bg-gradient-to-r ${btnConfig.color} shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200`}
                >
                  <span>{btnConfig.icon}</span>
                  {btnConfig.label}
                </button>
              );
            })}
          </div>
        );
      },
    },
  ];

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

  const handleUpdateStatus = async () => {
    if (!statusModal.item || !statusModal.nextStatus) return;

    setUpdating(true);
    try {
      await pendaftaranService.updateStatus(statusModal.item.pendaftaran_id, statusModal.nextStatus);
      setSuccessMessage(`Status berhasil diubah menjadi "${STATUS_OPTIONS.find(o => o.value === statusModal.nextStatus)?.label || statusModal.nextStatus}"`);
      setStatusModal({ open: false, item: null, nextStatus: null });
      setRefreshKey(prev => prev + 1);
      
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      setErrorMessage(error.message || "Gagal mengubah status");
      setStatusModal({ open: false, item: null, nextStatus: null });
    } finally {
      setUpdating(false);
    }
  };

  const handleError = (error) => {
    setErrorMessage(error);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderView = (item) => {
    const status = (item.status || "diajukan").toLowerCase();
    const config = getStatusConfig(status);
    const statusLabel = STATUS_OPTIONS.find((o) => o.value === status)?.label || item.status;
    const validNextStatuses = VALID_TRANSITIONS[status] || [];

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

            {/* Action Buttons */}
            {validNextStatuses.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-sm font-semibold text-gray-700 mb-3">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {validNextStatuses.map((nextStatus) => {
                    const btnConfig = getNextStatusButton(nextStatus);
                    return (
                      <button
                        key={nextStatus}
                        onClick={() => setStatusModal({ open: true, item, nextStatus })}
                        className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-xl bg-gradient-to-r ${btnConfig.color} shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200`}
                      >
                        <span>{btnConfig.icon}</span>
                        {btnConfig.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Success Notification */}
      {successMessage && (
        <div className="sticky top-4 z-50 mx-auto max-w-4xl animate-fade-in">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl">✅</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-green-800">Berhasil</h3>
                <p className="text-sm text-green-600 mt-1">{successMessage}</p>
              </div>
              <button 
                className="text-green-400 hover:text-green-600 transition-colors p-1" 
                onClick={() => setSuccessMessage(null)}
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

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
        key={refreshKey}
        title="Pendaftaran SIM"
        description="Kelola pendaftaran SIM pengguna"
        service={pendaftaranService}
        columns={columns}
        formFields={[]}
        initialFormData={{}}
        validationRules={{}}
        searchPlaceholder="Cari kode pendaftaran..."
        filterOptions={filterOptions}
        icon="📝"
        onError={handleError}
        onDataTransform={onDataTransform}
        enableCreate={false}
        showViewAction={true}
        showEditAction={false}
        showDeleteAction={false}
        renderView={renderView}
      />

      {/* Status Update Confirmation Modal */}
      <Modal
        isOpen={statusModal.open}
        onClose={() => setStatusModal({ open: false, item: null, nextStatus: null })}
        title="Konfirmasi Update Status"
        size="md"
      >
        <div className="p-6">
          {statusModal.item && statusModal.nextStatus && (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-3xl">
                    {getNextStatusButton(statusModal.nextStatus).icon}
                  </span>
                </div>
                <p className="text-gray-600">
                  Apakah Anda yakin ingin mengubah status pendaftaran
                </p>
                <p className="font-mono font-bold text-gray-900 mt-2">
                  {statusModal.item.kode_pendaftaran}
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 mb-6">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-lg border ${getStatusConfig(statusModal.item.status).color}`}>
                  <span>{getStatusConfig(statusModal.item.status).icon}</span>
                  {STATUS_OPTIONS.find(o => o.value === statusModal.item.status)?.label || statusModal.item.status}
                </div>
                <span className="text-gray-400">→</span>
                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-lg border ${getStatusConfig(statusModal.nextStatus).color}`}>
                  <span>{getStatusConfig(statusModal.nextStatus).icon}</span>
                  {STATUS_OPTIONS.find(o => o.value === statusModal.nextStatus)?.label || statusModal.nextStatus}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setStatusModal({ open: false, item: null, nextStatus: null })}
                  disabled={updating}
                >
                  Batal
                </Button>
                <Button
                  variant="primary"
                  className={`flex-1 bg-gradient-to-r ${getNextStatusButton(statusModal.nextStatus).color}`}
                  onClick={handleUpdateStatus}
                  loading={updating}
                >
                  {updating ? "Memproses..." : "Konfirmasi"}
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Pendaftaran;
