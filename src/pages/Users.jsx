import CRUDManager from "../components/common/CRUDManager";
import { userService } from "../services/userService";
import { useState } from "react";

const Users = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  
  const columns = [
    {
      key: "full_name",
      title: "Nama Lengkap",
      render: (value) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-sm">
            {value ? value.charAt(0).toUpperCase() : "?"}
          </div>
          <span className="font-medium text-gray-900">{value}</span>
        </div>
      ),
    },
    {
      key: "email",
      title: "Email",
      render: (value) => (
        <div className="flex items-center gap-2 text-gray-600">
          <span className="text-[10px]">📧</span>
          <span>{value}</span>
        </div>
      ),
    },
  ];

  const formFields = [
    {
      name: "full_name",
      label: "Nama Lengkap",
      type: "text",
      required: false,
      placeholder: "Masukkan nama lengkap",
      icon: "👤",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      required: false,
      placeholder: "user@example.com",
      icon: "📧",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      required: false,
      placeholder: "Masukkan password",
      icon: "🔒",
    },
  ];

  const initialFormData = {
    email: "",
    full_name: "",
    password: "",
  };

  const validationRules = {
    full_name: {
      required: (_, isCreate) => isCreate,
      label: "Nama Lengkap",
      minLength: 2,
      maxLength: 255,
    },
    email: {
      required: (_, isCreate) => isCreate,
      label: "Email",
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      patternMessage: "Format email tidak valid",
      maxLength: 255,
    },
    password: {
      required: (_, isCreate) => isCreate,
      label: "Password",
      minLength: (value) => (value ? 8 : 0),
      maxLength: 255,
      custom: (value, data, isCreate) => {
        if (!isCreate && (!value || value.trim() === "")) {
          return null;
        }
        if (value && value.length < 8) {
          return "Password minimal 8 karakter";
        }
        return null;
      },
    },
  };

  const filterOptions = [];

  const handleError = (error) => {
    setErrorMessage(error);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderView = (item) => (
    <div className="max-w-md mx-auto animate-scale-in">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-center relative">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative">
            <div className="w-20 h-20 mx-auto bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 shadow-lg mb-4">
              <span className="text-4xl font-bold text-white">
                {item.full_name ? item.full_name.charAt(0).toUpperCase() : "?"}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white">{item.full_name}</h3>
            <p className="text-blue-100 text-sm mt-1">{item.email}</p>
          </div>
        </div>
        
        {/* Details */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">👤</span>
            </div>
            <div>
              <p className="text-xs text-blue-600 font-medium mb-0.5">Nama Lengkap</p>
              <p className="text-gray-900 font-semibold">{item.full_name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">📧</span>
            </div>
            <div>
              <p className="text-xs text-purple-600 font-medium mb-0.5">Email</p>
              <p className="text-gray-900 font-semibold">{item.email}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">🛡️</span>
            </div>
            <div>
              <p className="text-xs text-emerald-600 font-medium mb-0.5">Role</p>
              <p className="text-gray-900 font-semibold">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Error Notification */}
      {errorMessage && (
        <div className="sticky top-4 z-50 mx-auto max-w-4xl animate-fade-in-down">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-4 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl">⚠️</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-red-800">Terjadi Kesalahan</h3>
                <p className="text-sm text-red-600 mt-1">{errorMessage}</p>
              </div>
              <button 
                className="text-red-400 hover:text-red-600 transition-colors p-1" 
                onClick={() => setErrorMessage(null)}
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      <CRUDManager
        title="Data Admin"
        description="Kelola administrator sistem"
        service={userService}
        columns={columns}
        formFields={formFields}
        initialFormData={initialFormData}
        validationRules={validationRules}
        searchPlaceholder="Cari nama atau email admin..."
        filterOptions={filterOptions}
        icon="👥"
        onError={handleError}
        renderView={renderView}
      />
    </div>
  );
};

export default Users;
