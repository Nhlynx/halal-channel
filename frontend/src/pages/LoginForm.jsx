import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import useDocumentTitle from '../hooks/useDocumentTitle';
import ThemeToggle from '../components/ThemeToggle';
import logoHalalChannelClean from '../assets/Logo Halal Channel (Clean).png';

const LoginForm = ({ isModal = false, onClose }) => {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Set judul tab browser khusus untuk halaman Login Admin
  useDocumentTitle('Login Pengguna');

  // State Formulir
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // State Validasi & Loading
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Jika sudah terautentikasi dan berada di dedicated route /login, arahkan sesuai peran
  useEffect(() => {
    if (isAuthenticated && !isModal) {
      const roleName = user?.role?.namaRole?.toLowerCase() || '';
      if (roleName === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, user, isModal, navigate]);

  // Validasi format email sederhana menggunakan regex standar
  const validateEmail = (val) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(val);
  };

  // Validasi Client-Side sesuai Matriks SOT Bagian 6.1
  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email Address wajib diisi.';
    } else if (!validateEmail(email.trim())) {
      newErrors.email = 'Masukkan format email yang valid.';
    }

    if (!password) {
      newErrors.password = 'Password wajib diisi.';
    } else if (password.length < 6) {
      newErrors.password = 'Password wajib diisi minimal 6 karakter.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Penanganan Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // POST ke endpoint /api/auth/login sesuai kontrak SOT
      const response = await api.post('/auth/login', {
        email: email.trim(),
        password,
        rememberMe,
      });

      if (response.data && response.data.success) {
        const { token, user: userData } = response.data.data;

        // Panggil fungsi login dari AuthContext (akan mengarahkan rute otomatis)
        login(userData, token);

        if (isModal && onClose) {
          onClose();
        }
      } else {
        setServerError(response.data?.message || 'Login gagal, periksa kredensial Anda.');
      }
    } catch (err) {
      console.error('Error saat submit login:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setServerError(err.response.data.message);
      } else if (err.request) {
        setServerError('Tidak dapat terhubung ke server backend. Pastikan server Express aktif di port 5000.');
      } else {
        setServerError('Terjadi kesalahan saat memproses permintaan login.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`w-full min-h-screen bg-[#f9f6ef] dark:bg-[#0f1915] text-slate-800 dark:text-[#f9f6ef] transition-colors duration-200 ${
        isModal ? '' : 'flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative'
      }`}
    >
      {/* Tombol Theme Toggle di Pojok Kanan Atas Halaman Login */}
      {!isModal && (
        <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-10">
          <ThemeToggle showLabel={true} />
        </div>
      )}

      {/* daisyUI Card Container */}
      <div className="card w-full max-w-lg bg-white dark:bg-[#14231e] card-bordered border-[#e8dfcf] dark:border-[#223831] shadow-2xl relative rounded-3xl">
        {/* Tombol Tutup jika dalam Mode Modal */}
        {isModal && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            aria-label="Tutup Modal"
          >
            ✕
          </button>
        )}

        <div className="card-body p-8 sm:p-11">
          {/* ========================================================
              BLOK 1: Header Login (Logo, Title "Welcome back!")
          ======================================================== */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4">
              <img
                src={logoHalalChannelClean}
                alt="Logo Halal Channel"
                className="h-28 sm:h-32 w-auto object-contain max-w-[280px] drop-shadow-md transition-transform duration-200 hover:scale-105"
              />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-[#f9f6ef] tracking-tight">
              Selamat Datang Kembali!
            </h1>
            <p className="text-base sm:text-lg text-[#a08145] dark:text-[#dec684] mt-2 font-semibold">
              Log In ke Halal Channel
            </p>
          </div>

          {/* Penanganan Pesan Error Server dengan daisyUI Alert */}
          {serverError && (
            <div className="alert alert-error mb-6 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-sm font-medium flex items-start gap-3 shadow-xs">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
              <span className="leading-snug">{serverError}</span>
            </div>
          )}

          {/* ========================================================
              BLOK 2: Opsi Autentikasi Sosial (OAuth) dengan daisyUI Button
          ======================================================== */}
          <div className="space-y-3.5 mb-6">
            {/* Tombol Continue with Google */}
            <button
              type="button"
              className="btn btn-block bg-white dark:bg-[#1a2d27] hover:bg-slate-50 dark:hover:bg-[#20362f] border border-slate-300 dark:border-[#28443b] text-slate-700 dark:text-slate-200 text-sm sm:text-base font-bold h-auto py-3.5 rounded-2xl shadow-xs transition duration-150 flex items-center justify-center gap-3.5"
              onClick={() => alert('Autentikasi Google OAuth akan diintegrasikan pada Sprint berikutnya.')}
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.37 7.31 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.97 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.63 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Tombol Continue with Facebook */}
            <button
              type="button"
              className="btn btn-block bg-[#1877F2] hover:bg-[#166fe5] border-none text-white text-sm sm:text-base font-bold h-auto py-3.5 rounded-2xl shadow-xs transition duration-150 flex items-center justify-center gap-3.5"
              onClick={() => alert('Autentikasi Facebook OAuth akan diintegrasikan pada Sprint berikutnya.')}
            >
              <svg className="w-5 h-5 fill-current flex-shrink-0" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Continue with Facebook</span>
            </button>
          </div>

          {/* daisyUI Divider */}
          <div className="divider text-xs sm:text-sm uppercase tracking-wider text-[#a08145] dark:text-[#dec684] font-bold my-4 before:bg-[#e8dfcf] after:bg-[#e8dfcf] dark:before:bg-[#223831] dark:after:bg-[#223831]">
            atau masuk dengan email
          </div>

          {/* ========================================================
              BLOK 3: Formulir Kredensial Utama (daisyUI Input & Form-Control)
          ======================================================== */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Input Email Address */}
            <div>
              <label htmlFor="email" className="block text-sm sm:text-base font-bold text-slate-700 dark:text-slate-200 mb-2">
                Alamat Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                }}
                placeholder="nama@domain.com"
                className={`input input-bordered w-full px-4 py-3.5 h-auto rounded-2xl text-base bg-white dark:bg-[#1a2d27] text-slate-900 dark:text-white placeholder:text-slate-400 transition outline-none ${
                  errors.email
                    ? 'border-rose-400 focus:border-rose-500 ring-2 ring-rose-200'
                    : 'border-slate-300 dark:border-[#28443b] focus:border-[#1b6a54] focus:ring-2 focus:ring-[#1b6a54]/20'
                }`}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs sm:text-sm text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Input Password dengan Toggle Eye Icon */}
            <div>
              <label htmlFor="password" className="block text-sm sm:text-base font-bold text-slate-700 dark:text-slate-200 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                  }}
                  placeholder="••••••••"
                  className={`input input-bordered w-full px-4 py-3.5 pr-12 h-auto rounded-2xl text-base bg-white dark:bg-[#1a2d27] text-slate-900 dark:text-white placeholder:text-slate-400 transition outline-none ${
                    errors.password
                      ? 'border-rose-400 focus:border-rose-500 ring-2 ring-rose-200'
                      : 'border-slate-300 dark:border-[#28443b] focus:border-[#1b6a54] focus:ring-2 focus:ring-[#1b6a54]/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="btn btn-sm btn-ghost btn-circle absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs sm:text-sm text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            {/* Checkbox daisyUI & Lupa Password */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="checkbox checkbox-sm text-[#1b6a54] border-slate-300 dark:border-[#28443b] rounded-md checked:bg-[#1b6a54]"
                />
                <span className="text-sm sm:text-base font-semibold text-slate-600 dark:text-slate-300">
                  Tetap Masuk
                </span>
              </label>

              <Link
                to="/forgot-password"
                className="text-xs sm:text-sm font-bold text-[#1b6a54] dark:text-[#dec684] hover:underline transition"
              >
                Lupa password?
              </Link>
            </div>

            {/* ========================================================
                BLOK 4: Tombol Log in Utama dengan daisyUI Button
            ======================================================== */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-block bg-[#1b6a54] hover:bg-[#145241] text-[#f9f6ef] border-none font-extrabold text-base sm:text-lg h-auto py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Memproses Masuk...</span>
                  </div>
                ) : (
                  <span>Log in</span>
                )}
              </button>
            </div>
          </form>

          {/* Legal Consent */}
          <div className="mt-8 text-center">
            <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 leading-relaxed">
              By continuing, you agree to{' '}
              <Link to="/terms" className="underline hover:text-[#1b6a54] dark:hover:text-[#dec684]">
                Terms
              </Link>{' '}
              &{' '}
              <Link to="/privacy" className="underline hover:text-[#1b6a54] dark:hover:text-[#dec684]">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
