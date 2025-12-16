import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getErrorMessage } from "../utils/errorHandler";

export const useCRUD = ({
  service,
  initialFormData = {},
  validationRules = {},
  onDataTransform = (data) => data,
  onBeforeSubmit = (data) => data,
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
  const [realTimeValidation, setRealTimeValidation] = useState(false);

  // Search and filter states
  const [searchParams, setSearchParams] = useState({
    page: 1,
    limit: pageSize,
    search: "",
    sort_by: sortBy,
    sort_order: sortOrder,
  });

  const getItemId = (item) => {
    if (!item) return null;
    return (
      item.id ??
      item.user_id ??
      item.admin_id ??
      item.id_admin ??
      item.userId ??
      item.id_user ??
      item.uuid ??
      item.ktp_id ??
      item.sim_id ??
      item.satpas_id ??
      item.pendaftaran_id ??
      null
    );
  };

  // Load data function
  const loadData = async (params = searchParams) => {
    try {
      setLoading(true);
      setError("");
      setFormErrors({});

      // Validasi parameter pencarian
      if (params.search && typeof params.search === 'string' && params.search.length > 100) {
        throw new Error("Kata kunci pencarian tidak boleh lebih dari 100 karakter");
      }

      if (params.page && (isNaN(params.page) || params.page < 1)) {
        throw new Error("Nomor halaman tidak valid");
      }

      if (params.limit && (isNaN(params.limit) || params.limit < 1 || params.limit > 100)) {
        throw new Error("Jumlah data per halaman tidak valid");
      }

      // Check if service has the right method
      let response;
      let methodName = "";

      if (service.getUsers) {
        response = await service.getUsers(params);
        methodName = "getUsers";
      } else if (service.getKTPList) {
        response = await service.getKTPList(params);
        methodName = "getKTPList";
      } else if (service.getSIMList) {
        response = await service.getSIMList(params);
        methodName = "getSIMList";
      } else if (service.getList) {
        response = await service.getList(params);
        methodName = "getList";
      } else if (typeof service.get === 'function') {
        // Fallback untuk service yang menggunakan metode get
        response = await service.get(params);
        methodName = "get";
      } else {
        throw new Error("No suitable service method found");
      }

      if (response.success) {
        const transformedData = onDataTransform(response.data || []);
        setData(transformedData);
        setPagination(response.pagination || {});
      } else {
        // Handling error dari backend
        if (response.errors) {
          if (typeof response.errors === 'object' && !Array.isArray(response.errors)) {
            // Error berupa object dengan field sebagai key
            setFormErrors(response.errors);
          } else if (Array.isArray(response.errors)) {
            // Error berupa array dari object dengan path dan message
            const errorObj = {};
            response.errors.forEach(err => {
              if (err.path) {
                errorObj[err.path] = err.message;
              }
            });
            
            if (Object.keys(errorObj).length > 0) {
              setFormErrors(errorObj);
            } else {
              toast.error("Gagal memuat data: " + JSON.stringify(response.errors));
            }
          } else {
            // Error berupa string
            toast.error(response.errors);
          }
        } else {
          toast.error(`Gagal memuat data dari ${methodName}`);
        }
        setData([]);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error(`Error in loadData: ${errorMessage}`, error);
      toast.error(errorMessage);
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
    console.log(`[DEBUG] Opening modal: ${type}`, { item }); // <-- LOGGING DITAMBAHKAN
    setModals(prev => ({ ...prev, [type]: true }));
    if (item) {
      setSelectedItem(item);
      
      // Format tanggal untuk input type="date"
      const formattedItem = { ...item };
      Object.keys(formattedItem).forEach(key => {
        // Cek apakah nilai adalah tanggal valid dan perlu diformat
        if (formattedItem[key] && typeof formattedItem[key] === 'string') {
          // Hanya format field yang memang bertipe tanggal
          if (key.includes('tanggal') || key.includes('date') || key.includes('expired')) {
            const dateValue = new Date(formattedItem[key]);
            // Validasi tanggal
            if (!isNaN(dateValue.getTime())) {
              // Format tanggal ke YYYY-MM-DD untuk input type="date"
              const year = dateValue.getFullYear();
              const month = String(dateValue.getMonth() + 1).padStart(2, '0');
              const day = String(dateValue.getDate()).padStart(2, '0');
              formattedItem[key] = `${year}-${month}-${day}`;
            }
          }
        }
      });

      const unifiedId = getItemId(formattedItem);
      if (unifiedId && !formattedItem.id) {
        formattedItem.id = unifiedId;
      }

      setFormData({ ...initialFormData, ...formattedItem });
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
    // Gunakan objek kosong untuk form tambah data baru
    setFormData({});
    setFormErrors({});
    setError("");
    setRealTimeValidation(false);
  };

  // Validasi field tunggal untuk real-time validation
  const validateField = (field, value, data, isCreate = false) => {
    const rules = validationRules[field];
    if (!rules) return null;

    // Cek apakah required adalah fungsi atau boolean
    const isRequired = typeof rules.required === 'function' 
      ? rules.required(value, isCreate) 
      : rules.required;

    if (isRequired && (!value || value.toString().trim() === "")) {
      return `${rules.label || field} wajib diisi`;
    }

    // Cek apakah minLength adalah fungsi atau number
    const minLengthValue = typeof rules.minLength === 'function'
      ? rules.minLength(value)
      : rules.minLength;

    if (value && minLengthValue && value.toString().length < minLengthValue) {
      return `${rules.label || field} minimal ${minLengthValue} karakter`;
    }

    if (value && rules.maxLength && value.toString().length > rules.maxLength) {
      return `${rules.label || field} maksimal ${rules.maxLength} karakter`;
    }

    if (value && rules.pattern && !rules.pattern.test(value)) {
      return rules.patternMessage || `Format ${rules.label || field} tidak valid`;
    }

    if (rules.custom && typeof rules.custom === "function") {
      const customError = rules.custom(value, data, isCreate);
      if (customError) {
        return customError;
      }
    }

    return null;
  };

  const validateForm = (data, isCreate = false) => {
    const errors = {};

    Object.keys(validationRules).forEach((field) => {
      const error = validateField(field, data[field], data, isCreate);
      if (error) {
        errors[field] = error;
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

      // Client-side validation - pass isCreate flag
      const isCreate = modals.create;
      const errors = validateForm(formData, isCreate);
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      // Persiapkan data untuk dikirim ke server
      // Jika ada file, gunakan FormData
      // Beri kesempatan parent untuk memproses/menormalisasi data sebelum submit (mis. ubah File -> path)
      const processedForm = typeof onBeforeSubmit === 'function' ? onBeforeSubmit(formData, { isCreate: modals.create, selectedItem }) : formData;

      let dataToSend;
      if (processedForm instanceof FormData) {
        dataToSend = processedForm;
      } else {
        const hasFileInput = Object.values(processedForm).some(
          value => value instanceof File || 
                  (typeof value === 'object' && value !== null && 
                   (value.type?.includes('image/') || value.name?.match(/\.(jpg|jpeg|png|gif|svg)$/i)))
        );

        if (hasFileInput) {
          dataToSend = new FormData();
          Object.keys(processedForm).forEach(key => {
            const value = processedForm[key];
            if (value === "" || value === null || value === undefined) {
              return;
            }
            if (value instanceof File) {
              dataToSend.append(key, value);
            } else if (typeof value === 'object' && value !== null && !Array.isArray(value) && 
                      (value.type?.includes('image/') || value.name?.match(/\.(jpg|jpeg|png|gif|svg)$/i))) {
              if (value.file instanceof File) {
                dataToSend.append(key, value.file);
              } else {
                dataToSend.append(key, JSON.stringify(value));
              }
            } else if (typeof value === 'object' && value !== null) {
              dataToSend.append(key, JSON.stringify(value));
            } else {
              dataToSend.append(key, value);
            }
          });
        } else {
          dataToSend = {};
          Object.keys(processedForm).forEach(key => {
            if (processedForm[key] !== "" && processedForm[key] !== null && processedForm[key] !== undefined) {
              dataToSend[key] = processedForm[key];
            }
          });
        }
      }

      let response;
      if (modals.create) {
        response = await service.create(dataToSend);
      } else {
        const itemId = getItemId(selectedItem);
        if (!itemId) {
          toast.error("ID data tidak ditemukan");
          return;
        }
        response = await service.update(itemId, dataToSend);
      }

      if (response.success) {
        closeModal(modals.create ? 'create' : 'edit');
        const successMsg = response.message || (modals.create ? 'Berhasil menambahkan data' : 'Berhasil memperbarui data');
        toast.success(successMsg);
        await loadData();
      } else {
        // Handling error dari backend
        if (response.errors) {
          if (typeof response.errors === 'object' && !Array.isArray(response.errors)) {
            // Error berupa object dengan field sebagai key
            setFormErrors(response.errors);
          } else if (Array.isArray(response.errors)) {
            // Error berupa array dari object dengan path dan message
            const errorObj = {};
            response.errors.forEach(err => {
              if (err.path) {
                errorObj[err.path] = err.message;
              }
            });
            
            if (Object.keys(errorObj).length > 0) {
              setFormErrors(errorObj);
            } else {
              toast.error("Gagal menyimpan data: " + JSON.stringify(response.errors));
            }
          } else {
            // Error berupa string
            toast.error(response.errors);
          }
        } else {
          toast.error("Gagal menyimpan data");
        }
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error(`Error in handleSubmit: ${errorMessage}`, error);
      
      // Coba ekstrak error dari response jika ada
      if (error.response && error.response.data) {
        const responseData = error.response.data;
        
        if (responseData.errors) {
          if (typeof responseData.errors === 'object' && !Array.isArray(responseData.errors)) {
            setFormErrors(responseData.errors);
          } else if (Array.isArray(responseData.errors)) {
            const errorObj = {};
            responseData.errors.forEach(err => {
              if (err.path) {
                errorObj[err.path] = err.message;
              }
            });
            
            if (Object.keys(errorObj).length > 0) {
              setFormErrors(errorObj);
            } else {
              toast.error(errorMessage);
            }
          } else {
            toast.error(responseData.errors || errorMessage);
          }
        } else {
          toast.error(errorMessage);
        }
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setSubmitting(true);
      setError("");

      const itemId = getItemId(selectedItem);
      if (!itemId) {
        toast.error("ID data tidak ditemukan");
        return;
      }
      const response = await service.delete(itemId);

      if (response.success) {
        closeModal('delete');
        toast.success(response.message || 'Berhasil menghapus data');
        await loadData();
      } else {
        toast.error(response.errors || "Gagal menghapus data");
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
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
    // Validasi input pencarian
    if (search && typeof search === 'string' && search.length > 100) {
      toast.error("Kata kunci pencarian tidak boleh lebih dari 100 karakter");
      return;
    }
    
    const newParams = { ...searchParams, search, page: 1 };
    setSearchParams(newParams);
    
    try {
      loadData(newParams);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  // Filter handler
  const handleFilter = (filters) => {
    // Validasi filter
    if (filters && typeof filters === 'object') {
      // Validasi sort_by dan sort_order jika ada
      if (filters.sort_by && !['created_at', 'updated_at', 'full_name', 'email', 'nik', 'nomor_sim'].includes(filters.sort_by)) {
        toast.error("Field sorting tidak valid");
        return;
      }
      
      if (filters.sort_order && !['asc', 'desc'].includes(filters.sort_order)) {
        toast.error("Urutan sorting tidak valid");
        return;
      }
      
      // Validasi page dan limit
      if (filters.page && (isNaN(filters.page) || filters.page < 1)) {
        toast.error("Nomor halaman tidak valid");
        return;
      }
      
      if (filters.limit && (isNaN(filters.limit) || filters.limit < 1 || filters.limit > 100)) {
        toast.error("Jumlah data per halaman tidak valid");
        return;
      }
    }
    
    const newParams = { ...searchParams, ...filters, page: 1 };
    setSearchParams(newParams);
    
    try {
      loadData(newParams);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  // Handle form field change with real-time validation
  const handleFormChange = (field, value) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    // Jika real-time validation aktif, validasi field yang diubah
    if (realTimeValidation) {
      const isCreate = modals.create;
      const fieldError = validateField(field, value, newFormData, isCreate);
      
      setFormErrors(prev => {
        const newErrors = { ...prev };
        if (fieldError) {
          newErrors[field] = fieldError;
        } else {
          delete newErrors[field];
        }
        return newErrors;
      });
    }
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
    realTimeValidation,

    // Actions
    loadData,
    openModal,
    closeModal,
    resetForm,
    setFormData,
    setFormErrors,
    setError,
    setRealTimeValidation,

    // Handlers
    handleSubmit,
    handleDelete,
    handlePageChange,
    handleLimitChange,
    handleSearch,
    handleFilter,
    handleFormChange,
    validateField,
  };
};
