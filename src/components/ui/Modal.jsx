import { useEffect } from "react";
import { createPortal } from "react-dom";
import Button from "./Button";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
  className = "",
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-6xl",
  };

  const modalContent = (
    <div 
      className={`fixed inset-0 z-[9999] overflow-y-auto ${className}`}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal Container - Centers the modal */}
      <div className="fixed inset-0 z-[10000] overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
          {/* Modal Panel */}
          <div
            className={`relative w-full ${sizes[size]} transform transition-all duration-300 animate-scale-in`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Card */}
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Gradient Top Border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
              
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50/50">
                  {title && (
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-7 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
                      <h3 
                        id="modal-title"
                        className="text-lg font-bold text-gray-900"
                      >
                        {title}
                      </h3>
                    </div>
                  )}
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200 group"
                    >
                      <span className="sr-only">Close</span>
                      <svg
                        className="h-5 w-5 transition-transform duration-200 group-hover:scale-110"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="p-6 max-h-[calc(100vh-180px)] overflow-y-auto">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Use Portal to render modal at document.body level
  return createPortal(modalContent, document.body);
};

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Konfirmasi",
  message = "Apakah Anda yakin?",
  confirmText = "Ya, Lanjutkan",
  cancelText = "Batal",
  loading = false,
  variant = "danger",
  className = "",
}) => {
  const variants = {
    danger: {
      icon: "⚠️",
      iconBg: "bg-gradient-to-br from-red-100 to-orange-100",
      headerBg: "bg-gradient-to-r from-red-50 to-orange-50",
      border: "border-red-200",
      title: "text-red-800",
      confirmBtn: "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 shadow-red-500/25",
    },
    warning: {
      icon: "⚡",
      iconBg: "bg-gradient-to-br from-amber-100 to-yellow-100",
      headerBg: "bg-gradient-to-r from-amber-50 to-yellow-50",
      border: "border-amber-200",
      title: "text-amber-800",
      confirmBtn: "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 shadow-amber-500/25",
    },
    info: {
      icon: "ℹ️",
      iconBg: "bg-gradient-to-br from-blue-100 to-indigo-100",
      headerBg: "bg-gradient-to-r from-blue-50 to-indigo-50",
      border: "border-blue-200",
      title: "text-blue-800",
      confirmBtn: "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-blue-500/25",
    },
  };

  const v = variants[variant] || variants.danger;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      className={className}
    >
      <div className={`${v.headerBg} rounded-xl p-5 border ${v.border}`}>
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 w-12 h-12 ${v.iconBg} rounded-xl flex items-center justify-center shadow-sm`}>
            <span className="text-2xl">{v.icon}</span>
          </div>
          <div className="flex-1 pt-0.5">
            <h4 className={`text-base font-bold ${v.title} mb-1.5`}>
              Perhatian!
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onClose}
          disabled={loading}
          className="px-5 py-2.5 rounded-xl text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className={`px-5 py-2.5 rounded-xl text-white font-semibold shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${v.confirmBtn}`}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Memproses...
            </span>
          ) : (
            confirmText
          )}
        </button>
      </div>
    </Modal>
  );
};

export default Modal;
