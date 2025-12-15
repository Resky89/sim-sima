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
  emptyMessage = "Tidak ada data yang tersedia",
  className = "",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValues, setFilterValues] = useState({});

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
    <div className={`card-premium overflow-hidden ${className}`}>
      {/* Header with Search and Filters */}
      {showHeader && (
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-blue-50/30">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 w-full sm:w-auto">
              {onSearch && (
                <div className="relative max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 shadow-sm"
                  />
                </div>
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
          <div className="flex flex-col items-center justify-center py-16">
            <div className="loading-spinner mb-4"></div>
            <span className="text-gray-500 text-sm">Memuat data...</span>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl flex items-center justify-center">
              <span className="text-4xl">📄</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Tidak ada data
            </h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto">
              {emptyMessage}
            </p>
          </div>
        ) : (
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-blue-50/30">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    {column.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((row, index) => (
                <tr
                  key={row.id || index}
                  className={`hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-purple-50/20 transition-all duration-200 ${
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
        <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 px-6 py-4 flex items-center justify-between border-t border-gray-100">
          {/* Mobile Pagination */}
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => onPageChange?.(currentPage - 1)}
              className="px-4 py-2"
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange?.(currentPage + 1)}
              className="px-4 py-2"
            >
              Selanjutnya
            </Button>
          </div>

          {/* Desktop Pagination */}
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center gap-6">
              <p className="text-sm text-gray-600">
                Menampilkan{" "}
                <span className="font-semibold text-gray-900">
                  {(currentPage - 1) * limit + (totalItems > 0 ? 1 : 0)}
                </span>{" "}
                -{" "}
                <span className="font-semibold text-gray-900">
                  {Math.min(currentPage * limit, totalItems)}
                </span>{" "}
                dari{" "}
                <span className="font-semibold text-gray-900">{totalItems}</span>{" "}
                data
              </p>

              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Per halaman:</label>
                <select
                  value={limit}
                  onChange={(e) => onLimitChange?.(parseInt(e.target.value))}
                  className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white shadow-sm transition-all duration-200"
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
                <nav className="flex items-center gap-1">
                  <button
                    onClick={() => onPageChange?.(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => onPageChange?.(page)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        page === currentPage
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                          : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 shadow-sm"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => onPageChange?.(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
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
