/**
 * PublicLayout.jsx
 * Shared layout untuk semua halaman publik: Navbar + children + Footer
 */
import { useState } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import {
  Menu, X, LogIn, ChevronDown, Sun, Moon, Search,
  MapPin, Utensils, Flame, BookOpen, Mic2, Compass,
  Phone, Mail,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import logoClean from '../assets/Logo Halal Channel (Clean).png';
import logoFull from '../assets/Logo Halal Channel.png';

/* ── NAV LINKS ────────────────────────────────────────────── */
const NAV_LINKS = [
  { label: 'Wisata Halal', to: '/wisata', icon: MapPin },
  { label: 'Kuliner Korea', to: '/kuliner', icon: Utensils },
  { label: 'Resep', to: '/resep', icon: Flame },
  { label: 'Artikel', to: '/artikel', icon: BookOpen },
  { label: 'Podcast', to: '/podcast', icon: Mic2 },
];

/* ── NAVBAR ───────────────────────────────────────────────── */
export const PublicNavbar = ({ onSearchClick }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="navbar bg-white/95 dark:bg-[#0f1915]/95 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-emerald-100 dark:border-emerald-900/40 px-4 lg:px-8 transition-colors duration-200">
      {/* Logo */}
      <div className="navbar-start gap-2">
        <button
          className="btn btn-ghost btn-sm lg:hidden"
          onClick={() => setMenuOpen((p) => !p)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <Link to="/" className="flex items-center gap-2.5 select-none">
          <img src={logoClean} alt="Halal Channel" className="h-9 w-auto object-contain" />
          <span className="hidden sm:inline font-black text-base text-slate-900 dark:text-white tracking-tight leading-tight">
            Halal<br />
            <span className="text-emerald-600 dark:text-emerald-400">Channel</span>
          </span>
        </Link>
      </div>

      {/* Menu desktop */}
      <nav className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal gap-0.5 px-0">
          {NAV_LINKS.map((l) => (
            <li key={l.label}>
              <NavLink
                to={l.to}
                className={({ isActive }) =>
                  `text-sm font-semibold rounded-lg px-3 py-2 transition ${
                    isActive
                      ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'
                      : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                  }`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Aksi kanan */}
      <div className="navbar-end gap-2">
        {onSearchClick && (
          <button
            onClick={onSearchClick}
            className="btn btn-ghost btn-sm btn-circle"
            aria-label="Cari"
          >
            <Search className="w-5 h-5" />
          </button>
        )}
        <button onClick={toggleTheme} className="btn btn-ghost btn-sm btn-circle" aria-label="Toggle tema">
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-500" />}
        </button>

        {isAuthenticated ? (
          <div className="dropdown dropdown-end">
            <button tabIndex={0} className="btn btn-ghost btn-sm gap-2 rounded-xl">
              <div className="avatar placeholder">
                <div className="bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-full w-8 text-xs font-bold">
                  <span>{user?.namaLengkap?.charAt(0) || 'U'}</span>
                </div>
              </div>
              <span className="hidden sm:inline text-sm font-semibold max-w-[120px] truncate">
                {user?.namaLengkap}
              </span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 dark:bg-[#14231e] rounded-2xl shadow-xl border border-base-200 dark:border-emerald-900/40 w-48 p-2 mt-2 z-50">
              <li className="px-3 pb-1">
                <span className="text-xs text-slate-400 font-medium">{user?.role?.namaRole}</span>
              </li>
              {user?.role?.namaRole?.toLowerCase() === 'admin' && (
                <li>
                  <button onClick={() => navigate('/admin/dashboard')} className="text-sm font-medium">
                    Dashboard Admin
                  </button>
                </li>
              )}
              <li>
                <button onClick={logout} className="text-sm font-medium text-red-500">
                  Keluar
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <Link
            to="/login"
            className="btn btn-sm gap-2 rounded-xl bg-emerald-600 border-emerald-600 hover:bg-emerald-700 hover:border-emerald-700 text-white font-semibold"
          >
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:inline">Masuk</span>
          </Link>
        )}
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-[#0f1915] border-b border-emerald-100 dark:border-emerald-900/40 shadow-lg lg:hidden z-50">
          <ul className="menu p-3 gap-1">
            {NAV_LINKS.map((l) => (
              <li key={l.label}>
                <NavLink
                  to={l.to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `text-sm font-semibold flex items-center gap-2 ${
                      isActive ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : ''
                    }`
                  }
                >
                  <l.icon className="w-4 h-4" /> {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};

/* ── FOOTER ───────────────────────────────────────────────── */
export const PublicFooter = () => (
  <footer className="bg-slate-900 dark:bg-[#030a05] border-t border-slate-800">
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img
              src={logoFull}
              alt="Halal Channel"
              className="h-16 w-auto object-contain"
            />
          </div>
          <p className="text-slate-400 text-sm leading-relaxed mb-5">
            Platform terintegrasi edukasi sains pangan, gaya hidup halal, wisata ramah Muslim, dan kuliner Korea thayyib untuk masyarakat Indonesia.
          </p>
          <p className="text-xs text-emerald-500 font-semibold">× RPNN Depok</p>
        </div>

        {/* Menu Utama */}
        <div>
          <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Jelajahi</h4>
          <ul className="space-y-2.5 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="text-slate-400 hover:text-emerald-400 transition font-medium flex items-center gap-2">
                  <l.icon className="w-3.5 h-3.5" /> {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Kemitraan */}
        <div>
          <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Kemitraan B2B</h4>
          <ul className="space-y-2.5 text-sm">
            {['Daftarkan Restoran', 'Partner LPH / BPJPH', 'Program Destinasi Wisata', 'Iklan & Sponsor'].map((l) => (
              <li key={l}>
                <a href="#" className="text-slate-400 hover:text-emerald-400 transition font-medium">{l}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Kontak */}
        <div>
          <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Kontak</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2 text-slate-400">
              <MapPin className="w-4 h-4 mt-0.5 text-emerald-500 flex-shrink-0" />
              Jl. Margonda Raya No. 54, Depok, Jawa Barat
            </li>
            <li className="flex items-center gap-2 text-slate-400">
              <Mail className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <a href="mailto:info@rpnn.depok.go.id" className="hover:text-emerald-400 transition">
                info@rpnn.depok.go.id
              </a>
            </li>
            <li className="flex items-center gap-2 text-slate-400">
              <Phone className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              (021) 1234-5678
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 text-xs text-slate-500">
        <p>© 2026 Halal Channel × RPNN Depok. Seluruh hak cipta dilindungi.</p>
        <div className="flex gap-4">
          {['Kebijakan Privasi', 'Syarat & Ketentuan', 'Regulasi Halal'].map((l) => (
            <a key={l} href="#" className="hover:text-emerald-400 transition">{l}</a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

/* ── LAYOUT WRAPPER ────────────────────────────────────────── */
const PublicLayout = ({ children }) => (
  <div className="min-h-screen bg-white dark:bg-[#0f1915] text-slate-800 dark:text-[#f9f6ef] transition-colors duration-200 flex flex-col">
    <PublicNavbar />
    <main className="flex-1">{children}</main>
    <PublicFooter />
  </div>
);

export default PublicLayout;
