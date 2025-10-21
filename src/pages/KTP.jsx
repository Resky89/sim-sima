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
          className="font-mono text-sm text-blue-600 hover:text-blue-800 hover:underline"
        >
          {value}
        </button>
      ),
    },
    {
      key: "nama_lengkap",
      title: "Nama",
      render: (value) => <div className="text-gray-900">{value}</div>,
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
      // Menggunakan KTPController untuk mendapatkan data KTP berdasarkan NIK
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
      // Menggunakan KTPController untuk mendapatkan semua data KTP
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

  const handleSort = (key, order) => {
    setSearchParams((prev) => ({
      ...prev,
      sort_by: key,
      sort_order: order,
    }));
  };

  const handleFilterChange = (filters) => {
    setFilters(filters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <span className="mr-2">📇</span>
          KTP
        </h1>
        <p className="text-gray-600">
          Data Kartu Tanda Penduduk (hanya untuk melihat data)
        </p>
      </div>

      <SearchFilter
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        filterOptions={filterOptions}
        searchPlaceholder="Cari berdasarkan NIK atau alamat..."
      />

      {loading && <LoadingSpinner />}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
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
        />
      )}

      {/* Modal Detail KTP */}
      <Modal
        isOpen={showDetailModal}
        onClose={handleCloseModal}
        title="Detail KTP"
        size="lg"
      >
        {loadingDetail ? (
          <div className="flex justify-center p-4">
            <LoadingSpinner />
          </div>
        ) : selectedKTP ? (
          <div className="p-2">
            {/* KTP Card Design */}
            <div className="relative mx-auto w-full max-w-3xl rounded-xl shadow-lg border border-sky-300 overflow-hidden">
              <div
                className="p-4 md:p-6"
                style={{
                  backgroundColor: '#b3e5fc',
                  backgroundImage:
                    'radial-gradient(circle at 20% 20%, rgba(255,255,255,.5), rgba(255,255,255,0) 40%), radial-gradient(circle at 80% 30%, rgba(255,255,255,.35), rgba(255,255,255,0) 35%), repeating-linear-gradient(45deg, rgba(13,110,253,.08) 0px, rgba(13,110,253,.08) 4px, rgba(255,255,255,.08) 4px, rgba(255,255,255,.08) 8px)'
                }}
              >
                {/* Header */}
                <div className="text-center mb-4">
                  <div className="text-[11px] font-semibold tracking-widest text-blue-900">REPUBLIK INDONESIA</div>
                  <h2 className="font-extrabold text-lg md:text-xl text-blue-900 uppercase">PROVINSI {selectedKTP.provinsi || '-'}</h2>
                  <h3 className="font-bold text-sm md:text-base text-blue-900 uppercase">KABUPATEN {selectedKTP.kabupaten || '-'}</h3>
                </div>
                
                {/* KTP Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <div className="mb-2 font-semibold text-blue-900">
                      <span className="mr-2">NIK</span>
                      <span className="mr-1">:</span>
                      <span className="font-mono tracking-widest text-gray-900">{selectedKTP.nik}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-y-1 text-[13px] md:text-sm text-gray-900">
                      <div className="font-semibold">Nama</div>
                      <div className="col-span-2">: {selectedKTP.nama_lengkap}</div>
                      <div className="font-semibold">Tempat/Tgl Lahir</div>
                      <div className="col-span-2">: {selectedKTP.tempat_lahir}, {new Date(selectedKTP.tanggal_lahir).toLocaleDateString('id-ID')}</div>
                      <div className="font-semibold">Jenis Kelamin</div>
                      <div className="col-span-2 flex flex-wrap items-baseline">
                        <span className="mr-2">: {selectedKTP.jenis_kelamin === 'L' ? 'LAKI-LAKI' : 'PEREMPUAN'}</span>
                        <span className="ml-4 font-semibold">Gol. Darah</span>
                        <span className="ml-2">{selectedKTP.golongan_darah || '-'}</span>
                      </div>
                      <div className="font-semibold">Alamat</div>
                      <div className="col-span-2">: {selectedKTP.alamat}</div>
                      <div className="font-semibold">RT/RW</div>
                      <div className="col-span-2">: {selectedKTP.rt}/{selectedKTP.rw}</div>
                      <div className="font-semibold">Kel/Desa</div>
                      <div className="col-span-2">: {selectedKTP.kelurahan}</div>
                      <div className="font-semibold">Kecamatan</div>
                      <div className="col-span-2">: {selectedKTP.kecamatan}</div>
                      <div className="font-semibold">Agama</div>
                      <div className="col-span-2">: {selectedKTP.agama}</div>
                      <div className="font-semibold">Status Perkawinan</div>
                      <div className="col-span-2">: {selectedKTP.status_perkawinan}</div>
                      <div className="font-semibold">Pekerjaan</div>
                      <div className="col-span-2">: {selectedKTP.pekerjaan}</div>
                      <div className="font-semibold">Kewarganegaraan</div>
                      <div className="col-span-2">: {selectedKTP.kewarganegaraan}</div>
                      <div className="font-semibold">Berlaku Hingga</div>
                      <div className="col-span-2">: SEUMUR HIDUP</div>
                    </div>
                  </div>
                  
                  {/* Photo Area */}
                  <div className="md:col-span-1 flex flex-col items-center justify-start">
                    <div className="h-40 w-32 bg-white border-2 border-sky-400 shadow-inner overflow-hidden flex items-center justify-center mb-2">
                      {selectedKTP.pas_foto_path ? (
                        <img 
                          src={selectedKTP.pas_foto_path} 
                          alt="Foto KTP" 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="text-gray-400 text-xs text-center">Foto tidak tersedia</div>
                      )}
                    </div>
                    <div className="text-center mt-2 border-t border-gray-300 pt-2 w-full">
                      <div className="text-xs mb-1">{selectedKTP.kabupaten}, {new Date(selectedKTP.tanggal_selesai).toLocaleDateString('id-ID')}</div>
                      <div className="font-semibold text-[11px] leading-4">KEPALA DINAS KEPENDUDUKAN DAN PENCATATAN SIPIL</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center p-4 text-gray-500">Data KTP tidak ditemukan</div>
        )}
      </Modal>
    </div>
  );
};

export default KTP;
