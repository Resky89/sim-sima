import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    users: 0,
    ktp: 0,
    sim: 0,
    loading: false,
  });

  useEffect(() => {
    // Simulate loading stats - bisa diganti dengan API calls nanti
    setStats({
      users: 25,
      ktp: 150,
      sim: 89,
      loading: false,
    });
  }, []);

  const getCurrentTime = () => {
    const now = new Date();
    const hour = now.getHours();
    if (hour < 12) return "Pagi";
    if (hour < 15) return "Siang";
    if (hour < 18) return "Sore";
    return "Malam";
  };

  const StatCard = ({ title, value, icon, gradient, link }) => (
    <Link
      to={link}
      className="block bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:scale-105"
    >
      <div className="flex items-center">
        <div className={`p-3 rounded-lg bg-gradient-to-r ${gradient} mr-4`}>
          <span className="text-2xl text-white">{icon}</span>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {stats.loading ? "..." : value.toLocaleString()}
          </p>
        </div>
      </div>
    </Link>
  );

  const QuickAction = ({ title, description, icon, link, color }) => (
    <Link
      to={link}
      className={`block p-6 rounded-xl border-2 border-dashed border-${color}-200 hover:border-${color}-400 hover:bg-${color}-50 transition-all duration-200`}
    >
      <div className="text-center">
        <div className={`text-3xl mb-3 text-${color}-500`}>{icon}</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </Link>
  );

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Selamat {getCurrentTime()}, {user?.full_name || "User"}! 👋
            </h1>
            <p className="text-blue-100">
              Selamat datang kembali di Sistem Informasi Manajemen SIMA
            </p>
          </div>
          <div className="hidden md:block">
            <div className="text-right">
              <p className="text-blue-100 text-sm">
                {new Date().toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-blue-100 text-sm">
                {new Date().toLocaleTimeString("id-ID")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Pengguna"
          value={stats.users}
          icon="👥"
          gradient="from-blue-500 to-blue-600"
          link="/users"
        />
        <StatCard
          title="Data KTP"
          value={stats.ktp}
          icon="🆔"
          gradient="from-purple-500 to-purple-600"
          link="/ktp"
        />
        <StatCard
          title="Data SIM"
          value={stats.sim}
          icon="🚗"
          gradient="from-orange-500 to-orange-600"
          link="/sim"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Aksi Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <QuickAction
            title="Tambah Pengguna"
            description="Daftarkan pengguna baru ke sistem"
            icon="➕"
            link="/users"
            color="blue"
          />
          <QuickAction
            title="Input Data KTP"
            description="Tambahkan data KTP baru"
            icon="📄"
            link="/ktp"
            color="purple"
          />
          <QuickAction
            title="Input Data SIM"
            description="Tambahkan data SIM baru"
            icon="🚙"
            link="/sim"
            color="orange"
          />
        </div>
      </div>

      {/* System Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Informasi Sistem
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
            <div className="text-lg mb-1">🔐</div>
            <div className="text-xs font-medium text-gray-700">
              Keamanan Tinggi
            </div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100">
            <div className="text-lg mb-1">🔍</div>
            <div className="text-xs font-medium text-gray-700">
              Pencarian Cepat
            </div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg border border-purple-100">
            <div className="text-lg mb-1">📊</div>
            <div className="text-xs font-medium text-gray-700">
              Dashboard Interaktif
            </div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg border border-orange-100">
            <div className="text-lg mb-1">⚡</div>
            <div className="text-xs font-medium text-gray-700">
              Performa Tinggi
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
