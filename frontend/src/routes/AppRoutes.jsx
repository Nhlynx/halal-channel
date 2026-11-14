import { Routes, Route, Navigate, Link } from 'react-router-dom';
import PageTitleUpdater from '../components/PageTitleUpdater';
import LoginForm from '../pages/LoginForm';

// Halaman Utama & Publik
import Home from '../pages/Home';
import WisataPage from '../pages/public/WisataPage';
import KulinerPage from '../pages/public/KulinerPage';
import ResepPage from '../pages/public/ResepPage';
import ArtikelPage from '../pages/public/ArtikelPage';
import PodcastPage from '../pages/public/PodcastPage';

// Admin
import ProtectedAdminRoute from '../pages/admin/ProtectedAdminRoute';
import AdminLayout from '../pages/admin/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminKuliner from '../pages/admin/AdminKuliner';
import AdminEdukasi from '../pages/admin/AdminEdukasi';
import AdminResep from '../pages/admin/AdminResep';
import AdminWisata from '../pages/admin/AdminWisata';
import AdminMedia from '../pages/admin/AdminMedia';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminLogs from '../pages/admin/AdminLogs';

/** Placeholder Lupa Password */
const PlaceholderPage = ({ title, description }) => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
    <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
      <h2 className="text-xl font-bold text-slate-800 mb-2">{title}</h2>
      <p className="text-sm text-slate-500 mb-6">{description}</p>
      <Link
        to="/login"
        className="inline-flex items-center justify-center px-5 py-2 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition"
      >
        Kembali ke Login
      </Link>
    </div>
  </div>
);

const AppRoutes = () => {
  return (
    <>
      <PageTitleUpdater />
      <Routes>
        {/* ── Rute Publik ── */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/wisata" element={<WisataPage />} />
        <Route path="/wisata/:id" element={<WisataPage />} />
        <Route path="/kuliner" element={<KulinerPage />} />
        <Route path="/kuliner/:id" element={<KulinerPage />} />
        <Route path="/resep" element={<ResepPage />} />
        <Route path="/resep/:id" element={<ResepPage />} />
        <Route path="/artikel" element={<ArtikelPage />} />
        <Route path="/artikel/:id" element={<ArtikelPage />} />
        <Route path="/podcast" element={<PodcastPage />} />

        {/* Lupa Password */}
        <Route
          path="/forgot-password"
          element={
            <PlaceholderPage
              title="Lupa Password"
              description="Fitur reset password akan diintegrasikan melalui email verifikasi pada Sprint lanjutan."
            />
          }
        />
        <Route path="/register" element={<Navigate to="/login" replace />} />

        {/* ── Rute Terproteksi Admin ── */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="edukasi" element={<AdminEdukasi />} />
          <Route path="resep" element={<AdminResep />} />
          <Route path="kuliner" element={<AdminKuliner />} />
          <Route path="wisata" element={<AdminWisata />} />
          <Route path="media" element={<AdminMedia />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="logs" element={<AdminLogs />} />
        </Route>

        {/* Fallback 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
