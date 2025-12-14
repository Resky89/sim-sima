import CRUDManager from "../components/common/CRUDManager";
import { userService } from "../services/userService";
import { useState } from "react";
import "../styles/error.css";

const Users = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const columns = [
    {
      key: "full_name",
      title: "Nama Lengkap",
      render: (value) => (
        <div className="font-medium text-gray-900">{value}</div>
      ),
    },
    {
      key: "email",
      title: "Email",
      render: (value) => <div className="text-gray-600">{value}</div>,
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
      required: false, // Password tidak wajib saat update
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
      required: (_, isCreate) => isCreate, // Hanya required saat create
      label: "Nama Lengkap",
      minLength: 2,
      maxLength: 255,
    },
    email: {
      required: (_, isCreate) => isCreate, // Hanya required saat create
      label: "Email",
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      patternMessage: "Format email tidak valid",
      maxLength: 255,
    },
    password: {
      required: (_, isCreate) => isCreate, // Password hanya required saat create
      label: "Password",
      minLength: (value) => (value ? 8 : 0), // Validasi minLength hanya jika ada nilai
      maxLength: 255,
      custom: (value, data, isCreate) => {
        // Jika update dan password kosong, skip validasi
        if (!isCreate && (!value || value.trim() === "")) {
          return null;
        }
        // Jika ada nilai dan kurang dari 6 karakter
        if (value && value.length < 8) {
          return "Password minimal 8 karakter";
        }
        return null;
      },
    },
  };

  const filterOptions = [];

  // Fungsi untuk menangani error dari CRUDManager
  const handleError = (error) => {
    setErrorMessage(error);
    // Scroll ke atas halaman agar notifikasi error terlihat
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-4">
      {/* Notifikasi Error yang lebih terlihat */}
      {errorMessage && (
        <div className="error-container sticky top-4 z-50 mx-auto max-w-4xl shadow-lg">
          <div className="flex items-center">
            <span className="error-icon text-xl">⚠️</span>
            <h3 className="error-title">Terjadi Kesalahan</h3>
            <button 
              className="ml-auto text-red-700 hover:text-red-900" 
              onClick={() => setErrorMessage(null)}
            >
              ✕
            </button>
          </div>
          <p className="error-message">{errorMessage}</p>
        </div>
      )}

      <CRUDManager
        title="Admin"
        description="Kelola data admin sistem"
        service={userService}
        columns={columns}
        formFields={formFields}
        initialFormData={initialFormData}
        validationRules={validationRules}
        searchPlaceholder="Cari nama atau email admin..."
        filterOptions={filterOptions}
        icon="👥"
        onError={handleError}
      />
    </div>
  );
};

export default Users;
