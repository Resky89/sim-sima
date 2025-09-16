import { useState, useEffect } from "react";
import { getErrorMessage } from "../utils/errorHandler";

export const useCRUD = ({
  service,
  initialFormData = {},
  validationRules = {},
  onDataTransform = (data) => data,
  pageSize = 10,
  sortBy = "created_at",
  sortOrder = "desc",
}) => {
  // State management
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    limit: pageSize,
  });

  // Modal states
  const [modals, setModals] = useState({
    create: false,
    edit: false,
    delete: false,
    view: false,
  });

  // Form states
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Search and filter states
  const [searchParams, setSearchParams] = useState({
    page: 1,
    limit: pageSize,
    search: "",
    sort_by: sortBy,
    sort_order: sortOrder,
  });

  // Load data function
  const loadData = async (params = searchParams) => {
    try {
      setLoading(true);
      setError("");

      // Check if service has the right method
      let response;

      if (service.getUsers) {
        response = await service.getUsers(params);
      } else if (service.getKTPList) {
        response = await service.getKTPList(params);
      } else if (service.getSIMList) {
        response = await service.getSIMList(params);
      } else if (service.getList) {
        response = await service.getList(params);
      } else if (typeof service.get === 'function') {
        // Fallback untuk service yang menggunakan metode get
        response = await service.get(params);
      } else {
        throw new Error("No suitable service method found");
      }

      if (response.success) {
        const transformedData = onDataTransform(response.data || []);
        setData(transformedData);
        setPagination(response.pagination || {});
      } else {
        setError(response.errors || "Gagal memuat data");
        setData([]);
      }
    } catch (error) {
      setError(getErrorMessage(error));
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Modal handlers
  const openModal = (type, item = null) => {
    setModals(prev => ({ ...prev, [type]: true }));
    if (item) {
      setSelectedItem(item);
      setFormData({ ...initialFormData, ...item });
    } else {
      resetForm();
    }
    setError("");
    setFormErrors({});
  };

  const closeModal = (type) => {
    setModals(prev => ({ ...prev, [type]: false }));
    setSelectedItem(null);
    resetForm();
  };

  // Form handlers
  const resetForm = () => {
    setFormData(initialFormData);
    setFormErrors({});
    setError("");
  };

  const validateForm = (data) => {
    const errors = {};

    Object.keys(validationRules).forEach((field) => {
      const rules = validationRules[field];
      const value = data[field];

      if (rules.required && (!value || value.toString().trim() === "")) {
        errors[field] = `${rules.label || field} wajib diisi`;
      }

      if (value && rules.minLength && value.toString().length < rules.minLength) {
        errors[field] = `${rules.label || field} minimal ${rules.minLength} karakter`;
      }

      if (value && rules.maxLength && value.toString().length > rules.maxLength) {
        errors[field] = `${rules.label || field} maksimal ${rules.maxLength} karakter`;
      }

      if (value && rules.pattern && !rules.pattern.test(value)) {
        errors[field] = rules.patternMessage || `Format ${rules.label || field} tidak valid`;
      }

      if (rules.custom && typeof rules.custom === "function") {
        const customError = rules.custom(value, data);
        if (customError) {
          errors[field] = customError;
        }
      }
    });

    return errors;
  };

  // CRUD operations
  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      setError("");
      setFormErrors({});

      // Client-side validation
      const errors = validateForm(formData);
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      let response;
      if (modals.create) {
        response = await service.create(formData);
      } else {
        const itemId = selectedItem.id || selectedItem.user_id || selectedItem.ktp_id || selectedItem.sim_id;
        response = await service.update(itemId, formData);
      }

      if (response.success) {
        closeModal(modals.create ? 'create' : 'edit');
        await loadData();
      } else {
        if (response.errors && typeof response.errors === "object") {
          setFormErrors(response.errors);
        } else {
          setError(response.errors || "Gagal menyimpan data");
        }
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setSubmitting(true);
      setError("");

      const itemId = selectedItem.id || selectedItem.user_id || selectedItem.ktp_id || selectedItem.sim_id;
      const response = await service.delete(itemId);

      if (response.success) {
        closeModal('delete');
        await loadData();
      } else {
        setError(response.errors || "Gagal menghapus data");
      }
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    const newParams = { ...searchParams, page };
    setSearchParams(newParams);
    loadData(newParams);
  };

  const handleLimitChange = (limit) => {
    const newParams = { ...searchParams, limit, page: 1 };
    setSearchParams(newParams);
    loadData(newParams);
  };

  // Search handler
  const handleSearch = (search) => {
    const newParams = { ...searchParams, search, page: 1 };
    setSearchParams(newParams);
    loadData(newParams);
  };

  // Filter handler
  const handleFilter = (filters) => {
    const newParams = { ...searchParams, ...filters, page: 1 };
    setSearchParams(newParams);
    loadData(newParams);
  };

  return {
    // State
    data,
    loading,
    error,
    pagination,
    modals,
    selectedItem,
    formData,
    formErrors,
    submitting,
    searchParams,

    // Actions
    loadData,
    openModal,
    closeModal,
    resetForm,
    setFormData,
    setFormErrors,
    setError,

    // Handlers
    handleSubmit,
    handleDelete,
    handlePageChange,
    handleLimitChange,
    handleSearch,
    handleFilter,
  };
};
