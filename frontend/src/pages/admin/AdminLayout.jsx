import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../../components/ThemeToggle';
import {
  LayoutDashboard,
  BookOpen,
  UtensilsCrossed,
  Store,
  Compass,
  Video,
  Users,
  FileText,
  LogOut,
  Menu,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import logoHalalChannelClean from '../../assets/Logo Halal Channel (Clean).png';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navigationItems = [
    {
      name: 'Overview',
      path: '/admin/dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: 'Konten Artikel',
      path: '/admin/edukasi',
      icon: BookOpen,
      badge: 'Sains',
    },
    {
      name: 'Resep Halal',
      path: '/admin/resep',
      icon: UtensilsCrossed,
      badge: null,
    },
    {
      name: 'Kuliner & Resto Korea/ID',
      path: '/admin/kuliner',
      icon: Store,
      badge: 'BPJPH',
    },
    {
      name: 'Wisata Halal',
      path: '/admin/wisata',
      icon: Compass,
      badge: null,
    },
    {
      name: 'Media Podcast/Shorts',
      path: '/admin/media',
      icon: Video,
      badge: 'Escape',
    },
    {
      name: 'Kelola Admin',
      path: '/admin/users',
      icon: Users,
      badge: null,
    },
    {
      name: 'Audit Log',
      path: '/admin/logs',
      icon: FileText,
      badge: null,
    },
  ];

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  return (
    <div className="bg-[#f9f6ef] dark:bg-[#0f1915] text-slate-800 dark:text-[#f9f6ef] min-h-screen antialiased transition-colors duration-200">
      {/* ========================================================
          DAISYUI DRAWER (RESPONSIF MOBILE OFF-CANVAS & DESKTOP OPEN)
      ======================================================== */}
      <div className="drawer lg:drawer-open min-h-screen">
        <input
          id="admin-sidebar-drawer"
          type="checkbox"
          className="drawer-toggle"
          checked={drawerOpen}
          onChange={(e) => setDrawerOpen(e.target.checked)}
        />

        {/* ========================================================
            DRAWER CONTENT: AREA HEADER NAVBAR & KONTEN UTAMA
        ======================================================== */}
        <div className="drawer-content flex flex-col min-w-0 min-h-screen">
          {/* Header Bar dengan daisyUI navbar */}
          <header className="navbar h-24 bg-white dark:bg-[#14231e] border-b border-[#e8dfcf] dark:border-[#223831] px-5 sm:px-10 sticky top-0 z-30 shadow-xs transition-colors duration-200 justify-between">
            <div className="flex items-center gap-4">
              {/* Tombol Hamburger Drawer Mobile */}
              <label
                htmlFor="admin-sidebar-drawer"
                className="btn btn-ghost btn-circle lg:hidden text-slate-700 dark:text-slate-200"
                aria-label="Buka Menu Sidebar"
              >
                <Menu className="w-6 h-6" />
              </label>

              {/* Breadcrumb Elegan */}
              <div className="hidden sm:flex items-center gap-2.5 text-sm">
                <span className="font-medium text-slate-500 dark:text-slate-400">Dashboard</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
                <span className="font-bold text-slate-800 dark:text-[#f9f6ef]">Pusat Kendali Admin</span>
              </div>
            </div>

            {/* Aksi Kanan Header: Switch Tema, Live View & Profil */}
            <div className="flex items-center gap-3 sm:gap-5">
              {/* Fitur Switch Tema Terang / Gelap */}
              <ThemeToggle showLabel={false} />

              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="hidden md:inline-flex btn btn-sm bg-[#1b6a54]/10 dark:bg-[#1b6a54]/30 hover:bg-[#1b6a54]/20 text-[#1b6a54] dark:text-[#dec684] border border-[#1b6a54]/20 rounded-xl font-bold gap-2 text-xs sm:text-sm h-auto py-2.5 px-4"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Lihat Web Publik</span>
              </a>

              <div className="h-8 w-px bg-[#e8dfcf] dark:bg-[#223831] hidden sm:block"></div>

              {/* Profil Admin & Logout */}
              <div className="flex items-center gap-3.5">
                <div className="text-right hidden sm:block">
                  <p className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-[#f9f6ef] leading-tight">
                    {user?.namaLengkap || 'Admin Halal'}
                  </p>
                  <p className="text-xs font-bold text-[#1b6a54] dark:text-[#dec684]">
                    {user?.role?.namaRole || 'Administrator'}
                  </p>
                </div>

                <div className="avatar placeholder">
                  <div className="bg-[#1b6a54] text-[#f9f6ef] rounded-2xl w-10 h-10 font-bold text-sm shadow-xs flex items-center justify-center">
                    {user?.namaLengkap ? user.namaLengkap.charAt(0).toUpperCase() : 'A'}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={logout}
                  title="Logout"
                  className="btn btn-sm bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 rounded-xl font-bold gap-2 h-auto py-2 px-3 sm:px-4"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </header>

          {/* Area Konten Dinamis Halaman (Sub-Rute) */}
          <main className="flex-1 p-5 sm:p-10 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>
        </div>

        {/* ========================================================
            DRAWER SIDE: SIDEBAR NAVIGASI
        ======================================================== */}
        <div className="drawer-side z-50">
          <label
            htmlFor="admin-sidebar-drawer"
            aria-label="Tutup Menu Sidebar"
            className="drawer-overlay"
          ></label>

          <aside className="w-72 sm:w-80 min-h-full bg-white dark:bg-[#14231e] border-r border-[#e8dfcf] dark:border-[#223831] flex flex-col justify-between shadow-sm">
            {/* Bagian Atas: Logo Brand Halal Channel */}
            <div>
              <div className="h-24 px-6 flex items-center justify-between border-b border-[#e8dfcf] dark:border-[#223831]">
                <div
                  className="flex items-center gap-3.5 cursor-pointer"
                  onClick={() => {
                    navigate('/admin/dashboard');
                    handleCloseDrawer();
                  }}
                >
                  <img
                    src={logoHalalChannelClean}
                    alt="Logo Halal Channel"
                    className="h-12 sm:h-14 w-auto object-contain"
                  />
                  <div>
                    <h1 className="font-extrabold text-slate-900 dark:text-[#f9f6ef] text-lg sm:text-xl leading-tight tracking-tight">
                      Halal Channel
                    </h1>
                    <span className="badge badge-sm font-bold bg-[#1b6a54]/10 dark:bg-[#dec684]/15 text-[#1b6a54] dark:text-[#dec684] border-none mt-0.5">
                      Admin Portal v1.0
                    </span>
                  </div>
                </div>
              </div>

              {/* Menu Navigasi Modul dengan daisyUI Menu styling */}
              <div className="px-4 py-6 space-y-2 overflow-y-auto max-h-[calc(100vh-14rem)]">
                <p className="px-3 text-xs font-bold text-[#a08145] dark:text-[#dec684] uppercase tracking-wider mb-3">
                  Menu Utama CMS
                </p>
                <ul className="space-y-1.5 p-0 m-0 list-none">
                  {navigationItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <li key={item.path}>
                        <NavLink
                          to={item.path}
                          onClick={handleCloseDrawer}
                          className={({ isActive }) =>
                            `flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm sm:text-base font-semibold transition duration-150 ${
                              isActive
                                ? 'bg-[#1b6a54] text-[#f9f6ef] shadow-md'
                                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-[#dec684]/20 dark:hover:bg-[#1a2d27]'
                            }`
                          }
                        >
                          <div className="flex items-center gap-3.5">
                            <IconComponent className="w-5 h-5 flex-shrink-0" />
                            <span>{item.name}</span>
                          </div>
                          {item.badge && (
                            <span className="badge badge-sm font-bold bg-[#dec684] text-[#1b6a54] dark:bg-[#a08145] dark:text-[#f9f6ef] border-none uppercase tracking-wider">
                              {item.badge}
                            </span>
                          )}
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* Bagian Bawah Sidebar: Profil Ringkas & Logout */}
            <div className="p-5 border-t border-[#e8dfcf] dark:border-[#223831] bg-[#f9f6ef]/80 dark:bg-[#0f1915]/60">
              <div className="flex items-center gap-3.5 mb-3.5 p-3 bg-white dark:bg-[#1a2d27] rounded-2xl border border-[#e8dfcf] dark:border-[#28443b] shadow-xs">
                <div className="avatar placeholder">
                  <div className="w-11 h-11 rounded-xl bg-[#1b6a54] text-[#f9f6ef] flex items-center justify-center font-bold text-base shadow-xs">
                    {user?.namaLengkap ? user.namaLengkap.charAt(0).toUpperCase() : 'A'}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900 dark:text-[#f9f6ef] truncate">
                    {user?.namaLengkap || 'Administrator'}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                </div>
                <ShieldCheck className="w-5 h-5 text-[#1b6a54] dark:text-[#dec684] flex-shrink-0" />
              </div>

              <button
                type="button"
                onClick={logout}
                className="btn btn-block btn-ghost hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold text-xs sm:text-sm rounded-xl h-auto py-2.5 gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar dari Sesi</span>
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
