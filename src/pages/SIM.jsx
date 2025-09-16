import CRUDManager from "../components/common/CRUDManager";
import { simService } from "../services/simService";
import { SIM_ENUMS } from "../constants/enums.jsx";

const SIM = () => {
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
      key: "jenis_sim",
      title: "Jenis SIM",
      render: (value) => (
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
          {SIM_ENUMS.JENIS_SIM[value] || value}
        </span>
      ),
    },
    {
      key: "tanggal_terbit",
      title: "Tanggal Terbit",
      render: (value) => (
        <div className="text-gray-600 text-sm">
          {value ? new Date(value).toLocaleDateString("id-ID") : "-"}
        </div>
      ),
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
      required: true,
      placeholder: "16 digit angka",
      icon: "🚗",
    },
    {
      name: "jenis_sim",
      label: "Jenis SIM",
      type: "select",
      required: true,
      options: Object.entries(SIM_ENUMS.JENIS_SIM).map(([key, value]) => ({
        value: key,
        label: value,
      })),
      icon: "📋",
    },
    {
      name: "tanggal_terbit",
      label: "Tanggal Terbit",
      type: "date",
      required: true,
      icon: "📅",
    },
    {
      name: "tanggal_expired",
      label: "Tanggal Expired",
      type: "date",
      required: true,
      icon: "⏰",
    },
    {
      name: "ktp_id",
      label: "Data KTP Terkait",
      type: "select",
      required: true,
      options: [], // Will be populated dynamically
      placeholder: "Pilih data KTP",
      icon: "🆔",
    },
  ];

  const initialFormData = {
    nomor_sim: "",
    jenis_sim: "",
    tanggal_terbit: "",
    tanggal_expired: "",
    ktp_id: "",
  };

  const validationRules = {
    nomor_sim: {
      required: true,
      label: "Nomor SIM",
      pattern: /^[0-9]{16}$/,
      patternMessage: "Nomor SIM harus 16 digit angka",
    },
    jenis_sim: {
      required: true,
      label: "Jenis SIM",
    },
    tanggal_terbit: {
      required: true,
      label: "Tanggal Terbit",
    },
    tanggal_expired: {
      required: true,
      label: "Tanggal Expired",
      custom: (value, data) => {
        if (
          value &&
          data.tanggal_terbit &&
          new Date(value) <= new Date(data.tanggal_terbit)
        ) {
          return "Tanggal expired harus setelah tanggal terbit";
        }
        return null;
      },
    },
    ktp_id: {
      required: true,
      label: "Data KTP",
    },
  };

  const filterOptions = [
    {
      key: "jenis_sim",
      label: "Jenis SIM",
      placeholder: "Filter Jenis SIM",
      options: Object.entries(SIM_ENUMS.JENIS_SIM).map(([key, value]) => ({
        value: key,
        label: value,
      })),
    },
  ];

  return (
    <CRUDManager
      title="Data SIM"
      description="Kelola data Surat Izin Mengemudi"
      service={simService}
      columns={columns}
      formFields={formFields}
      initialFormData={initialFormData}
      validationRules={validationRules}
      searchPlaceholder="Cari nomor SIM atau jenis SIM..."
      filterOptions={filterOptions}
      icon="🚗"
    />
  );
};

export default SIM;
