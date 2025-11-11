import CRUDManager from "../components/common/CRUDManager";
import { satpasService } from "../services/satpasService";

const Satpas = () => {
  const columns = [
    {
      key: "name",
      title: "Nama Satpas",
      render: (value) => <div className="text-gray-900 font-medium">{value}</div>,
    },
    {
      key: "latitude",
      title: "Latitude",
      render: (value) => <div className="font-mono text-sm text-gray-700">{value}</div>,
    },
    {
      key: "longitude",
      title: "Longitude",
      render: (value) => <div className="font-mono text-sm text-gray-700">{value}</div>,
    },
  ];

  const formFields = [
    {
      name: "name",
      label: "Nama Satpas",
      type: "text",
      required: true,
      placeholder: "Masukkan nama Satpas",
      icon: "🏢",
    },
    {
      name: "latitude",
      label: "Latitude",
      type: "number",
      required: true,
      placeholder: "Contoh: -6.914744",
      icon: "🧭",
    },
    {
      name: "longitude",
      label: "Longitude",
      type: "number",
      required: true,
      placeholder: "Contoh: 107.60981",
      icon: "🧭",
    },
  ];

  const validationRules = {
    name: {
      required: true,
      label: "Nama Satpas",
      minLength: 3,
      maxLength: 100,
    },
    latitude: {
      required: true,
      label: "Latitude",
      custom: (value) => {
        if (value === undefined || value === null || value === "") return "Latitude wajib diisi";
        const n = Number(value);
        if (Number.isNaN(n)) return "Latitude harus berupa angka";
        if (n < -90 || n > 90) return "Latitude harus antara -90 hingga 90";
        return null;
      },
    },
    longitude: {
      required: true,
      label: "Longitude",
      custom: (value) => {
        if (value === undefined || value === null || value === "") return "Longitude wajib diisi";
        const n = Number(value);
        if (Number.isNaN(n)) return "Longitude harus berupa angka";
        if (n < -180 || n > 180) return "Longitude harus antara -180 hingga 180";
        return null;
      },
    },
  };

  const beforeSubmit = (data) => {
    const out = { ...data };
    if (out.latitude !== undefined) out.latitude = parseFloat(out.latitude);
    if (out.longitude !== undefined) out.longitude = parseFloat(out.longitude);
    return out;
  };

  const renderView = (item) => (
    <div className="max-w-xl mx-auto">
      <div className="rounded-2xl overflow-hidden shadow border border-gray-200 bg-white">
        <div className="px-5 py-4 border-b bg-gradient-to-r from-cyan-50 to-blue-50">
          <div className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span>🏢</span>
            <span>{item.name}</span>
          </div>
        </div>
        <div className="p-5 space-y-3 text-sm text-gray-800">
          <div className="flex items-center justify-between"><span className="text-gray-600">Latitude</span><span className="font-mono">{item.latitude}</span></div>
          <div className="flex items-center justify-between"><span className="text-gray-600">Longitude</span><span className="font-mono">{item.longitude}</span></div>
          {item.created_at && (
            <div className="flex items-center justify-between"><span className="text-gray-600">Dibuat</span><span>{item.created_at}</span></div>
          )}
          {item.updated_at && (
            <div className="flex items-center justify-between"><span className="text-gray-600">Diubah</span><span>{item.updated_at}</span></div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <CRUDManager
      title="Data Satpas"
      description="Kelola data Satpas (Satuan Penyelenggara Administrasi SIM)"
      service={satpasService}
      columns={columns}
      formFields={formFields}
      initialFormData={{}}
      validationRules={validationRules}
      searchPlaceholder="Cari nama Satpas..."
      icon="🏢"
      onBeforeSubmit={beforeSubmit}
      renderView={renderView}
    />
  );
};

export default Satpas;
