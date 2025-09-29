import { useCRUD } from "../../hooks/useCRUD";
import DataTable from "../ui/DataTable";
import DataHeader from "./DataHeader";
import ActionColumn from "./ActionColumn";
import Modal, { ConfirmModal } from "../ui/Modal";
import FormBuilder from "./FormBuilder";

const CRUDManager = ({
  title,
  description,
  service,
  columns,
  formFields,
  searchPlaceholder = "Cari...",
  filterOptions = [],
  initialFormData = {},
  validationRules = {},
  onDataTransform = (data) => data,
  customActions = [],
  pageSize = 10,
  sortBy = "created_at",
  sortOrder = "desc",
  icon = "📊",
  headerActions = [],
  onFormChange,
  renderView,
}) => {
  const {
    data,
    loading,
    error,
    pagination,
    modals,
    selectedItem,
    formData,
    formErrors,
    submitting,
    realTimeValidation,
    openModal,
    closeModal,
    setRealTimeValidation,
    handleSubmit,
    handleDelete,
    handlePageChange,
    handleLimitChange,
    handleSearch,
    handleFilter,
    handleFormChange,
    validateField,
    setFormData,
  } = useCRUD({
    service,
    initialFormData,
    validationRules,
    onDataTransform,
    pageSize,
    sortBy,
    sortOrder,
  });

  // Enhanced columns with actions
  const enhancedColumns = [
    ...columns,
    {
      key: "actions",
      title: "Aksi",
      render: (_, item) => (
        <ActionColumn
          item={item}
          onView={() => openModal("view", item)}
          onEdit={() => openModal("edit", item)}
          onDelete={() => openModal("delete", item)}
          customActions={customActions}
        />
      ),
    },
  ];

  // Render field value for view modal
  const renderFieldValue = (field, value) => {
    if (!value && value !== 0) return "-";

    switch (field.type) {
      case "select":
        if (field.options) {
          const option = field.options.find((opt) => opt.value === value);
          return option?.label || value;
        }
        return value;

      case "date":
        return new Date(value).toLocaleDateString("id-ID", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });

      case "textarea":
        return (
          <div className="whitespace-pre-wrap max-h-32 overflow-y-auto">
            {value}
          </div>
        );

      case "email":
        return (
          <a
            href={`mailto:${value}`}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            {value}
          </a>
        );

      case "checkbox":
        return (
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {value ? "Ya" : "Tidak"}
          </span>
        );

      default:
        return value;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <DataHeader
        title={title}
        description={description}
        onCreateClick={() => openModal("create")}
        error={error}
        icon={icon}
        actions={headerActions}
      />

      {/* Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden backdrop-blur-sm">
        <DataTable
          data={data}
          columns={enhancedColumns}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          onSearch={handleSearch}
          onFilter={handleFilter}
          searchPlaceholder={searchPlaceholder}
          filterOptions={filterOptions}
          className="border-0 shadow-none"
        />
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={modals.create}
        onClose={() => closeModal("create")}
        title={`Tambah ${title} Baru`}
        size="lg"
      >
        <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl p-6">
          <FormBuilder
            fields={formFields}
            data={formData}
            errors={formErrors}
            onChange={(field, value) => {
              handleFormChange(field, value);
              // Callback kustom dari parent untuk menangani perubahan form (misal autofill berdasarkan NIK)
              if (typeof onFormChange === "function") {
                try {
                  onFormChange({ field, value, formData, setFormData, modals });
                } catch (e) {
                  // swallow errors to avoid breaking form interactions
                  console.error("onFormChange error:", e);
                }
              }
            }}
            onSubmit={(data) => {
              setRealTimeValidation(true);
              handleSubmit(data);
            }}
            loading={submitting}
            submitText="Simpan"
            onCancel={() => {
              setRealTimeValidation(false);
              closeModal("create");
            }}
            validateField={validateField}
            enableRealTimeValidation={realTimeValidation}
          />
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={modals.edit}
        onClose={() => closeModal("edit")}
        title={`Edit ${title}`}
        size="lg"
      >
        <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl p-6">
          <FormBuilder
            fields={formFields}
            data={formData}
            errors={formErrors}
            onChange={(field, value) => {
              handleFormChange(field, value);
              // Callback kustom dari parent untuk menangani perubahan form (misal autofill berdasarkan NIK)
              if (typeof onFormChange === "function") {
                try {
                  onFormChange({ field, value, formData, setFormData, modals });
                } catch (e) {
                  // swallow errors to avoid breaking form interactions
                  console.error("onFormChange error:", e);
                }
              }
            }}
            onSubmit={(data) => {
              setRealTimeValidation(true);
              handleSubmit(data);
            }}
            loading={submitting}
            submitText="Simpan Perubahan"
            onCancel={() => {
              setRealTimeValidation(false);
              closeModal("edit");
            }}
            validateField={validateField}
            enableRealTimeValidation={realTimeValidation}
          />
        </div>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={modals.view}
        onClose={() => closeModal("view")}
        title={`Detail ${title}`}
        size="lg"
      >
        <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl p-6">
          {selectedItem && (
            renderView ? (
              <div className="">
                {renderView(selectedItem)}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {formFields.map((field) => (
                    <div
                      key={field.name}
                      className={`flex flex-col space-y-2 ${
                        field.type === "textarea" || field.fullWidth
                          ? "md:col-span-2"
                          : ""
                      }`}
                    >
                      <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center">
                        {field.icon && <span className="mr-2">{field.icon}</span>}
                        {field.label}
                      </label>
                      <div className="text-gray-900 bg-white px-4 py-3 rounded-lg border border-gray-200 shadow-sm min-h-[44px] flex items-start">
                        {renderFieldValue(field, selectedItem[field.name])}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={modals.delete}
        onClose={() => closeModal("delete")}
        onConfirm={handleDelete}
        title={`Hapus ${title}`}
        message={`Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus"
        cancelText="Batal"
        loading={submitting}
      />
    </div>
  );
};

export default CRUDManager;
