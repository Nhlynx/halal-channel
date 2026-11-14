import { useEffect } from 'react';

/**
 * Custom hook untuk mengatur judul tab browser secara reaktif per komponen halaman.
 * Dapat digunakan di halaman mana pun yang dibuat nanti agar judul tab selalu sesuai dengan isi halaman.
 * 
 * @param {string} title - Judul halaman yang ingin ditampilkan di tab browser
 * @param {boolean} [withSuffix=false] - Jika true, menambahkan ' - Halal Channel' di belakang judul
 */
export const useDocumentTitle = (title, withSuffix = false) => {
  useEffect(() => {
    if (!title) return;
    document.title = withSuffix ? `${title} - Halal Channel` : title;
  }, [title, withSuffix]);
};

export default useDocumentTitle;

