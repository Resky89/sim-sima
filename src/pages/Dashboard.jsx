import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../redux/authSlice';
import { userService } from '../services/userService';
import { simService } from '../services/simService';
import { ktpService } from '../services/ktpService';

const Dashboard = () => {
  const user = useSelector(selectCurrentUser);
  const [stats, setStats] = useState({
    users: 0,
    ktp: 0,
    sim: 0,
    loading: false,
  });

  useEffect(() => {
    const fetchStats = async () => {
      setStats((prev) => ({ ...prev, loading: true }));
      try {
        const [usersRes, ktpRes, simRes] = await Promise.all([
          userService.getUsers({ page: 1, limit: 1 }),
          ktpService.getAllKTP(),
          simService.getSIMList({ page: 1, limit: 1 }),
        ]);

        // Users & SIM: ambil dari pagination.total_items
        const usersTotal = usersRes?.pagination?.total_items ?? usersRes?.data?.pagination?.total_items ?? 0;
        const simTotal = simRes?.pagination?.total_items ?? simRes?.data?.pagination?.total_items ?? 0;

        // KTP: total berada di level root dari endpoint Get All
        const ktpTotal = typeof ktpRes?.total === 'number' ? ktpRes.total : 0;

        setStats({ users: usersTotal, ktp: ktpTotal, sim: simTotal, loading: false });
      } catch (e) {
        console.error('Failed to load dashboard stats:', e);
        setStats((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
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
              Selamat datang kembali di Sistem Informasi Manusia SIMA
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
            title="Input Data SIM"
            description="Tambahkan data SIM baru"
            icon="🚙"
            link="/sim"
            color="orange"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
