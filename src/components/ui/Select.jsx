import { forwardRef } from "react";

const Select = forwardRef(
  (
    {
      label,
      error,
      options = [],
      placeholder = "Pilih...",
      className = "",
      required = false,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";
    const errorClasses = error
      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
      : "";

    return (
      <div className="mb-4">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={`${baseClasses} ${errorClasses} ${className}`}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
