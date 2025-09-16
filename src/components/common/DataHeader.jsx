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
    <div className="bg-gradient-to-r from-white via-blue-50/30 to-purple-50/30 rounded-2xl shadow-sm border border-gray-200/50 p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white text-xl">{icon}</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="text-gray-600 mt-1">{description}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
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
            <Button
              onClick={onCreateClick}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
            >
              <span className="text-lg">➕</span>
              <span>{createButtonText}</span>
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg animate-fade-in">
          <div className="flex items-center">
            <span className="text-red-500 mr-3 text-lg">⚠️</span>
            <span className="text-red-700 text-sm font-medium">{error}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataHeader;
