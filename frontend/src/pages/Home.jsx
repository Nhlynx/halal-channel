import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, MapPin, Utensils, Flame, BookOpen, Mic2, Compass,
  FlaskConical, Leaf, Phone, Mail, ChevronRight, ChevronDown,
  LogIn, Loader2, AlertCircle, Play, Sun, Moon, Menu, X, Award,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { NavLink, useNavigate } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';
import usePublicData from '../hooks/usePublicData';
import api from '../services/api';
import logoClean from '../assets/Logo Halal Channel (Clean).png';
import logoFull from '../assets/Logo Halal Channel.png';
import heroBg from '../assets/hero.png';
import {
  WisataCard, KulinerCard, ResepCard, ArtikelCard,
  SkeletonCard, EmptyState, SectionHeader,
  ImgWithFallback,
} from '../components/ui/ContentCard';

/* ── KATEGORI FILTER PILLS ───────────────────────────────── */
const KATEGORI_PILLS = [
  { id: 'all',     label: 'Semua',         icon: Compass },
  { id: 'wisata',  label: 'Wisata Halal',  icon: MapPin },
  { id: 'kuliner', label: 'Kuliner & Korea', icon: Utensils },
  { id: 'resep',   label: 'Resep Halal',   icon: Flame },
  { id: 'edukasi', label: 'Sains Pangan',  icon: FlaskConical },
];

const NAV_LINKS = [
  { label: 'Wisata Halal',  to: '/wisata',  icon: MapPin },
  { label: 'Kuliner Korea', to: '/kuliner', icon: Utensils },
  { label: 'Resep',         to: '/resep',   icon: Flame },
  { label: 'Artikel',       to: '/artikel', icon: BookOpen },
  { label: 'Podcast',       to: '/podcast', icon: Mic2 },
];

/* ── NAVBAR ─────────────────────────────────────────────────
   Mendukung smooth-scroll ke section Hero Search saat klik
   ikon search, dan navigasi ke halaman konten tersendiri.
─────────────────────────────────────────────────────────── */
const Navbar = ({ onSearchFocus }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="navbar bg-white/95 dark:bg-[#0f1915]/95 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-emerald-100 dark:border-emerald-900/40 px-4 lg:px-8 transition-colors duration-200">
      {/* Logo */}
      <div className="navbar-start gap-2">
        <button className="btn btn-ghost btn-sm lg:hidden" onClick={() => setMenuOpen((p) => !p)} aria-label="Toggle menu">
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

      {/* Menu desktop — link ke halaman tersendiri */}
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
        <button onClick={onSearchFocus} className="btn btn-ghost btn-sm btn-circle lg:hidden" aria-label="Cari">
          <Search className="w-5 h-5" />
        </button>
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
                <button onClick={logout} className="text-sm font-medium text-red-500">Keluar</button>
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

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-[#0f1915] border-b border-emerald-100 dark:border-emerald-900/40 shadow-lg lg:hidden z-50">
          <ul className="menu p-3 gap-1">
            {NAV_LINKS.map((l) => (
              <li key={l.label}>
                <NavLink
                  to={l.to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `text-sm font-semibold flex items-center gap-2 ${isActive ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : ''}`
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

/* ── HERO + SEARCH ─────────────────────────────────────────── */
const HeroSearch = ({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, searchInputRef }) => (
  <section
    id="hero-search"
    className="relative min-h-[72vh] flex items-center justify-center overflow-hidden"
    style={{ background: 'linear-gradient(135deg, #064e3b 0%, #065f46 40%, #047857 70%, #059669 100%)' }}
  >
    <div
      className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-20"
      style={{ backgroundImage: `url(${heroBg})` }}
      aria-hidden="true"
    />
    <div
      className="absolute inset-0 opacity-10"
      style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '28px 28px' }}
      aria-hidden="true"
    />

    <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-16 text-center">
      <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white/90 text-xs font-bold px-4 py-1.5 rounded-full mb-6 border border-white/20 tracking-wide uppercase">
        <Leaf className="w-3.5 h-3.5" />
        Platform Halal Digital
      </span>

      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4 tracking-tight">
        Platform Terintegrasi Edukasi Sains,{' '}
        <span className="text-emerald-200">Gaya Hidup Halal</span>{' '}
        &amp; Wisata Ramah Muslim
      </h1>
      <p className="text-white/75 text-base sm:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
        Temukan destinasi wisata halal, kuliner Korea terverifikasi, resep thayyib, dan edukasi sains pangan — semuanya dalam satu platform.
      </p>

      {/* Search Bar */}
      <div className="bg-white dark:bg-[#14231e] rounded-2xl shadow-2xl p-3 flex flex-col sm:flex-row gap-3 max-w-3xl mx-auto border border-white/30">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari wisata, kuliner Korea, resep halal..."
            className="input w-full pl-11 pr-4 rounded-xl bg-transparent border border-slate-200 dark:border-slate-600 focus:border-emerald-500 focus:outline-none text-slate-800 dark:text-white placeholder:text-slate-400"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="select rounded-xl bg-transparent border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold sm:w-44 focus:outline-none focus:border-emerald-500"
        >
          {KATEGORI_PILLS.map((k) => (
            <option key={k.id} value={k.id}>{k.label}</option>
          ))}
        </select>
        <button
          onClick={() => { /* debounce sudah handle */ }}
          className="btn bg-emerald-600 hover:bg-emerald-700 text-white border-0 rounded-xl font-bold px-6 gap-2 shrink-0"
        >
          <Search className="w-4 h-4" />
          Cari
        </button>
      </div>

      {/* Quick stats */}
      <div className="flex flex-wrap items-center justify-center gap-5 mt-8 text-white/70 text-sm font-medium">
        {[
          { label: '500+ Destinasi', icon: MapPin },
          { label: '200+ Kuliner Halal', icon: Utensils },
          { label: '300+ Resep Thayyib', icon: Flame },
        ].map(({ label, icon: Icon }) => (
          <span key={label} className="flex items-center gap-1.5">
            <Icon className="w-4 h-4 text-emerald-300" /> {label}
          </span>
        ))}
      </div>
    </div>
  </section>
);

/* ── CATEGORY PILLS ─────────────────────────────────────────── */
const CategoryPills = ({ selected, setSelected }) => (
  <section className="bg-white dark:bg-[#0f1915] border-b border-slate-100 dark:border-emerald-900/30 sticky top-16 z-40 transition-colors duration-200">
    <div className="max-w-7xl mx-auto px-4 py-3">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
        {KATEGORI_PILLS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setSelected(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border font-semibold text-sm whitespace-nowrap transition-all duration-150 ${
              selected === id
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-md'
                : 'bg-transparent border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>
    </div>
  </section>
);

/* ── HASIL PENCARIAN ─────────────────────────────────────────── */
const SearchResults = ({ results, query, isLoading }) => {
  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-6">
          <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
          <span className="text-slate-500 dark:text-slate-400 font-medium">Mencari "{query}"...</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SkeletonCard count={4} />
        </div>
      </section>
    );
  }

  // Gabungkan semua hasil ke satu array flat dengan field normalisasi
  const allItems = [
    ...(results?.wisata || []).map((i) => ({
      ...i,
      _type: 'wisata',
      _title: i.nama || i.namaDestinasi,
      _photo: i.fotoUtama || i.foto,
      _sub: i.lokasi || i.kategori,
    })),
    ...(results?.kuliner || []).map((i) => ({
      ...i,
      _type: 'kuliner',
      _title: i.nama || i.namaRestoran,
      _photo: i.fotoUtama || i.foto,
      _sub: i.alamat || i.kategori,
    })),
    ...(results?.resep || []).map((i) => ({
      ...i,
      _type: 'resep',
      _title: i.nama || i.judulResep,
      _photo: i.fotoUtama || i.foto,
      _sub: i.kategori || i.kategoriResep,
    })),
    ...(results?.edukasi || []).map((i) => ({
      ...i,
      _type: 'edukasi',
      _title: i.nama || i.judul,
      _photo: i.fotoUtama || i.foto,
      _sub: i.kategori,
    })),
  ];

  if (allItems.length === 0) {
    return (
      <section className="py-20 max-w-7xl mx-auto px-4 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
          <AlertCircle className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-2">
          Tidak ada hasil untuk "{query}"
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
          Coba kata kunci lain atau pilih kategori yang berbeda. Konten baru ditambahkan setiap hari.
        </p>
      </section>
    );
  }

  const TYPE_LABEL = { wisata: 'Wisata', kuliner: 'Kuliner', resep: 'Resep', edukasi: 'Artikel' };
  const TYPE_TO = { wisata: '/wisata', kuliner: '/kuliner', resep: '/resep', edukasi: '/artikel' };

  return (
    <section className="py-10 max-w-7xl mx-auto px-4">
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 font-medium">
        <strong className="text-emerald-600">{allItems.length}</strong> hasil untuk "<em>{query}</em>"
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {allItems.map((item) => (
          <Link
            key={`${item._type}-${item.id}`}
            to={`${TYPE_TO[item._type]}/${item.id}`}
            className="card card-compact bg-base-100 dark:bg-[#14231e] shadow-md hover:shadow-xl border border-base-200 dark:border-emerald-900/30 overflow-hidden group transition-all duration-200 hover:-translate-y-1"
          >
            <figure className="h-44 overflow-hidden relative">
              <ImgWithFallback
                src={item._photo}
                alt={item._title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <span className="absolute top-3 left-3 badge badge-sm bg-emerald-600/90 text-white border-0 font-bold backdrop-blur-sm">
                {TYPE_LABEL[item._type]}
              </span>
            </figure>
            <div className="card-body px-4 py-3 gap-1.5">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug line-clamp-2">
                {item._title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{item._sub}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

/* ── SECTION WISATA ─────────────────────────────────────────── */
const WisataSection = () => {
  const { data, isLoading } = usePublicData('/public/wisata');
  const preview = data.slice(0, 4);

  return (
    <section id="wisata" className="py-14 bg-slate-50 dark:bg-[#0a1510] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader
          badge="Destinasi Unggulan"
          title="Wisata Halal & Ramah Muslim"
          desc="Destinasi pilihan dengan fasilitas ibadah lengkap & menu halal tersertifikasi"
          linkTo="/wisata"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {isLoading
            ? <SkeletonCard count={4} />
            : preview.length === 0
            ? <EmptyState title="Belum ada destinasi wisata" />
            : preview.map((item) => <WisataCard key={item.id} item={item} />)}
        </div>
        {!isLoading && data.length > 4 && (
          <div className="text-center mt-8">
            <Link to="/wisata" className="btn btn-outline border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 rounded-xl gap-2">
              Lihat Semua Wisata <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

/* ── SECTION KULINER ─────────────────────────────────────────── */
const KulinerSection = () => {
  const { data, isLoading } = usePublicData('/public/kuliner');
  const preview = data.slice(0, 4);

  return (
    <section id="kuliner" className="py-14 bg-white dark:bg-[#0f1915] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader
          badge="Kuliner Halal"
          title="Katalog Kuliner & Resto Korea Halal"
          desc="Restoran dengan sertifikasi BPJPH dan label Thayyib terverifikasi"
          linkTo="/kuliner"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card card-side bg-base-100 shadow-md animate-pulse overflow-hidden">
                  <div className="skeleton w-36 h-full rounded-none" />
                  <div className="card-body gap-3 p-4">
                    <div className="skeleton h-4 w-3/4 rounded" />
                    <div className="skeleton h-3 w-1/2 rounded" />
                    <div className="skeleton h-3 w-full rounded" />
                  </div>
                </div>
              ))
            : preview.length === 0
            ? <EmptyState title="Belum ada data kuliner" />
            : preview.map((item) => <KulinerCard key={item.id} item={item} />)}
        </div>
        {!isLoading && data.length > 4 && (
          <div className="text-center mt-8">
            <Link to="/kuliner" className="btn btn-outline border-amber-500 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-white hover:border-amber-500 rounded-xl gap-2">
              Lihat Semua Kuliner <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

/* ── SECTION RESEP ─────────────────────────────────────────── */
const ResepSection = () => {
  const { data, isLoading } = usePublicData('/public/resep');
  const preview = data.slice(0, 3);

  return (
    <section id="resep" className="py-14 bg-slate-50 dark:bg-[#0a1510] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader
          badge="Resep Pilihan"
          title="Resep Halal & Thayyib"
          desc="Resep autentik tanpa bahan haram — aman, lezat, dan terverifikasi saintifik"
          linkTo="/resep"
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {isLoading
            ? <SkeletonCard count={3} />
            : preview.length === 0
            ? <EmptyState title="Belum ada resep" />
            : preview.map((item) => <ResepCard key={item.id} item={item} />)}
        </div>
        {!isLoading && data.length > 3 && (
          <div className="text-center mt-8">
            <Link to="/resep" className="btn btn-outline border-orange-500 text-orange-600 dark:text-orange-400 hover:bg-orange-500 hover:text-white hover:border-orange-500 rounded-xl gap-2">
              Lihat Semua Resep <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

/* ── SECTION ARTIKEL ─────────────────────────────────────────── */
const ArtikelSection = () => {
  const { data, isLoading } = usePublicData('/public/edukasi');
  const preview = data.slice(0, 4);

  return (
    <section id="artikel" className="py-14 bg-white dark:bg-[#0f1915] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader
          badge="Artikel & Edukasi"
          title="Sains Pangan & Resep Halal"
          desc="Artikel edukasi populer berbasis riset ilmiah dan gaya hidup thayyib"
          linkTo="/artikel"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {isLoading
            ? <SkeletonCard count={4} />
            : preview.length === 0
            ? <EmptyState title="Belum ada artikel" />
            : preview.map((item) => <ArtikelCard key={item.id} item={item} />)}
        </div>
        {!isLoading && data.length > 4 && (
          <div className="text-center mt-8">
            <Link to="/artikel" className="btn btn-outline border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-500 hover:text-white hover:border-blue-500 rounded-xl gap-2">
              Lihat Semua Artikel <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

/* ── SECTION PODCAST ─────────────────────────────────────────── */
const PodcastSection = () => {
  const { data, isLoading } = usePublicData('/public/media');

  return (
    <section id="podcast" className="py-14 bg-slate-900 dark:bg-[#060e09]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="badge badge-sm bg-purple-800/60 text-purple-300 border-0 font-bold mb-3">Media & Podcast</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Podcast Kasual Halal Channel</h2>
          <p className="text-slate-400 mt-2 text-sm max-w-xl mx-auto">
            Obrolan santai seputar gaya hidup halal, wisata Muslim, dan riset sains pangan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card bg-slate-800 overflow-hidden animate-pulse">
                  <div className="skeleton h-44 w-full rounded-none" />
                  <div className="card-body gap-3 p-4">
                    <div className="skeleton h-4 w-3/4 rounded" />
                    <div className="skeleton h-3 w-1/2 rounded" />
                  </div>
                </div>
              ))
            : data.slice(0, 3).map((ep) => (
                <div
                  key={ep.id}
                  className="card bg-slate-800 dark:bg-slate-800/60 shadow-2xl overflow-hidden group cursor-pointer hover:-translate-y-1 transition-all duration-200 border border-slate-700/50"
                >
                  <figure className="relative h-44 overflow-hidden">
                    <ImgWithFallback
                      src={ep.foto}
                      alt={ep.judul}
                      className="w-full h-full object-cover brightness-75 group-hover:brightness-90 transition-all duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/40 group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 text-white fill-white ml-1" />
                      </div>
                    </div>
                    <span className="absolute top-3 left-3 badge badge-sm bg-purple-600 text-white border-0 font-bold">
                      {ep.tipeMedia === 'AUDIO_PODCAST' ? 'Podcast' : 'Video'}
                    </span>
                  </figure>
                  <div className="card-body px-4 py-3 gap-1.5">
                    <h3 className="font-bold text-white text-sm leading-snug line-clamp-2">{ep.judul}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{ep.deskripsi}</p>
                  </div>
                </div>
              ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/podcast" className="btn btn-outline border-purple-500 text-purple-400 hover:bg-purple-600 hover:text-white hover:border-purple-600 rounded-xl gap-2">
            Lihat Semua Episode <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

/* ── FOOTER ─────────────────────────────────────────────────── */
const Footer = () => (
  <footer className="bg-slate-900 dark:bg-[#030a05] border-t border-slate-800">
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img
              src={logoFull}
              alt="Halal Channel"
              className="h-20 w-auto object-contain"
            />
          </div>
          <p className="text-slate-400 text-sm leading-relaxed mb-3">
            Platform terintegrasi edukasi sains pangan, gaya hidup halal, wisata ramah Muslim, dan kuliner Korea thayyib.
          </p>
          <p className="text-xs text-emerald-500 font-semibold">× RPNN Depok</p>
        </div>

        {/* Menu */}
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
              <li key={l}><a href="#" className="text-slate-400 hover:text-emerald-400 transition font-medium">{l}</a></li>
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
              <a href="mailto:info@rpnn.depok.go.id" className="hover:text-emerald-400 transition">info@rpnn.depok.go.id</a>
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

/* ── KOMPONEN UTAMA: Home ────────────────────────────────────── */
const Home = () => {
  useDocumentTitle('Halal Channel — Platform Halal Digital #1 Indonesia');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef(null);

  const handleSearchFocus = useCallback(() => {
    searchInputRef.current?.focus();
    const el = document.getElementById('hero-search');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const fetchSearchResults = useCallback(async (q, category) => {
    setIsSearching(true);
    try {
      const { data: res } = await api.get('/search', {
        params: { q: q.trim(), category },
      });
      if (res?.success) {
        setSearchResults(res.data);
      } else {
        setSearchResults({ wisata: [], kuliner: [], resep: [], edukasi: [] });
      }
    } catch {
      setSearchResults({ wisata: [], kuliner: [], resep: [], edukasi: [] });
    } finally {
      setIsSearching(false);
    }
  }, []);

  /* Debounce 300ms sesuai SOT */
  useEffect(() => {
    const isActive = searchQuery.trim().length > 0 || selectedCategory !== 'all';
    const handler = setTimeout(() => {
      if (isActive) {
        fetchSearchResults(searchQuery, selectedCategory);
      } else {
        setSearchResults(null);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery, selectedCategory, fetchSearchResults]);

  const isSearchMode = searchResults !== null || isSearching;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f1915] text-slate-800 dark:text-[#f9f6ef] transition-colors duration-200">
      {/* 1. Navbar */}
      <Navbar onSearchFocus={handleSearchFocus} />

      {/* 2. Hero + Search */}
      <HeroSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchInputRef={searchInputRef}
      />

      {/* 3. Category Pills */}
      <CategoryPills selected={selectedCategory} setSelected={setSelectedCategory} />

      {/* 4. Konten */}
      {isSearchMode ? (
        <div className="bg-white dark:bg-[#0f1915] min-h-[40vh]">
          <SearchResults
            results={searchResults}
            query={searchQuery || (selectedCategory !== 'all' ? selectedCategory : '')}
            isLoading={isSearching}
          />
        </div>
      ) : (
        <>
          <WisataSection />
          <KulinerSection />
          <ResepSection />
          <ArtikelSection />
          <PodcastSection />
        </>
      )}

      {/* 5. Footer */}
      <Footer />
    </div>
  );
};

export default Home;
