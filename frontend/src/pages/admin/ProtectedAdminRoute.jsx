import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

/**
 * ProtectedAdminRoute
 * Mengamankan seluruh rute /admin/* agar hanya dapat diakses
 * oleh pengguna yang telah login dan memiliki peran 'Admin'.
 */
const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-600">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mb-3" />
        <p className="text-sm font-medium">Memverifikasi hak akses Administrator...</p>
      </div>
    );
  }

  // Jika belum login, alihkan ke halaman login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verifikasi peran (Role-Based Access Control)
  const roleName = user?.role?.namaRole || user?.roleName || '';
  if (roleName.toLowerCase() !== 'admin') {
    return <Navigate to="/login" state={{ error: 'Akses ditolak. Halaman khusus Administrator.' }} replace />;
  }

  return children;
};

export default ProtectedAdminRoute;

