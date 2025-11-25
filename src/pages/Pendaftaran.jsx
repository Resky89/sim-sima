import { useState } from "react";
import CRUDManager from "../components/common/CRUDManager";
import { pendaftaranService } from "../services/pendaftaranService";
import "../styles/error.css";

const STATUS_OPTIONS = [
  { value: "diajukan", label: "Diajukan" },
  { value: "diperiksa", label: "Diperiksa" },
  { value: "disetujui", label: "Disetujui" },
  { value: "proses_ujian", label: "Proses Ujian" },
  { value: "ujian_gagal", label: "Ujian Gagal" },
  { value: "selesai", label: "Selesai" },
  { value: "ditolak", label: "Ditolak" },
];

const Pendaftaran = () => {
  const [errorMessage, setErrorMessage] = useState(null);

  const columns = [
    {
      key: "kode_pendaftaran",
      title: "Kode",
      render: (value, row) => (
        <div className="font-mono text-sm text-gray-900">{value || row.id || row.pendaftaran_id || "-"}</div>
      ),
    },
    {
      key: "jenis_sim",
      title: "Jenis SIM",
      render: (value) => (
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
          {(value || "-").toString().toUpperCase()}
        </span>
      ),
    },
    {
      key: "tanggal_ujian",
      title: "Tanggal Ujian",
      render: (value) => (
        <div className="text-sm text-gray-700">{value ? new Date(value).toLocaleDateString("id-ID") : "-"}</div>
      ),
    },
    {
      key: "status",
      title: "Status",
      render: (value) => {
        const v = (value || "-").toString().toLowerCase();
        const color = {
          diajukan: "bg-gray-100 text-gray-800",
          diperiksa: "bg-amber-100 text-amber-800",
          disetujui: "bg-emerald-100 text-emerald-800",
          proses_ujian: "bg-blue-100 text-blue-800",
          ujian_gagal: "bg-red-100 text-red-800",
          selesai: "bg-green-100 text-green-800",
          ditolak: "bg-rose-100 text-rose-800",
        }[v] || "bg-slate-100 text-slate-800";
        const label = STATUS_OPTIONS.find((o) => o.value === v)?.label || value || "-";
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${color}`}>{label}</span>
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

  return (
    <div className="space-y-4">
      {errorMessage && (
        <div className="error-container sticky top-4 z-50 mx-auto max-w-4xl shadow-lg">
          <div className="flex items-center">
            <span className="error-icon text-xl">⚠️</span>
            <h3 className="error-title">Terjadi Kesalahan</h3>
            <button className="ml-auto text-red-700 hover:text-red-900" onClick={() => setErrorMessage(null)}>
              ✕
            </button>
          </div>
          <p className="error-message">{errorMessage}</p>
        </div>
      )}

      <CRUDManager
        title="Pendaftaran SIM"
        description="Kelola pendaftaran SIM pengguna dan perbarui statusnya"
        service={pendaftaranService}
        columns={columns}
        formFields={formFields}
        initialFormData={{}}
        validationRules={validationRules}
        searchPlaceholder="Cari kode pendaftaran atau status..."
        filterOptions={filterOptions}
        icon="📝"
        onError={handleError}
        onDataTransform={onDataTransform}
        onBeforeSubmit={beforeSubmit}
        enableCreate={false}
        showViewAction={false}
        showDeleteAction={false}
      />
    </div>
  );
};

export default Pendaftaran;
