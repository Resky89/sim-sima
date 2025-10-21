import { useState } from "react";
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../redux/authSlice';
import { authService } from "../services/authService";
import { getErrorMessage } from "../utils/errorHandler";
import Button from "../components/ui/Button";

const Profile = () => {
  const user = useSelector(selectCurrentUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  // Fitur edit profil dan ubah password dinonaktifkan

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

        {/* Success message dihilangkan karena fitur edit/ubah password dinonaktifkan */}
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
        </div>

        {/* Tombol edit profil dan ubah password dinonaktifkan sesuai permintaan */}
      </div>

      {/* Edit Profile Modal */}

      {/* Change Password Modal */}
    </div>
  );
};

export default Profile;
