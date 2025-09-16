import CRUDManager from "../components/common/CRUDManager";
import { ktpService } from "../services/ktpService";
import { KTP_ENUMS } from "../constants/enums.jsx";

const KTP = () => {
  const columns = [
    {
      key: "nik",
      title: "NIK",
      render: (value) => (
        <div className="font-mono text-sm text-gray-900">{value}</div>
      ),
    },
    {
      key: "alamat",
      title: "Alamat",
      render: (value) => (
        <div className="text-gray-600 max-w-xs truncate" title={value}>
          {value}
        </div>
      ),
    },
    {
      key: "tempat_lahir",
      title: "Tempat Lahir",
      render: (value) => <div className="text-gray-600">{value}</div>,
    },
    {
      key: "tanggal_lahir",
      title: "Tanggal Lahir",
      render: (value) => (
        <div className="text-gray-600 text-sm">
          {value ? new Date(value).toLocaleDateString("id-ID") : "-"}
        </div>
      ),
    },
    {
      key: "jenis_kelamin",
      title: "Jenis Kelamin",
      render: (value) => {
        const jenisKelamin = KTP_ENUMS.JENIS_KELAMIN.find(item => item.value === value);
        return (
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              value === "L"
                ? "bg-blue-100 text-blue-800"
                : "bg-pink-100 text-pink-800"
            }`}
          >
            {jenisKelamin ? jenisKelamin.label : value}
          </span>
        );
      },
      sortable: true,
    },
    {
      key: "creator_name",
      title: "Dibuat Oleh",
      render: (value) => <div className="text-gray-600">{value || "-"}</div>,
    },
  ];

  const formFields = [
    {
      name: "nik",
      label: "NIK",
      type: "text",
      required: true,
      placeholder: "16 digit angka",
      icon: "🆔",
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
      name: "jenis_kelamin",
      label: "Jenis Kelamin",
      type: "select",
      required: true,
      options: KTP_ENUMS.JENIS_KELAMIN,
      icon: "👤",
    },
    {
      name: "agama",
      label: "Agama",
      type: "select",
      required: true,
      options: KTP_ENUMS.AGAMA,
      icon: "🕌",
    },
    {
      name: "status_perkawinan",
      label: "Status Perkawinan",
      type: "select",
      required: true,
      options: KTP_ENUMS.STATUS_PERKAWINAN,
      icon: "💍",
    },
    {
      name: "gol_darah",
      label: "Golongan Darah",
      type: "select",
      required: true,
      options: KTP_ENUMS.GOLONGAN_DARAH,
      icon: "🩸",
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
      name: "kewarganegaraan",
      label: "Kewarganegaraan",
      type: "text",
      required: true,
      placeholder: "Contoh: WNI",
      icon: "🇮🇩",
    },
    {
      name: "alamat",
      label: "Alamat",
      type: "textarea",
      required: true,
      placeholder: "Alamat lengkap sesuai KTP",
      rows: 3,
      fullWidth: true,
      icon: "🏠",
    },
  ];

  const initialFormData = {
    nik: "",
    alamat: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    jenis_kelamin: "",
    agama: "",
    status_perkawinan: "",
    gol_darah: "",
    pekerjaan: "",
    kewarganegaraan: "",
  };

  const validationRules = {
    nik: {
      required: true,
      label: "NIK",
      pattern: /^[0-9]{16}$/,
      patternMessage: "NIK harus 16 digit angka",
    },
    alamat: {
      required: true,
      label: "Alamat",
      maxLength: 1000,
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
    jenis_kelamin: {
      required: true,
      label: "Jenis Kelamin",
    },
    agama: {
      required: true,
      label: "Agama",
    },
    status_perkawinan: {
      required: true,
      label: "Status Perkawinan",
    },
    gol_darah: {
      required: true,
      label: "Golongan Darah",
    },
    pekerjaan: {
      required: true,
      label: "Pekerjaan",
      maxLength: 100,
    },
    kewarganegaraan: {
      required: true,
      label: "Kewarganegaraan",
      maxLength: 50,
    },
  };

  const filterOptions = [
    {
      key: "jenis_kelamin",
      label: "Jenis Kelamin",
      placeholder: "Filter Jenis Kelamin",
      options: KTP_ENUMS.JENIS_KELAMIN,
    },
    {
      key: "agama",
      label: "Agama",
      placeholder: "Filter Agama",
      options: KTP_ENUMS.AGAMA,
    },
    {
      key: "status_perkawinan",
      label: "Status Perkawinan",
      placeholder: "Filter Status Perkawinan",
      options: KTP_ENUMS.STATUS_PERKAWINAN,
    },
  ];

  return (
    <CRUDManager
      title="Data KTP"
      description="Kelola data Kartu Tanda Penduduk"
      service={ktpService}
      columns={columns}
      formFields={formFields}
      initialFormData={initialFormData}
      validationRules={validationRules}
      searchPlaceholder="Cari NIK, alamat, tempat lahir, atau pekerjaan..."
      filterOptions={filterOptions}
      icon="🆔"
    />
  );
};

export default KTP;
