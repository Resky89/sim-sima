import { useState, useEffect, useCallback } from 'react';

export const useApi = (apiFunction, initialParams = null, immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (params = initialParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiFunction(params);
      setData(response);
      return response;
    } catch (err) {
      setError(err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, initialParams]);

  useEffect(() => {
    if (immediate && initialParams !== null) {
      execute();
    }
  }, [execute, immediate, initialParams]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset
  };
};

export const usePagination = (initialPage = 1, initialLimit = 10) => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filters, setFilters] = useState({});

  const resetPagination = useCallback(() => {
    setPage(1);
    setSearch('');
    setFilters({});
  }, []);

  const getParams = useCallback(() => ({
    page,
    limit,
    ...(search && { search }),
    sort_by: sortBy,
    sort_order: sortOrder,
    ...filters
  }), [page, limit, search, sortBy, sortOrder, filters]);

  return {
    page,
    setPage,
    limit,
    setLimit,
    search,
    setSearch,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    filters,
    setFilters,
    resetPagination,
    getParams
  };
};
