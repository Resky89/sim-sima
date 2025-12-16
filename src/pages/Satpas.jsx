import CRUDManager from "../components/common/CRUDManager";
import { satpasService } from "../services/satpasService";
import { useState, useEffect, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Custom marker icon untuk Satpas
const satpasIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Custom red marker for selected location
const selectedIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Indonesia center coordinates
const INDONESIA_CENTER = [-2.5489, 118.0149];
const DEFAULT_ZOOM = 5;
const DETAIL_ZOOM = 15;

// Component to handle map click events for location selection
const LocationPicker = ({ onLocationSelect, position }) => {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return position ? (
    <Marker position={position} icon={selectedIcon}>
      <Popup>
        <div className="text-center">
          <span className="font-semibold text-gray-800">Lokasi Terpilih</span>
          <br />
          <span className="text-xs text-gray-500">
            {position[0].toFixed(6)}, {position[1].toFixed(6)}
          </span>
        </div>
      </Popup>
    </Marker>
  ) : null;
};

// Component to recenter map when position changes
const MapRecenter = ({ position, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, zoom || DETAIL_ZOOM);
    }
  }, [map, position, zoom]);
  return null;
};

const Satpas = () => {
  const [allSatpas, setAllSatpas] = useState([]);
  const [loadingMap, setLoadingMap] = useState(false);

  // Load all satpas for map display
  const loadAllSatpas = useCallback(async () => {
    setLoadingMap(true);
    try {
      const res = await satpasService.getList({ limit: 100 });
      const items = res?.data || [];
      setAllSatpas(items);
    } catch (err) {
      console.error("Failed to load satpas for map:", err);
    } finally {
      setLoadingMap(false);
    }
  }, []);

  useEffect(() => {
    loadAllSatpas();
  }, [loadAllSatpas]);

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
      placeholder: "Klik pada peta atau masukkan manual",
      icon: "📍",
      step: "any",
    },
    {
      name: "longitude",
      label: "Longitude",
      type: "number",
      required: true,
      placeholder: "Klik pada peta atau masukkan manual",
      icon: "🧭",
      step: "any",
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

  // Render detail view with Leaflet map
  const renderView = (item) => {
    const lat = parseFloat(item.latitude);
    const lng = parseFloat(item.longitude);
    const hasValidCoords = !isNaN(lat) && !isNaN(lng);

    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Header with Leaflet Map */}
          <div className="relative h-64 overflow-hidden">
            {hasValidCoords ? (
              <MapContainer
                center={[lat, lng]}
                zoom={DETAIL_ZOOM}
                className="h-full w-full z-0"
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[lat, lng]} icon={satpasIcon}>
                  <Popup>
                    <div className="text-center">
                      <span className="font-bold text-gray-800">{item.name}</span>
                      <br />
                      <span className="text-xs text-gray-500">
                        {lat.toFixed(6)}, {lng.toFixed(6)}
                      </span>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            ) : (
              <div className="h-full bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <span className="text-4xl mb-2 block">📍</span>
                  <span className="text-sm opacity-80">Koordinat tidak valid</span>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Name Badge */}
            <div className="bg-white rounded-xl shadow-lg p-4 mb-5 border border-gray-100 -mt-12 relative z-10">
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
  };

  // Render form with Leaflet map for location picking
  const renderFormExtra = ({ formData, setFormData, mode }) => {
    const lat = parseFloat(formData?.latitude);
    const lng = parseFloat(formData?.longitude);
    const hasValidCoords = !isNaN(lat) && !isNaN(lng);
    const position = hasValidCoords ? [lat, lng] : null;

    const handleLocationSelect = (newLat, newLng) => {
      setFormData((prev) => ({
        ...prev,
        latitude: newLat.toFixed(6),
        longitude: newLng.toFixed(6),
      }));
    };

    return (
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          <span className="flex items-center gap-2">
            <span>🗺️</span>
            <span>Pilih Lokasi di Peta</span>
          </span>
          <span className="text-xs font-normal text-gray-500 mt-1 block">
            Klik pada peta untuk memilih lokasi Satpas
          </span>
        </label>
        <div className="rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm hover:border-cyan-400 transition-colors">
          <MapContainer
            center={position || INDONESIA_CENTER}
            zoom={position ? DETAIL_ZOOM : DEFAULT_ZOOM}
            className="h-80 w-full z-0"
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationPicker onLocationSelect={handleLocationSelect} position={position} />
            {position && <MapRecenter position={position} zoom={DETAIL_ZOOM} />}
          </MapContainer>
        </div>
        {position && (
          <div className="mt-2 flex items-center gap-2 text-sm text-emerald-600">
            <span>✓</span>
            <span>Lokasi terpilih: {lat.toFixed(6)}, {lng.toFixed(6)}</span>
          </div>
        )}
      </div>
    );
  };

  // Render header with map showing all Satpas locations
  const renderHeader = () => {
    const validSatpas = allSatpas.filter((s) => {
      const lat = parseFloat(s.latitude);
      const lng = parseFloat(s.longitude);
      return !isNaN(lat) && !isNaN(lng);
    });

    return (
      <div className="mb-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-cyan-500 to-blue-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <span className="text-xl">🗺️</span>
                </div>
                <div>
                  <h3 className="text-white font-bold">Peta Lokasi Satpas</h3>
                  <p className="text-white/80 text-sm">{validSatpas.length} lokasi ditemukan</p>
                </div>
              </div>
              {loadingMap && (
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Memuat...</span>
                </div>
              )}
            </div>
          </div>
          <div className="h-80">
            <MapContainer
              center={INDONESIA_CENTER}
              zoom={DEFAULT_ZOOM}
              className="h-full w-full z-0"
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {validSatpas.map((satpas) => {
                const lat = parseFloat(satpas.latitude);
                const lng = parseFloat(satpas.longitude);
                return (
                  <Marker key={satpas.id} position={[lat, lng]} icon={satpasIcon}>
                    <Popup>
                      <div className="text-center min-w-[150px]">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <span className="text-lg">🏢</span>
                          <span className="font-bold text-gray-800">{satpas.name}</span>
                        </div>
                        <div className="text-xs text-gray-500 space-y-1">
                          <div>📍 Lat: {lat.toFixed(6)}</div>
                          <div>🧭 Lng: {lng.toFixed(6)}</div>
                        </div>
                        <a
                          href={`https://www.google.com/maps?q=${lat},${lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded-full hover:bg-blue-600 transition-colors"
                        >
                          <span>Google Maps</span>
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </div>
      </div>
    );
  };

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
      renderFormExtra={renderFormExtra}
      renderHeader={renderHeader}
      onDataChange={loadAllSatpas}
    />
  );
};

export default Satpas;
