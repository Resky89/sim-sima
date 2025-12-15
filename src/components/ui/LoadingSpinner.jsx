const LoadingSpinner = ({ size = "md", variant = "default", className = "" }) => {
  const sizeClasses = {
    xs: "h-4 w-4",
    sm: "h-5 w-5",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  const variants = {
    default: "border-gray-200 border-t-blue-500",
    primary: "border-blue-200 border-t-blue-600",
    purple: "border-purple-200 border-t-purple-600",
    success: "border-emerald-200 border-t-emerald-600",
    danger: "border-red-200 border-t-red-600",
    white: "border-white/30 border-t-white",
  };

  const borderWidth = {
    xs: "border-2",
    sm: "border-2",
    md: "border-3",
    lg: "border-4",
    xl: "border-4",
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div
        className={`animate-spin rounded-full ${sizeClasses[size]} ${borderWidth[size]} ${variants[variant]}`}
        style={{ borderTopWidth: borderWidth[size].replace('border-', '').replace('px', '') }}
      >
      </div>
    </div>
  );
};

export const LoadingOverlay = ({ message = "Memuat...", variant = "default" }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-2xl shadow-2xl border border-gray-100">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
          <LoadingSpinner size="lg" variant={variant} />
        </div>
        <p className="text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
};

export const LoadingDots = ({ className = "" }) => {
  return (
    <div className={`loading-dots ${className}`}>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
};

export const LoadingSkeleton = ({ width = "100%", height = "20px", rounded = "md", className = "" }) => {
  const roundedClasses = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  };

  return (
    <div 
      className={`skeleton ${roundedClasses[rounded]} ${className}`}
      style={{ width, height }}
    ></div>
  );
};

export default LoadingSpinner;
