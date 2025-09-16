import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const { login, isAuthenticated, loading, error, clearError } = useAuth();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    clearError();
  }, [clearError]);

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
      await login(email, password);
      // Redirect to dashboard after successful login
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-md w-full space-y-8">
          {/* Logo and Header */}
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <span className="text-2xl text-white font-bold">S</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Selamat Datang Kembali
            </h2>
            <p className="text-gray-600">
              Masuk ke <span className="font-semibold text-blue-600">SIMA</span>{" "}
              - Sistem Informasi Manajemen
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <span className="text-red-400">⚠️</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-5">
                <Input
                  label="Alamat Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                  placeholder="admin@example.com"
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />

                <Input
                  label="Kata Sandi"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errors.password}
                  placeholder="Masukkan kata sandi"
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                loading={loading}
                disabled={loading}
              >
                {loading ? "Memproses..." : "Masuk"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Sistem informasi manajemen yang aman dan terpercaya
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 items-center justify-center relative overflow-hidden">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-20 h-20 bg-white/10 rounded-2xl backdrop-blur-sm animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-16 h-16 bg-white/10 rounded-full backdrop-blur-sm animate-bounce"></div>
        <div className="absolute top-1/3 right-32 w-12 h-12 bg-white/10 rounded-xl backdrop-blur-sm animate-pulse delay-300"></div>

        {/* Main Content */}
        <div className="relative z-10 text-center text-white px-12">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto bg-white/20 rounded-3xl backdrop-blur-sm flex items-center justify-center mb-6">
              <span className="text-6xl">🏢</span>
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-4">Sistem Informasi Manusia</h1>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Kelola data pengguna, KTP, dan SIM dengan mudah dan aman
          </p>

          <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-xl backdrop-blur-sm flex items-center justify-center mx-auto mb-2">
                <span className="text-xl">🔐</span>
              </div>
              <p className="text-sm text-blue-100">Aman</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-xl backdrop-blur-sm flex items-center justify-center mx-auto mb-2">
                <span className="text-xl">⚡</span>
              </div>
              <p className="text-sm text-blue-100">Cepat</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-xl backdrop-blur-sm flex items-center justify-center mx-auto mb-2">
                <span className="text-xl">📊</span>
              </div>
              <p className="text-sm text-blue-100">Efisien</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
