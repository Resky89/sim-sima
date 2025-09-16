import { forwardRef } from "react";
import "../../styles/error.css";

const Input = forwardRef(
  (
    {
      label,
      error,
      type = "text",
      className = "",
      required = false,
      rows,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";
    const errorClasses = error ? "error-border" : "";

    const Element = type === "textarea" ? "textarea" : "input";
    const elementProps =
      type === "textarea" ? { rows, ...props } : { type, ...props };

    return (
      <div className="mb-4">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <Element
          ref={ref}
          className={`${baseClasses} ${errorClasses} ${className} ${
            type === "textarea" ? "resize-vertical" : ""
          }`}
          {...elementProps}
        />
        {error && <p className="error-text">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
