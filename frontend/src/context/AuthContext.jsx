/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Sinkronisasi token & verifikasi sesi saat pertama kali aplikasi dimuat
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        // Pasang default Authorization header pada Axios
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        try {
          // Validasi token dan ambil profil user terbaru dari server
          const response = await api.get('/auth/me');
          if (response.data && response.data.success) {
            const userData = response.data.data;
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          }
        } catch (error) {
          console.warn('Sesi kedaluwarsa atau tidak valid, membersihkan status auth:', error);
          // Jika token tidak valid, bersihkan sesi
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          delete api.defaults.headers.common['Authorization'];
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Fungsi Login
   * Menyimpan token & user ke state & localStorage, menyetel Authorization header Axios,
   * dan mengarahkan ke rute yang sesuai berdasarkan role pengguna.
   *
   * @param {Object} userData - Data profil pengguna (harus mengandung role.namaRole)
   * @param {string} authToken - Token JWT yang diterbitkan backend
   */
  const login = (userData, authToken) => {
    setToken(authToken);
    setUser(userData);

    // Simpan ke localStorage
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));

    // Pasang header Authorization pada Axios
    api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

    // Redirect & notifikasi berdasarkan role
    const roleName = userData?.role?.namaRole || '';
    if (roleName.toLowerCase() === 'admin') {
      toast.success('Selamat datang Admin!');
      navigate('/admin/dashboard', { replace: true });
    } else {
      toast.success('Login berhasil!');
      navigate('/', { replace: true });
    }
  };

  /**
   * Fungsi Logout
   * Menghapus kredensial, token, dan sesi aktif serta mengarahkan ke halaman login.
   */
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];

    setUser(null);
    setToken(null);

    // Alihkan ke rute login
    navigate('/login', { replace: true });
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(token && user),
    isAdmin: Boolean(user?.role?.namaRole?.toLowerCase() === 'admin'),
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom Hook untuk mempermudah konsumsi AuthContext di seluruh komponen
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
