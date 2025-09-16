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
            value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {value ? "Aktif" : "Tidak Aktif"}
        </span>
      ),
    },
    {
      key: "created_at",
      title: "Dibuat",
      render: (value) => (
        <div className="text-sm text-gray-500">
          {value ? new Date(value).toLocaleDateString("id-ID") : "-"}
        </div>
      ),
    },
  ];

  const formFields = [
    {
      name: "full_name",
      label: "Nama Lengkap",
      type: "text",
      required: true,
      placeholder: "Masukkan nama lengkap",
      icon: "👤",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      required: true,
      placeholder: "user@example.com",
      icon: "📧",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      required: true,
      placeholder: "Masukkan password",
      icon: "🔒",
    },
    {
      name: "is_active",
      label: "Status",
      type: "select",
      required: true,
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
      required: true,
      label: "Nama Lengkap",
      minLength: 2,
      maxLength: 255,
    },
    email: {
      required: true,
      label: "Email",
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      patternMessage: "Format email tidak valid",
      maxLength: 255,
    },
    password: {
      required: true,
      label: "Password",
      minLength: 6,
      maxLength: 255,
    },
  };

  const filterOptions = [
    {
      key: "is_active",
      label: "Status",
      placeholder: "Filter Status",
      options: [
        { value: "true", label: "Aktif" },
        { value: "false", label: "Tidak Aktif" },
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
