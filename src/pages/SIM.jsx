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
      name: "full_name",
      label: "Nama Lengkap",
      type: "text",
      required: true,
      placeholder: "Nama lengkap sesuai KTP",
      icon: "👤",
    },
    {
      name: "nik",
      label: "NIK",
      type: "text",
      required: true,
      placeholder: "16 digit angka NIK",
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
      required: true,
      placeholder: "Kota kelahiran",
      icon: "🏙️",
    },
    {
      name: "tanggal_lahir",
      label: "Tanggal Lahir",
      type: "date",
      required: true,
      icon: "📅",
    },
    {
      name: "pekerjaan",
      label: "Pekerjaan",
      type: "text",
      required: true,
      placeholder: "Profesi/pekerjaan",
      icon: "💼",
    },
    {
      name: "rt",
      label: "RT",
      type: "text",
      required: true,
      placeholder: "Nomor RT",
      icon: "🏘️",
    },
    {
      name: "rw",
      label: "RW",
      type: "text",
      required: true,
      placeholder: "Nomor RW",
      icon: "🏘️",
    },
    {
      name: "kecamatan",
      label: "Kecamatan",
      type: "text",
      required: true,
      placeholder: "Nama kecamatan",
      icon: "🏙️",
    },
    {
      name: "kabupaten",
      label: "Kabupaten/Kota",
      type: "text",
      required: true,
      placeholder: "Nama kabupaten/kota",
      icon: "🏙️",
    },
    {
      name: "provinsi",
      label: "Provinsi",
      type: "text",
      required: true,
      placeholder: "Nama provinsi",
      icon: "🏙️",
    },
    {
      name: "picture_path",
      label: "Foto SIM",
      type: "text",
      required: true,
      placeholder: "Path foto SIM",
      icon: "📷",
    },
  ];

  const initialFormData = {
    nomor_sim: "",
    full_name: "",
    nik: "",
    jenis_sim: "",
    tanggal_terbit: "",
    tanggal_expired: "",
    jenis_kelamin: "",
    gol_darah: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    pekerjaan: "",
    rt: "",
    rw: "",
    kecamatan: "",
    kabupaten: "",
    provinsi: "",
    picture_path: "",
  };

  const validationRules = {
    nomor_sim: {
      required: true,
      label: "Nomor SIM",
      pattern: /^[0-9]{16}$/,
      patternMessage: "Nomor SIM harus 16 digit angka",
    },
    full_name: {
      required: true,
      label: "Nama Lengkap",
      maxLength: 255,
    },
    nik: {
      required: true,
      label: "NIK",
      pattern: /^[0-9]{16}$/,
      patternMessage: "NIK harus 16 digit angka",
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
    jenis_kelamin: {
      required: true,
      label: "Jenis Kelamin",
    },
    gol_darah: {
      required: true,
      label: "Golongan Darah",
    },
    tempat_lahir: {
      required: true,
      label: "Tempat Lahir",
      maxLength: 100,
    },
    tanggal_lahir: {
      required: true,
      label: "Tanggal Lahir",
    },
    pekerjaan: {
      required: true,
      label: "Pekerjaan",
      maxLength: 100,
    },
    rt: {
      required: true,
      label: "RT",
      maxLength: 10,
    },
    rw: {
      required: true,
      label: "RW",
      maxLength: 10,
    },
    kecamatan: {
      required: true,
      label: "Kecamatan",
      maxLength: 100,
    },
    kabupaten: {
      required: true,
      label: "Kabupaten/Kota",
      maxLength: 100,
    },
    provinsi: {
      required: true,
      label: "Provinsi",
      maxLength: 100,
    },
    picture_path: {
      required: true,
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

  return (
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
    />
  );
};

export default SIM;
