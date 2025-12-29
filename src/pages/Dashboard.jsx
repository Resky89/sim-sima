import { useState, useEffect, useMemo, memo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../redux/authSlice';
import { userService } from '../services/userService';
import { simService } from '../services/simService';
import { ktpService } from '../services/ktpService';

// Komponen StatCard di luar Dashboard agar tidak re-create setiap render
const StatCard = memo(({ title, value, icon, gradient, link, delay, loading }) => (
  <Link
    to={link}
    className="group relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 animate-fade-in-up"
    style={{ animationDelay: `${delay}ms` }}
  >
    {/* Background Gradient Orb */}
    <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${gradient} rounded-full opacity-10 group-hover:opacity-20 group-hover:scale-125 transition-all duration-500`}></div>
    
    <div className="relative flex items-center gap-4">
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
        <span className="text-2xl">{icon}</span>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 group-hover:text-gray-600 transition-colors">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-0.5">
          {loading ? (
            <span className="inline-block w-16 h-8 skeleton rounded"></span>
          ) : (
            value.toLocaleString('id-ID')
          )}
        </p>
      </div>
    </div>
    
    {/* Hover Arrow */}
    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
      <svg className={`w-5 h-5 text-transparent bg-gradient-to-r ${gradient} bg-clip-text`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </Link>
));

StatCard.displayName = 'StatCard';

// Komponen QuickAction di luar Dashboard
const QuickAction = memo(({ title, description, icon, link, gradient, delay }) => (
  <Link
    to={link}
    className={`group relative overflow-hidden p-6 rounded-2xl border-2 border-dashed border-gray-200 hover:border-transparent hover:bg-gradient-to-br ${gradient} transition-all duration-300 hover:shadow-lg animate-fade-in-up`}
    style={{ animationDelay: `${delay}ms` }}
  >
    {/* Background Pattern */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300">
      <div className="absolute inset-0" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
    </div>
    
    <div className="relative text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 group-hover:from-white/20 group-hover:to-white/10 flex items-center justify-center shadow-inner group-hover:shadow-none transition-all duration-300">
        <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{icon}</span>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-white mb-2 transition-colors duration-300">{title}</h3>
      <p className="text-sm text-gray-500 group-hover:text-white/80 transition-colors duration-300">{description}</p>
    </div>
  </Link>
));

QuickAction.displayName = 'QuickAction';

// Komponen RecentActivity di luar Dashboard
const RecentActivity = memo(() => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold text-gray-900">Aktivitas Terbaru</h3>
      <span className="text-xs text-gray-400 px-3 py-1 bg-gray-50 rounded-full">Live</span>
    </div>
    
    <div className="space-y-4">
      {[
        { icon: "🆔", text: "Data KTP berhasil diakses", time: "2 menit lalu", color: "bg-purple-100" },
        { icon: "🚗", text: "SIM baru ditambahkan", time: "15 menit lalu", color: "bg-orange-100" },
        { icon: "👤", text: "Admin baru terdaftar", time: "1 jam lalu", color: "bg-blue-100" },
      ].map((activity, i) => (
        <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
          <div className={`w-10 h-10 ${activity.color} rounded-xl flex items-center justify-center`}>
            <span className="text-lg">{activity.icon}</span>
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-700 font-medium">{activity.text}</p>
            <p className="text-xs text-gray-400">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
));

RecentActivity.displayName = 'RecentActivity';

// Komponen Clock terpisah sehingga update tidak affect komponen lain
const Clock = memo(({ currentTime }) => (
  <div className="flex flex-col items-end bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20">
    <div className="text-3xl font-bold font-mono">
      {currentTime.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}
    </div>
    <p className="text-blue-100 text-sm mt-1">
      {currentTime.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })}
    </p>
  </div>
));

Clock.displayName = 'Clock';

const Dashboard = () => {
  const user = useSelector(selectCurrentUser);
  const [stats, setStats] = useState({
    users: 0,
    ktp: 0,
    sim: 0,
    loading: true,
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      setStats((prev) => ({ ...prev, loading: true }));
      try {
        const [usersRes, ktpRes, simRes] = await Promise.all([
          userService.getUsers({ page: 1, limit: 1 }),
          ktpService.getAllKTP(),
          simService.getSIMList({ page: 1, limit: 1 }),
        ]);

        const usersTotal = usersRes?.pagination?.total_items ?? usersRes?.data?.pagination?.total_items ?? 0;
        const simTotal = simRes?.pagination?.total_items ?? simRes?.data?.pagination?.total_items ?? 0;
        const ktpTotal = typeof ktpRes?.total === 'number' ? ktpRes.total : 0;

        setStats({ users: usersTotal, ktp: ktpTotal, sim: simTotal, loading: false });
      } catch (e) {
        console.error('Failed to load dashboard stats:', e);
        setStats((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, []);

  // Memoize greeting agar tidak berubah saat detik berubah (hanya saat jam berubah)
  const greeting = useMemo(() => {
    const hour = currentTime.getHours();
    if (hour < 12) return { text: "Selamat Pagi", emoji: "🌅", color: "from-amber-400 to-orange-500" };
    if (hour < 15) return { text: "Selamat Siang", emoji: "☀️", color: "from-yellow-400 to-amber-500" };
    if (hour < 18) return { text: "Selamat Sore", emoji: "🌇", color: "from-orange-400 to-rose-500" };
    return { text: "Selamat Malam", emoji: "🌙", color: "from-indigo-400 to-purple-600" };
  }, [currentTime.getHours()]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-8 right-8 w-20 h-20 bg-white/10 rounded-2xl backdrop-blur-sm animate-float"></div>
        <div className="absolute bottom-8 right-32 w-12 h-12 bg-white/10 rounded-full backdrop-blur-sm animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-20 w-8 h-8 bg-white/10 rounded-xl backdrop-blur-sm animate-float" style={{ animationDelay: '0.5s' }}></div>
        
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl animate-float">{greeting.emoji}</span>
              <h1 className="text-3xl md:text-4xl font-bold">
                {greeting.text}, <span className="text-blue-200">{user?.full_name || "User"}!</span>
              </h1>
            </div>
            <p className="text-blue-100 text-lg">
              Selamat datang kembali di <span className="font-semibold">Sim Management</span>
            </p>
          </div>
          
          <Clock currentTime={currentTime} />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Admin"
          value={stats.users}
          icon="👥"
          gradient="from-blue-500 to-blue-600"
          link="/users"
          delay={100}
          loading={stats.loading}
        />
        <StatCard
          title="Data KTP"
          value={stats.ktp}
          icon="🆔"
          gradient="from-purple-500 to-indigo-600"
          link="/ktp"
          delay={200}
          loading={stats.loading}
        />
        <StatCard
          title="Data SIM"
          value={stats.sim}
          icon="🚗"
          gradient="from-orange-500 to-red-500"
          link="/sim"
          delay={300}
          loading={stats.loading}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fade-in-up" style={{ animationDelay: '350ms' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl">⚡</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Aksi Cepat</h2>
                <p className="text-sm text-gray-500">Akses fitur utama dengan cepat</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <QuickAction
                title="Kelola Admin"
                description="Tambah & kelola pengguna"
                icon="👥"
                link="/users"
                gradient="from-blue-500 to-blue-600"
                delay={400}
              />
              <QuickAction
                title="Input Data SIM"
                description="Tambahkan SIM baru"
                icon="🚙"
                link="/sim"
                gradient="from-orange-500 to-red-500"
                delay={450}
              />
              <QuickAction
                title="Lihat Satpas"
                description="Lokasi Satpas terdekat"
                icon="🏢"
                link="/satpas"
                gradient="from-cyan-500 to-blue-600"
                delay={500}
              />
            </div>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
      </div>

      {/* System Info Footer */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-100 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-xl text-white font-bold">S</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Sim Management v1.0</h3>
              <p className="text-sm text-gray-500">Sim Management - Admin Panel</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Sistem Online</span>
            </div>
            <div className="text-sm text-gray-400">
              © 2024 Sim Management
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
