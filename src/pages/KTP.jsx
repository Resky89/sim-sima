import { useState, useEffect } from "react";
import { KTPController } from "../controllers/KTPController";
import { KTP_ENUMS } from "../constants/enums.jsx";
import DataTable from "../components/ui/DataTable";
import SearchFilter from "../components/ui/SearchFilter";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import Modal from "../components/ui/Modal";

const KTP = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedKTP, setSelectedKTP] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total_items: 0,
    total_pages: 0,
  });
  const [searchParams, setSearchParams] = useState({
    search: "",
    sort_by: "created_at",
    sort_order: "desc",
  });
  const [filters, setFilters] = useState({});

  const columns = [
    {
      key: "nik",
      title: "NIK",
      render: (value, record) => (
        <button 
          onClick={() => handleViewDetail(record.nik)} 
          className="font-mono text-sm bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
        >
          {value}
        </button>
      ),
    },
    {
      key: "nama_lengkap",
      title: "Nama",
      render: (value) => (
        <div className="text-gray-800 font-medium">{value}</div>
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
            className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${
              value === "L"
                ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200"
                : "bg-gradient-to-r from-pink-50 to-pink-100 text-pink-700 border border-pink-200"
            }`}
          >
            {jenisKelamin ? jenisKelamin.label : value}
          </span>
        );
      },
      sortable: true,
    },
  ];

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

  const handleViewDetail = async (nik) => {
    setLoadingDetail(true);
    try {
      const response = await KTPController.getKTPByNIK({ params: { nik } }, {
        json: (data) => data
      });
      
      if (response.success) {
        setSelectedKTP(response.data);
        setShowDetailModal(true);
      } else {
        setError("Gagal memuat detail KTP: " + response.message);
      }
    } catch (err) {
      console.error("Error fetching KTP detail:", err);
      setError("Gagal memuat detail KTP. Silakan coba lagi nanti.");
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedKTP(null);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await KTPController.getAllKTP({}, {
        json: (data) => data
      });
      
      if (response.success) {
        const items = Array.isArray(response.data) ? response.data : [];
        const totalItems = (typeof response.total === 'number' ? response.total : items.length) || 0;
        setData(items);
        setPagination((prev) => {
          const limit = prev.limit || 10;
          const total_pages = Math.max(1, Math.ceil(totalItems / limit));
          const page = Math.min(prev.page || 1, total_pages);
          return { ...prev, page, limit, total_items: totalItems, total_pages };
        });
        setError(null);
      } else {
        throw new Error(response.message || "Gagal memuat data KTP");
      }
    } catch (err) {
      console.error("Error fetching KTP data:", err);
      setError("Gagal memuat data KTP. Silakan coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination.page, pagination.limit, searchParams, filters]);

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleLimitChange = (limit) => {
    setPagination((prev) => ({ ...prev, page: 1, limit }));
  };

  const handleSearch = (search) => {
    setSearchParams((prev) => ({ ...prev, search }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (filters) => {
    setFilters(filters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const pageData = Array.isArray(data)
    ? data.slice(
        Math.max(0, ((pagination.page || 1) - 1) * (pagination.limit || 10)),
        Math.max(0, ((pagination.page || 1) - 1) * (pagination.limit || 10)) + (pagination.limit || 10)
      )
    : [];

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? "-" : d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-100/50 to-indigo-100/50 rounded-full -translate-y-32 translate-x-32 blur-3xl"></div>
        <div className="relative p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl blur-lg opacity-50"></div>
                <div className="relative h-14 w-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">🆔</span>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Data KTP</h1>
                <p className="text-gray-500 mt-0.5 text-sm">Kartu Tanda Penduduk Elektronik</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
              <span className="text-purple-600 font-semibold">{data.length}</span>
              <span className="text-gray-500 text-sm">Total Data</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <SearchFilter
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            filterOptions={filterOptions}
            searchPlaceholder="Cari berdasarkan NIK atau alamat..."
          />
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
          </div>
        )}
        
        {error && (
          <div className="m-6 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-red-500">⚠️</span>
            </div>
            <div>
              <p className="font-semibold">Terjadi Kesalahan</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && (
          <DataTable
            data={pageData}
            columns={columns}
            pagination={{
              current_page: pagination.page,
              limit: pagination.limit,
              total_items: pagination.total_items,
              total_pages: pagination.total_pages,
            }}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
            emptyMessage="Tidak ada data KTP yang ditemukan"
            className="border-0 shadow-none"
          />
        )}
      </div>

      {/* Modal Detail KTP */}
      <Modal
        isOpen={showDetailModal}
        onClose={handleCloseModal}
        title="Detail KTP"
        size="xl"
      >
        {loadingDetail ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner />
          </div>
        ) : selectedKTP ? (
          <div className="animate-fade-in">
            {/* KTP Card - Realistic Design */}
            <div className="ktp-card relative mx-auto w-full max-w-2xl aspect-[1.586/1]">
              {/* Watermark */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[100px] font-black text-blue-500/5 transform -rotate-12 pointer-events-none select-none whitespace-nowrap">
                INDONESIA
              </div>
              
              {/* Hologram Effect */}
              <div className="absolute top-4 right-4 w-14 h-14 rounded-full bg-gradient-to-br from-yellow-300/40 via-gray-300/40 to-yellow-300/40 animate-pulse"></div>
              
              {/* Card Content */}
              <div className="relative z-10 h-full p-4 md:p-5 flex flex-col">
                {/* Header */}
                <div className="text-center mb-3">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div className="w-7 h-7 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow">
                      <span className="text-xs">🦅</span>
                    </div>
                    <div className="text-[10px] font-bold tracking-[0.15em] text-blue-900 uppercase">
                      Republik Indonesia
                    </div>
                  </div>
                  <h2 className="font-extrabold text-base md:text-lg text-blue-900 tracking-wide">
                    PROVINSI {selectedKTP.provinsi?.toUpperCase() || '-'}
                  </h2>
                  <h3 className="font-bold text-sm text-blue-800">
                    KABUPATEN {selectedKTP.kabupaten?.toUpperCase() || '-'}
                  </h3>
                </div>
                
                {/* NIK Row */}
                <div className="flex items-center justify-between bg-white/50 rounded-lg px-3 py-1.5 mb-2 backdrop-blur-sm">
                  <span className="font-bold text-blue-900 text-xs">NIK</span>
                  <span className="font-mono font-bold text-sm tracking-[0.1em] text-gray-900">
                    {selectedKTP.nik}
                  </span>
                </div>
                
                {/* Main Content */}
                <div className="flex-1 grid grid-cols-3 gap-3">
                  {/* Left Column - Data */}
                  <div className="col-span-2 space-y-0.5">
                    <div className="grid grid-cols-[120px_10px_1fr] gap-x-1 text-[11px] text-gray-900">
                      <div className="font-semibold text-blue-900">Nama</div>
                      <div>:</div>
                      <div className="font-bold uppercase truncate">{selectedKTP.nama_lengkap}</div>
                      
                      <div className="font-semibold text-blue-900">Tempat/Tgl Lahir</div>
                      <div>:</div>
                      <div className="font-medium truncate">
                        {selectedKTP.tempat_lahir}, {formatDate(selectedKTP.tanggal_lahir)}
                      </div>
                      
                      <div className="font-semibold text-blue-900">Jenis Kelamin</div>
                      <div>:</div>
                      <div className="font-medium flex items-center gap-3">
                        <span>{selectedKTP.jenis_kelamin === 'L' ? 'LAKI-LAKI' : 'PEREMPUAN'}</span>
                        <span className="text-blue-900 font-semibold">Gol. Darah :</span>
                        <span className="font-bold">{selectedKTP.golongan_darah || '-'}</span>
                      </div>
                      
                      <div className="font-semibold text-blue-900">Alamat</div>
                      <div>:</div>
                      <div className="font-medium truncate">{selectedKTP.alamat}</div>
                      
                      <div className="font-semibold text-blue-900">RT/RW</div>
                      <div>:</div>
                      <div className="font-medium">{selectedKTP.rt || '000'}/{selectedKTP.rw || '000'}</div>
                      
                      <div className="font-semibold text-blue-900">Kel/Desa</div>
                      <div>:</div>
                      <div className="font-medium truncate">{selectedKTP.kelurahan}</div>
                      
                      <div className="font-semibold text-blue-900">Kecamatan</div>
                      <div>:</div>
                      <div className="font-medium truncate">{selectedKTP.kecamatan}</div>
                      
                      <div className="font-semibold text-blue-900">Agama</div>
                      <div>:</div>
                      <div className="font-medium uppercase">{selectedKTP.agama}</div>
                      
                      <div className="font-semibold text-blue-900">Status Perkawinan</div>
                      <div>:</div>
                      <div className="font-medium uppercase">{selectedKTP.status_perkawinan}</div>
                      
                      <div className="font-semibold text-blue-900">Pekerjaan</div>
                      <div>:</div>
                      <div className="font-medium uppercase truncate">{selectedKTP.pekerjaan}</div>
                      
                      <div className="font-semibold text-blue-900">Kewarganegaraan</div>
                      <div>:</div>
                      <div className="font-medium uppercase">{selectedKTP.kewarganegaraan || 'WNI'}</div>
                      
                      <div className="font-semibold text-blue-900">Berlaku Hingga</div>
                      <div>:</div>
                      <div className="font-bold text-blue-900">SEUMUR HIDUP</div>
                    </div>
                  </div>
                  
                  {/* Right Column - Photo & Signature */}
                  <div className="col-span-1 flex flex-col items-center justify-between">
                    {/* Photo */}
                    <div className="relative">
                      <div className="w-20 h-26 md:w-24 md:h-32 bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-blue-300 rounded-lg shadow overflow-hidden flex items-center justify-center">
                        {selectedKTP.pas_foto_path ? (
                          <img 
                            src={selectedKTP.pas_foto_path} 
                            alt="Foto KTP" 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="text-center p-2">
                            <div className="text-3xl text-gray-400 mb-1">👤</div>
                            <div className="text-gray-400 text-[8px]">Foto</div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Signature Area */}
                    <div className="text-center mt-2 w-full">
                      <div className="text-[9px] text-gray-700 mb-0.5">
                        {selectedKTP.kabupaten}
                      </div>
                      <div className="h-8 border-b border-gray-400 mb-1"></div>
                      <div className="text-[8px] font-semibold text-blue-900 leading-tight">
                        KEPALA DINAS DUKCAPIL
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Additional Info */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-xl border border-blue-100">
                <div className="text-xs text-blue-600 font-medium mb-0.5">Provinsi</div>
                <div className="font-semibold text-gray-800 truncate text-sm">{selectedKTP.provinsi || '-'}</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 rounded-xl border border-purple-100">
                <div className="text-xs text-purple-600 font-medium mb-0.5">Kabupaten</div>
                <div className="font-semibold text-gray-800 truncate text-sm">{selectedKTP.kabupaten || '-'}</div>
              </div>
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-3 rounded-xl border border-cyan-100">
                <div className="text-xs text-cyan-600 font-medium mb-0.5">Kecamatan</div>
                <div className="font-semibold text-gray-800 truncate text-sm">{selectedKTP.kecamatan || '-'}</div>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-3 rounded-xl border border-emerald-100">
                <div className="text-xs text-emerald-600 font-medium mb-0.5">Kelurahan</div>
                <div className="font-semibold text-gray-800 truncate text-sm">{selectedKTP.kelurahan || '-'}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📄</div>
            <p className="text-gray-500">Data KTP tidak ditemukan</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default KTP;
