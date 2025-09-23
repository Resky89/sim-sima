import CRUDManager from "../components/common/CRUDManager";
import { userService } from "../services/userService";

const Users = () => {
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
    {
      key: "is_active",
      title: "Status",
      render: (value) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            value === 1 || value === true
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {value === 1 || value === true ? "Aktif" : "Tidak Aktif"}
        </span>
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
      required: false, // Password tidak wajib saat update
      placeholder: "Masukkan password",
      icon: "🔒",
    },
    {
      name: "is_active",
      label: "Status",
      type: "select",
      required: false,
      options: [
        { value: true, label: "Aktif" },
        { value: false, label: "Tidak Aktif" },
      ],
      icon: "⚡",
    },
  ];

  const initialFormData = {
    email: "",
    full_name: "",
    password: "",
    is_active: true,
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

  const filterOptions = [
    {
      key: "is_active",
      label: "Status",
      placeholder: "Filter Status",
      options: [
        { value: true, label: "Aktif" },
        { value: false, label: "Tidak Aktif" },
      ],
    },
  ];

  return (
    <CRUDManager
      title="Pengguna"
      description="Kelola data pengguna sistem"
      service={userService}
      columns={columns}
      formFields={formFields}
      initialFormData={initialFormData}
      validationRules={validationRules}
      searchPlaceholder="Cari nama atau email pengguna..."
      filterOptions={filterOptions}
      icon="👥"
    />
  );
};

export default Users;
