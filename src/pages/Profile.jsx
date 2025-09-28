import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, setCredentials } from '../redux/authSlice';
import { authService } from "../services/authService";
import { userService } from "../services/userService";
import { getErrorMessage } from "../utils/errorHandler";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";

const Profile = () => {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [editForm, setEditForm] = useState({
    full_name: "",
    email: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  useEffect(() => {
    if (user) {
      setEditForm({
        full_name: user.full_name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const refreshProfile = async () => {
    try {
      setLoading(true);
      setError("");
      // authService.getProfile() akan secara otomatis memperbarui Redux store
      await authService.getProfile(); 
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!user?.user_id) return;

    try {
      setUpdating(true);
      setError("");

      const response = await userService.update(user.user_id, editForm);

      if (response.success) {
        // authService.getProfile() akan memperbarui store dengan data terbaru
        await authService.getProfile();
        setSuccess("Profil berhasil diperbarui");
        setShowEditModal(false);
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!user?.user_id) return;

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setError("Konfirmasi password tidak cocok");
      return;
    }

    if (passwordForm.new_password.length < 8) {
      setError("Password baru minimal 8 karakter");
      return;
    }

    try {
      setUpdating(true);
      setError("");

      const response = await userService.update(user.user_id, {
        password: passwordForm.new_password,
      });

      if (response.success) {
        setSuccess("Password berhasil diubah");
        setShowPasswordModal(false);
        setPasswordForm({
          current_password: "",
          new_password: "",
          confirm_password: "",
        });
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profil Saya</h1>
            <p className="text-gray-600 mt-1">Kelola informasi profil Anda</p>
          </div>
          <Button
            onClick={refreshProfile}
            variant="outline"
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <span>🔄</span>
            <span>Refresh</span>
          </Button>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <span className="text-red-500 mr-2">⚠️</span>
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex">
              <span className="text-green-500 mr-2">✅</span>
              <span className="text-green-700 text-sm">{success}</span>
            </div>
          </div>
        )}
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user?.full_name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {user?.full_name || "Nama tidak tersedia"}
            </h2>
            <p className="text-gray-600">
              {user?.email || "Email tidak tersedia"}
            </p>
            <div className="flex items-center mt-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user?.is_active
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {user?.is_active ? "🟢 Aktif" : "🔴 Tidak Aktif"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Lengkap
            </label>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900">
              {user?.full_name || "-"}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900">
              {user?.email || "-"}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User ID
            </label>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 font-mono text-sm">
              {user?.user_id || "-"}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user?.is_active
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {user?.is_active ? "Aktif" : "Tidak Aktif"}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal Dibuat
            </label>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900">
              {formatDate(user?.created_at)}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Terakhir Diperbarui
            </label>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900">
              {formatDate(user?.updated_at)}
            </div>
          </div>
        </div>

        <div className="flex space-x-4 mt-8">
          <Button
            onClick={() => setShowEditModal(true)}
            className="flex items-center space-x-2"
          >
            <span>✏️</span>
            <span>Edit Profil</span>
          </Button>
          <Button
            onClick={() => setShowPasswordModal(true)}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <span>🔒</span>
            <span>Ubah Password</span>
          </Button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Profil"
        size="md"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input
            label="Nama Lengkap"
            type="text"
            value={editForm.full_name}
            onChange={(e) =>
              setEditForm({ ...editForm, full_name: e.target.value })
            }
            required
            maxLength={255}
          />

          <Input
            label="Email"
            type="email"
            value={editForm.email}
            onChange={(e) =>
              setEditForm({ ...editForm, email: e.target.value })
            }
            required
            maxLength={255}
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowEditModal(false)}
              disabled={updating}
            >
              Batal
            </Button>
            <Button type="submit" loading={updating}>
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Ubah Password"
        size="md"
      >
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <Input
            label="Password Baru"
            type="password"
            value={passwordForm.new_password}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, new_password: e.target.value })
            }
            required
            minLength={8}
            maxLength={255}
          />

          <Input
            label="Konfirmasi Password Baru"
            type="password"
            value={passwordForm.confirm_password}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                confirm_password: e.target.value,
              })
            }
            required
            minLength={8}
            maxLength={255}
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowPasswordModal(false);
                setPasswordForm({
                  current_password: "",
                  new_password: "",
                  confirm_password: "",
                });
              }}
              disabled={updating}
            >
              Batal
            </Button>
            <Button type="submit" loading={updating}>
              Ubah Password
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Profile;
