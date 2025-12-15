import Button from "../ui/Button";

const DataHeader = ({
  title,
  description,
  onCreateClick,
  error,
  icon = "📊",
  createButtonText = "Tambah Baru",
  actions = [],
}) => {
  return (
    <div className="relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
      {/* Background Gradient Decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100/50 to-purple-100/50 rounded-full -translate-y-32 translate-x-32 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-cyan-100/30 to-blue-100/30 rounded-full translate-y-24 -translate-x-24 blur-3xl"></div>
      
      {/* Content */}
      <div className="relative p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Title Section */}
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
              <div className="relative h-14 w-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                <span className="text-2xl filter drop-shadow-sm">{icon}</span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {title}
              </h1>
              <p className="text-gray-500 mt-0.5 text-sm">{description}</p>
            </div>
          </div>

          {/* Actions Section */}
          <div className="flex items-center gap-3">
            {actions.map((action, index) => (
              <Button
                key={index}
                onClick={action.onClick}
                variant={action.variant || "secondary"}
                className={action.className || ""}
              >
                {action.icon && <span className="mr-2">{action.icon}</span>}
                {action.text}
              </Button>
            ))}

            {onCreateClick && (
              <button
                onClick={onCreateClick}
                className="relative group inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
              >
                {/* Shine Effect */}
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"></span>
                
                <span className="relative flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>{createButtonText}</span>
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 animate-fade-in">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-lg">⚠️</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-red-800">Terjadi Kesalahan</p>
                <p className="text-sm text-red-600 mt-0.5">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataHeader;
