import { useState, useEffect } from "react";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";

const FormBuilder = ({
  fields = [],
  data = {},
  errors = {},
  onChange,
  onSubmit,
  loading = false,
  submitText = "Simpan",
  onCancel,
  className = "",
}) => {
  const [formData, setFormData] = useState(data);
  const [fieldErrors, setFieldErrors] = useState(errors);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  useEffect(() => {
    setFieldErrors(errors);
  }, [errors]);

  const handleFieldChange = (fieldName, value) => {
    const newData = { ...formData, [fieldName]: value };
    setFormData(newData);
    onChange?.(newData);

    // Clear field error when user starts typing
    if (fieldErrors[fieldName]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit?.(formData);
  };

  const renderField = (field) => {
    const {
      name,
      label,
      type = "text",
      required = false,
      placeholder,
      options = [],
      disabled = false,
      className: fieldClassName = "",
      ...fieldProps
    } = field;

    const fieldValue = formData[name] || "";
    const fieldError = fieldErrors[name];

    const commonProps = {
      label,
      value: fieldValue,
      error: fieldError,
      required,
      disabled: disabled || loading,
      className: fieldClassName,
      ...fieldProps,
    };

    switch (type) {
      case "select":
        return (
          <Select
            key={name}
            {...commonProps}
            options={options}
            placeholder={placeholder || `Pilih ${label}`}
            onChange={(e) => handleFieldChange(name, e.target.value)}
          />
        );

      case "textarea":
        return (
          <Input
            key={name}
            {...commonProps}
            type="textarea"
            placeholder={placeholder || `Masukkan ${label}`}
            onChange={(e) => handleFieldChange(name, e.target.value)}
          />
        );

      case "date":
        return (
          <Input
            key={name}
            {...commonProps}
            type="date"
            onChange={(e) => handleFieldChange(name, e.target.value)}
          />
        );

      case "email":
        return (
          <Input
            key={name}
            {...commonProps}
            type="email"
            placeholder={placeholder || `Masukkan ${label}`}
            onChange={(e) => handleFieldChange(name, e.target.value)}
          />
        );

      case "password":
        return (
          <Input
            key={name}
            {...commonProps}
            type="password"
            placeholder={placeholder || `Masukkan ${label}`}
            onChange={(e) => handleFieldChange(name, e.target.value)}
          />
        );

      case "number":
        return (
          <Input
            key={name}
            {...commonProps}
            type="number"
            placeholder={placeholder || `Masukkan ${label}`}
            onChange={(e) => handleFieldChange(name, e.target.value)}
          />
        );

      case "checkbox":
        return (
          <div key={name} className="mb-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id={name}
                checked={fieldValue === true || fieldValue === "true"}
                onChange={(e) => handleFieldChange(name, e.target.checked)}
                disabled={disabled || loading}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor={name}
                className="ml-2 block text-sm text-gray-700"
              >
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </label>
            </div>
            {fieldError && (
              <p className="mt-1 text-sm text-red-600">{fieldError}</p>
            )}
          </div>
        );

      case "radio":
        return (
          <div key={name} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {options.map((option) => (
                <div key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    id={`${name}-${option.value}`}
                    name={name}
                    value={option.value}
                    checked={fieldValue === option.value}
                    onChange={(e) => handleFieldChange(name, e.target.value)}
                    disabled={disabled || loading}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label
                    htmlFor={`${name}-${option.value}`}
                    className="ml-2 block text-sm text-gray-700"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
            {fieldError && (
              <p className="mt-1 text-sm text-red-600">{fieldError}</p>
            )}
          </div>
        );

      case "file":
        return (
          <div key={name} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor={name}
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id={name}
                      type="file"
                      className="sr-only"
                      onChange={(e) =>
                        handleFieldChange(name, e.target.files[0])
                      }
                      disabled={disabled || loading}
                      {...fieldProps}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
            {fieldError && (
              <p className="mt-1 text-sm text-red-600">{fieldError}</p>
            )}
          </div>
        );

      default:
        return (
          <Input
            key={name}
            {...commonProps}
            type={type}
            placeholder={placeholder || `Masukkan ${label}`}
            onChange={(e) => handleFieldChange(name, e.target.value)}
          />
        );
    }
  };

  const getFieldLayout = (field) => {
    if (field.fullWidth) return "col-span-full";
    if (field.halfWidth) return "col-span-1 md:col-span-1";
    return "col-span-1 md:col-span-1";
  };

  const groupFields = () => {
    const groups = {};

    fields.forEach((field) => {
      const group = field.group || "default";
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(field);
    });

    return groups;
  };

  const fieldGroups = groupFields();

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {Object.entries(fieldGroups).map(([groupName, groupFields]) => (
        <div key={groupName} className="space-y-4">
          {groupName !== "default" && (
            <div className="border-b border-gray-200 pb-2">
              <h3 className="text-lg font-medium text-gray-900">{groupName}</h3>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groupFields.map((field) => (
              <div key={field.name} className={getFieldLayout(field)}>
                {renderField(field)}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="transition-all duration-200 hover:shadow-md"
          >
            Batal
          </Button>
        )}
        <Button
          type="submit"
          loading={loading}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          {loading ? "Menyimpan..." : submitText}
        </Button>
      </div>
    </form>
  );
};

export default FormBuilder;
