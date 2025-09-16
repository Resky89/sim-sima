import { useState } from "react";
import Input from "./Input";
import Select from "./Select";
import Button from "./Button";

const SearchFilter = ({
  searchPlaceholder = "Cari...",
  filterOptions = [],
  onSearch,
  onFilter,
  onReset,
  className = "",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValues, setFilterValues] = useState({});

  const handleSearch = (value) => {
    setSearchTerm(value);
    onSearch?.(value);
  };

  const handleFilter = (key, value) => {
    const newFilters = { ...filterValues, [key]: value };
    setFilterValues(newFilters);
    onFilter?.(newFilters);
  };

  const handleReset = () => {
    setSearchTerm("");
    setFilterValues({});
    onSearch?.("");
    onFilter?.({});
    onReset?.();
  };

  const hasActiveFilters = searchTerm || Object.values(filterValues).some(value => value);

  return (
    <div className={`bg-white border-b border-gray-200 p-6 ${className}`}>
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Search Input */}
        <div className="flex-1 w-full lg:w-auto lg:max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
            {searchTerm && (
              <button
                onClick={() => handleSearch("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        {filterOptions.length > 0 && (
          <div className="flex flex-wrap gap-3 items-center">
            {filterOptions.map((filter) => (
              <div key={filter.key} className="min-w-[160px]">
                <Select
                  options={[
                    { value: "", label: filter.placeholder || `Semua ${filter.label}` },
                    ...filter.options
                  ]}
                  value={filterValues[filter.key] || ""}
                  onChange={(e) => handleFilter(filter.key, e.target.value)}
                  className="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
            ))}

            {/* Reset Button */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 border-gray-300 hover:border-gray-400 transition-all duration-200"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Reset</span>
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {searchTerm && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              "{searchTerm}"
              <button
                onClick={() => handleSearch("")}
                className="ml-2 hover:text-blue-600"
              >
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}

          {Object.entries(filterValues).map(([key, value]) => {
            if (!value) return null;
            const filter = filterOptions.find(f => f.key === key);
            const option = filter?.options.find(opt => opt.value === value);
            
            return (
              <span
                key={key}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
              >
                {filter?.label}: {option?.label || value}
                <button
                  onClick={() => handleFilter(key, "")}
                  className="ml-2 hover:text-green-600"
                >
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchFilter;
