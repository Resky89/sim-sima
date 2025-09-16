import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: "🏠",
    color: "from-blue-500 to-blue-600",
    description: "Ringkasan sistem",
  },
  {
    name: "Profil",
    href: "/profile",
    icon: "👤",
    color: "from-indigo-500 to-purple-600",
    description: "Profil pengguna",
  },
  {
    name: "Pengguna",
    href: "/users",
    icon: "👥",
    color: "from-emerald-500 to-teal-600",
    description: "Kelola pengguna",
  },
  {
    name: "Data KTP",
    href: "/ktp",
    icon: "🆔",
    color: "from-purple-500 to-indigo-600",
    description: "Kelola KTP",
  },
  {
    name: "Data SIM",
    href: "/sim",
    icon: "🚗",
    color: "from-orange-500 to-red-600",
    description: "Kelola SIM",
  },
];

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-white/95 backdrop-blur-xl shadow-2xl transform transition-all duration-300 ease-in-out border-r-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:fixed lg:inset-y-0 lg:left-0 lg:h-screen lg:flex-shrink-0 flex flex-col
      `}
      >
        {/* Header */}
        <div className="flex h-20 items-center justify-between px-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-xl text-white font-bold">S</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SIMA
              </h1>
              <p className="text-xs text-gray-500 font-medium">
                Sistem Informasi Manusia
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-white/50 transition-all duration-200 transform hover:scale-110"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Divider */}
        <div className="h-2 bg-gradient-to-r from-gray-50/50 to-blue-50/30"></div>

        {/* Navigation */}
        <nav className="mt-4 px-4 space-y-3 flex-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  group flex items-center px-5 py-3.5 text-sm font-medium rounded-2xl transition-all duration-300 transform hover:scale-[1.02]
                  ${
                    isActive
                      ? `bg-gradient-to-r ${item.color} text-white shadow-lg shadow-${item.color.split('-')[1]}/25 scale-[1.02]`
                      : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/30 hover:text-gray-900"
                  }
                `}
                onClick={onClose}
              >
                <div
                  className={`
                  flex items-center justify-center w-10 h-10 rounded-xl mr-4 transition-all duration-300
                  ${
                    isActive
                      ? "bg-white/20 backdrop-blur-sm shadow-inner"
                      : "bg-gray-100 group-hover:bg-white group-hover:shadow-md"
                  }
                `}
                >
                  <span className={`text-xl ${isActive ? "text-white" : ""}`}>
                    {item.icon}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{item.name}</div>
                  <div
                    className={`text-xs truncate ${
                      isActive ? "text-white/80" : "text-gray-500"
                    }`}
                  >
                    {item.description}
                  </div>
                </div>
                {isActive && (
                  <div className="flex items-center space-x-1 ml-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <div className="w-1 h-1 bg-white/60 rounded-full animate-pulse delay-100"></div>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-5 border-t border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-red-50/30">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-5 py-4 text-sm font-semibold text-red-600 rounded-2xl hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 transition-all duration-300 group transform hover:scale-[1.02]"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-100 mr-4 group-hover:bg-red-200 transition-all duration-300 group-hover:shadow-md">
              <span className="text-xl">🚪</span>
            </div>
            <div className="flex-1 text-left">
              <div className="font-semibold">Keluar</div>
              <div className="text-xs text-red-500">Logout dari sistem</div>
            </div>
            <svg
              className="w-5 h-5 text-red-400 group-hover:text-red-600 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
