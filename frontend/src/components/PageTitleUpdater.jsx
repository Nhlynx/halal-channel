import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Pemetaan judul tab browser berdasarkan path rute aplikasi.
 */
const ROUTE_TITLES = {
  '/': 'Halal Channel',
  '/login': 'Login Admin',
  '/forgot-password': 'Lupa Password',
  '/admin': 'Dashboard Admin',
  '/admin/dashboard': 'Dashboard Admin',
  '/admin/edukasi': 'Konten Artikel Edukasi',
  '/admin/resep': 'Resep Halal',
  '/admin/kuliner': 'Kuliner & Resto Korea',
  '/admin/wisata': 'Wisata Halal',
  '/admin/media': 'Media Podcast & Shorts',
  '/admin/users': 'Kelola Admin',
  '/admin/logs': 'Audit Log',
};

/**
 * Otomatis menghasilkan judul yang rapi untuk rute masa depan yang belum terdaftar di ROUTE_TITLES.
 * Contoh: /admin/sertifikat-halal -> 'Sertifikat Halal - Admin'
 */
const generateFallbackTitle = (pathname) => {
  if (!pathname || pathname === '/') return 'Halal Channel';

  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return 'Halal Channel';

  const lastSegment = segments[segments.length - 1];
  const formatted = lastSegment
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return segments.includes('admin') ? `${formatted} - Admin` : formatted;
};

/**
 * Komponen listener rute yang otomatis memperbarui `document.title` setiap kali pengguna berpindah halaman.
 */
export const PageTitleUpdater = () => {
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname.replace(/\/$/, '') || '/';
    const title = ROUTE_TITLES[currentPath] || generateFallbackTitle(currentPath);
    document.title = title;
  }, [location.pathname]);

  return null;
};

export default PageTitleUpdater;

