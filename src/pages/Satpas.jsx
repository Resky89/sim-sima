import CRUDManager from "../components/common/CRUDManager";
import { satpasService } from "../services/satpasService";

const Satpas = () => {
  const columns = [
    {
      key: "name",
      title: "Nama Satpas",
      render: (value) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-white text-lg">🏢</span>
          </div>
          <span className="text-gray-900 font-semibold">{value}</span>
        </div>
      ),
    },
    {
      key: "latitude",
      title: "Latitude",
      render: (value) => (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">📍</span>
          <span className="font-mono text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded">{value}</span>
        </div>
      ),
    },
    {
      key: "longitude",
      title: "Longitude",
      render: (value) => (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">🧭</span>
          <span className="font-mono text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded">{value}</span>
        </div>
      ),
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
      icon: "📍",
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
    <div className="max-w-lg mx-auto animate-fade-in">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header with Map Preview Placeholder */}
        <div className="relative h-40 bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 overflow-hidden">
          {/* Map Grid Pattern */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px'
          }}></div>
          
          {/* Location Pin */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white shadow-2xl animate-pulse">
                <span className="text-3xl">📍</span>
              </div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-lg"></div>
            </div>
          </div>
          
          {/* Gradient Overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
        </div>
        
        {/* Content */}
        <div className="p-6 -mt-4 relative">
          {/* Name Badge */}
          <div className="bg-white rounded-xl shadow-lg p-4 mb-5 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl">🏢</span>
              </div>
              <div>
                <p className="text-xs text-cyan-600 font-medium mb-0.5">Nama Satpas</p>
                <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
              </div>
            </div>
          </div>
          
          {/* Coordinates */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-xl border border-emerald-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base">📍</span>
                <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Latitude</span>
              </div>
              <p className="font-mono text-lg font-bold text-gray-900">{item.latitude}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base">🧭</span>
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Longitude</span>
              </div>
              <p className="font-mono text-lg font-bold text-gray-900">{item.longitude}</p>
            </div>
          </div>
          
          {/* Google Maps Link */}
          <a
            href={`https://www.google.com/maps?q=${item.latitude},${item.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
          >
            <span>🗺️</span>
            <span>Buka di Google Maps</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          
          {/* Timestamps */}
          {(item.created_at || item.updated_at) && (
            <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
              {item.created_at && (
                <span>Dibuat: {new Date(item.created_at).toLocaleDateString("id-ID")}</span>
              )}
              {item.updated_at && (
                <span>Diubah: {new Date(item.updated_at).toLocaleDateString("id-ID")}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <CRUDManager
      title="Data Satpas"
      description="Satuan Penyelenggara Administrasi SIM"
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
