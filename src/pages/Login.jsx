import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { authService } from '../services/authService';
import { selectIsAuthenticated, selectIsAuthLoading } from '../redux/authSlice';
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectIsAuthLoading);
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email wajib diisi";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!password) {
      newErrors.password = "Password wajib diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await authService.login(email, password);
    } catch (err) {
      setErrors({ form: err.response?.data?.errors || err.message || 'Login gagal' });
    }
  };

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-gray-50 to-blue-50/30 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        {/* Floating Orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>

        <div className="max-w-md w-full space-y-8 relative z-10 animate-fade-in-up">
          {/* Logo and Header */}
          <div className="text-center">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-xl opacity-50 animate-pulse"></div>
              <div className="relative h-20 w-20 mx-auto bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/30">
                <span className="text-3xl text-white font-bold">S</span>
              </div>
            </div>
            <h2 className="mt-8 text-3xl font-extrabold text-gray-900">
              Selamat Datang
            </h2>
            <p className="mt-3 text-gray-500">
              Masuk ke <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Sim Management</span>
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-200/50 p-8 border border-white/50">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {errors.form && (
                <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-4 rounded-xl shadow-sm animate-fade-in">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-red-800">Gagal Masuk</h3>
                      <p className="text-sm text-red-600">{errors.form}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Alamat Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@example.com"
                      className={`w-full pl-12 pr-4 py-3.5 bg-white border-2 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-0 ${
                        errors.email 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-gray-100 hover:border-gray-200 focus:border-blue-500'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <span>⚠️</span> {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan kata sandi"
                      className={`w-full pl-12 pr-12 py-3.5 bg-white border-2 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-0 ${
                        errors.password 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-gray-100 hover:border-gray-200 focus:border-blue-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <span>⚠️</span> {errors.password}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="relative w-full py-4 px-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden group"
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"></span>
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Memproses...
                    </>
                  ) : (
                    <>
                      Masuk
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </>
                  )}
                </span>
              </button>
            </form>

            <div className="mt-8 text-center">
              <div className="flex items-center justify-center gap-3 text-sm text-gray-400">
                <div className="w-8 h-px bg-gray-200"></div>
                <span>Sistem aman dan terpercaya</span>
                <div className="w-8 h-px bg-gray-200"></div>
              </div>
              <div className="mt-4 flex items-center justify-center gap-4">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="text-green-500">🔒</span> SSL Encrypted
                </div>
                <div className="w-px h-4 bg-gray-200"></div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="text-blue-500">🛡️</span> Protected
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 items-center justify-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-24 h-24 bg-white/10 rounded-3xl backdrop-blur-sm animate-float border border-white/20"></div>
        <div className="absolute bottom-32 right-20 w-20 h-20 bg-white/10 rounded-full backdrop-blur-sm animate-float border border-white/20" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-1/3 right-32 w-14 h-14 bg-white/10 rounded-2xl backdrop-blur-sm animate-float border border-white/20" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/3 left-32 w-10 h-10 bg-white/10 rounded-xl backdrop-blur-sm animate-float border border-white/20" style={{ animationDelay: '1.5s' }}></div>

        {/* Main Content */}
        <div className="relative z-10 text-center text-white px-12 max-w-xl">
          <div className="mb-10">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-white/20 rounded-[40px] blur-2xl scale-110"></div>
              <div className="relative w-36 h-36 mx-auto bg-white/20 rounded-[40px] backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-2xl">
                <span className="text-7xl">🏢</span>
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-extrabold mb-4 leading-tight">
            Sim Management
          </h1>
          <p className="text-xl text-blue-100 mb-10 leading-relaxed">
            Kelola data pengguna, KTP, dan SIM dengan mudah, cepat, dan aman
          </p>

          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: "🔐", title: "Aman", desc: "Data terenkripsi" },
              { icon: "⚡", title: "Cepat", desc: "Proses instan" },
              { icon: "📊", title: "Akurat", desc: "Data valid" },
            ].map((item, i) => (
              <div 
                key={i} 
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                <div className="w-12 h-12 mx-auto bg-white/20 rounded-xl flex items-center justify-center mb-3">
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-xs text-blue-200 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" fillOpacity="0.05"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Login;
