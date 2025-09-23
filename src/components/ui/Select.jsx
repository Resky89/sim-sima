import { forwardRef } from "react";
import "../../styles/error.css";

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
    const errorClasses = error ? "error-border" : "";

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
            <option 
              key={option.value} 
              value={typeof option.value === "boolean" ? String(option.value) : option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="error-text">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
