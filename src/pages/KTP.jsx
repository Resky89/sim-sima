import { useState, useEffect } from "react";
import { ktpService } from "../services/ktpService";
import { KTP_ENUMS } from "../constants/enums.jsx";
import DataTable from "../components/ui/DataTable";
import SearchFilter from "../components/ui/SearchFilter";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const KTP = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...searchParams,
        ...filters,
      };
      
      const response = await ktpService.getKTPs(params);
      setData(response.data);
      setPagination({
        page: response.pagination.current_page,
        limit: response.pagination.limit,
        total_items: response.pagination.total_items,
        total_pages: response.pagination.total_pages,
      });
      setError(null);
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
          data={data}
          columns={columns}
          pagination={{
            page: pagination.page,
            limit: pagination.limit,
            total_items: pagination.total_items,
            total_pages: pagination.total_pages,
            onPageChange: handlePageChange,
            onLimitChange: handleLimitChange,
          }}
          onSort={handleSort}
          sortBy={searchParams.sort_by}
          sortOrder={searchParams.sort_order}
          emptyMessage="Tidak ada data KTP yang ditemukan"
        />
      )}
    </div>
  );
};

export default KTP;
