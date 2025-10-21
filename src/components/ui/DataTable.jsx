import { useState } from "react";
import Button from "./Button";
import Input from "./Input";
import Select from "./Select";

const DataTable = ({
  data = [],
  columns = [],
  loading = false,
  pagination = {},
  onPageChange,
  onLimitChange,
  onSearch,
  onFilter,
  searchPlaceholder = "Cari...",
  filterOptions = [],
  actions = null,
  onRowClick = null,
  className = "",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValues, setFilterValues] = useState({});

  // Normalize pagination values to be resilient across different shapes
  const currentPage = pagination.current_page ?? pagination.page ?? 1;
  const totalPages = pagination.total_pages ?? 1;
  const limit = pagination.limit ?? 10;
  const totalItems = pagination.total_items ?? data.length ?? 0;

  const handleSearch = (value) => {
    setSearchTerm(value);
    onSearch?.(value);
  };

  const handleFilter = (key, value) => {
    const newFilters = { ...filterValues, [key]: value };
    setFilterValues(newFilters);
    onFilter?.(newFilters);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const showHeader = Boolean(onSearch) || (filterOptions && filterOptions.length > 0) || Boolean(actions);

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}
    >
      {/* Header with Search and Filters */}
      {showHeader && (
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 w-full sm:w-auto">
              {onSearch && (
                <Input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="max-w-md"
                />
              )}
            </div>

            {filterOptions.length > 0 && (
              <div className="flex gap-3 flex-wrap">
                {filterOptions.map((filter) => {
                  const isBoolean = Array.isArray(filter.options) && filter.options.some(opt => typeof opt.value === "boolean");
                  const currentVal = filterValues[filter.key];
                  const selectValue = (currentVal ?? "") === ""
                    ? ""
                    : (isBoolean ? String(currentVal) : currentVal);
                  return (
                    <Select
                      key={filter.key}
                      options={filter.options}
                      placeholder={filter.placeholder}
                      value={selectValue}
                      onChange={(e) => {
                        let value = e.target.value;
                        if (isBoolean) {
                          if (value === "true") value = true;
                          if (value === "false") value = false;
                        }
                        handleFilter(filter.key, value);
                      }}
                      className="min-w-[150px]"
                    />
                  );
                })}
              </div>
            )}

            {actions && <div className="flex gap-2">{actions}</div>}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Memuat data...</span>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📄</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Tidak ada data
            </h3>
            <p className="text-gray-500">
              Belum ada data yang tersedia untuk ditampilkan.
            </p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row, index) => (
                <tr
                  key={row.id || index}
                  className={`hover:bg-gray-50 transition-colors ${
                    onRowClick ? "cursor-pointer" : ""
                  }`}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-6 py-4 whitespace-nowrap"
                    >
                      {column.render ? (
                        column.render(row[column.key], row)
                      ) : (
                        <div
                          className={`text-sm ${
                            column.className || "text-gray-900"
                          }`}
                        >
                          {row[column.key] || "-"}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {(totalItems > 0 || typeof onLimitChange === 'function') && (
        <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => onPageChange?.(currentPage - 1)}
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange?.(currentPage + 1)}
            >
              Selanjutnya
            </Button>
          </div>

          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4">
              <p className="text-sm text-gray-700">
                Menampilkan{" "}
                <span className="font-medium">
                  {(currentPage - 1) * limit + (totalItems > 0 ? 1 : 0)}
                </span>{" "}
                sampai{" "}
                <span className="font-medium">
                  {Math.min(currentPage * limit, totalItems)}
                </span>{" "}
                dari{" "}
                <span className="font-medium">{totalItems}</span>{" "}
                data
              </p>

              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-700">Per halaman:</label>
                <select
                  value={limit}
                  onChange={(e) => onLimitChange?.(parseInt(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>

            <div>
              {totalPages > 1 && (
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => onPageChange?.(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sebelumnya
                </button>

                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    onClick={() => onPageChange?.(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      page === currentPage
                        ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => onPageChange?.(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Selanjutnya
                </button>
              </nav>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
