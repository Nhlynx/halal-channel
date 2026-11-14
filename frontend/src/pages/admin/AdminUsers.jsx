import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import {
  UserPlus,
  Users,
  ShieldCheck,
  Mail,
  Calendar,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Search,
} from 'lucide-react';

const AdminUsers = () => {
  useDocumentTitle('Kelola Pengguna');

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // State Modal Tambah Admin Baru
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    namaLengkap: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const fetchUsers = useCallback(async () => {
    try {
      const res = await api.get('/admin/users');
      if (res.data && res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error('Error memuat data admin:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    api.get('/admin/users')
      .then((res) => {
        if (!ignore && res.data?.success) {
          setUsers(res.data.data);
        }
      })
      .catch((err) => {
        console.error('Gagal mengambil daftar admin:', err);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleOpenModal = () => {
    setFormData({
      namaLengkap: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    setFormError('');
    setSuccessMessage('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Validasi Client-Side sesuai Matriks SOT Bagian 6.1
    if (!formData.namaLengkap.trim() || formData.namaLengkap.trim().length < 3) {
      setFormError('Nama lengkap wajib diisi minimal 3 karakter.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      setFormError('Masukkan format alamat email yang valid.');
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      setFormError('Password wajib diisi minimal 6 karakter.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError('Konfirmasi password tidak cocok dengan password yang dimasukkan.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/admin/users', {
        namaLengkap: formData.namaLengkap.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      if (res.data && res.data.success) {
        setSuccessMessage('Akun Admin baru berhasil didaftarkan ke sistem.');
        fetchUsers();
        setTimeout(() => {
          setIsModalOpen(false);
        }, 1200);
      }
    } catch (err) {
      setFormError(
        err.response?.data?.message || 'Gagal menambahkan akun admin. Periksa koneksi backend.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const filteredUsers = users.filter((admin) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      admin.namaLengkap?.toLowerCase().includes(query) ||
      admin.email?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-8">
      {/* Header Modul dengan daisyUI Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-[#f9f6ef] tracking-tight flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#1b6a54]/10 dark:bg-[#1b6a54]/30 text-[#1b6a54] dark:text-[#dec684]">
              <Users className="w-7 h-7" />
            </div>
            <span>Manajemen Akun Pengguna</span>
          </h2>
          <p className="text-base text-slate-600 dark:text-[#dec684]/80 mt-1.5 font-medium">
            Pengelolaan akun pengguna internal portal Halal Channel.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenModal}
          className="btn bg-[#1b6a54] hover:bg-[#145241] text-[#f9f6ef] border-none text-sm font-bold h-auto py-3 px-5 rounded-2xl shadow-md hover:shadow-lg transition duration-150 gap-2"
        >
          <UserPlus className="w-5 h-5 text-[#dec684]" />
          <span>Tambah Pengguna Baru</span>
        </button>
      </div>

      {/* Banner Kebijakan Keamanan Internal dengan daisyUI Card */}
      <div className="card card-bordered bg-[#1b6a54]/10 dark:bg-[#14231e] border-[#1b6a54]/20 dark:border-[#223831] rounded-3xl p-5 shadow-xs">
        <div className="flex items-start gap-4 text-sm text-[#1b6a54] dark:text-[#dec684]">
          <div className="p-2 rounded-xl bg-[#1b6a54]/15 dark:bg-[#1b6a54]/30 flex-shrink-0 mt-0.5">
            <ShieldCheck className="w-6 h-6 text-[#1b6a54] dark:text-[#dec684]" />
          </div>
          <div className="leading-relaxed">
            <span className="font-extrabold text-[#1b6a54] dark:text-[#f9f6ef]">Kebijakan Keamanan Internal:</span> Pendaftaran akun administrator hanya dapat dilakukan secara internal oleh admin terotorisasi di halaman ini. Akun yang didaftarkan secara otomatis memiliki hak akses penuh ke seluruh modul CMS Halal Channel.
          </div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="card card-bordered bg-white dark:bg-[#14231e] rounded-3xl border-[#e8dfcf] dark:border-[#223831] shadow-xs">
        <div className="card-body p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <label className="input input-bordered flex items-center gap-2 h-auto px-4 py-2.5 rounded-2xl bg-white dark:bg-[#1a2d27] border-slate-300 dark:border-[#28443b] focus-within:border-[#1b6a54] flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama atau email admin..."
                className="grow text-sm text-slate-800 dark:text-slate-200 bg-transparent outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </label>

            <div className="badge bg-[#1b6a54]/10 dark:bg-[#1b6a54]/30 text-[#1b6a54] dark:text-[#dec684] border-none font-bold text-xs py-3 px-3.5 rounded-xl self-start sm:self-auto">
              Total: {filteredUsers.length} Admin
            </div>
          </div>
        </div>
      </div>

      {/* Tabel Data Akun Admin dengan daisyUI Table & Card */}
      <div className="card card-bordered bg-white dark:bg-[#14231e] rounded-3xl border-[#e8dfcf] dark:border-[#223831] shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin mx-auto text-[#1b6a54] dark:text-[#dec684] mb-3" />
            <p className="text-sm font-semibold">Memuat daftar admin terdaftar...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full text-left">
              <thead>
                <tr className="bg-[#f9f6ef]/80 dark:bg-[#162722] border-b border-[#e8dfcf] dark:border-[#223831] text-xs font-extrabold text-[#a08145] dark:text-[#dec684] uppercase tracking-wider">
                  <th className="py-4 px-5">Nama Lengkap Admin</th>
                  <th className="py-4 px-5">Email Terdaftar</th>
                  <th className="py-4 px-5">Peran (Role)</th>
                  <th className="py-4 px-5">Tanggal Pendaftaran</th>
                  <th className="py-4 px-5 text-right">Status Sesi</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((admin) => (
                    <tr key={admin.id} className="hover:bg-[#f9f6ef]/40 dark:hover:bg-[#1a2d27]/70 transition">
                      <td className="py-4 px-5 font-bold text-slate-900 dark:text-[#f9f6ef]">
                        <div className="flex items-center gap-3">
                          <div className="avatar placeholder">
                            <div className="w-10 h-10 rounded-2xl bg-[#1b6a54] text-[#f9f6ef] font-black text-sm shadow-sm flex items-center justify-center">
                              {admin.namaLengkap ? admin.namaLengkap.charAt(0).toUpperCase() : 'A'}
                            </div>
                          </div>
                          <div>
                            <span className="text-base font-extrabold block">{admin.namaLengkap}</span>
                            <span className="text-xs text-slate-400 font-normal">ID: {admin.id.slice(0, 8)}...</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-slate-700 dark:text-slate-300">
                        <div className="flex items-center gap-2 font-semibold">
                          <Mail className="w-4 h-4 text-[#a08145] dark:text-[#dec684]" />
                          <span>{admin.email}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <span className="badge font-extrabold text-xs uppercase px-3 py-2.5 rounded-full bg-[#1b6a54]/15 text-[#1b6a54] dark:text-[#dec684] border-[#1b6a54]/30 gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{admin.role || 'Admin'}</span>
                        </span>
                      </td>
                      <td className="py-4 px-5 text-slate-500 dark:text-slate-400 font-mono text-xs">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span>{new Date(admin.createdAt).toLocaleDateString('id-ID', { dateStyle: 'medium' })}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <span className="badge font-bold text-xs bg-[#1b6a54]/10 dark:bg-[#1b6a54]/30 text-[#1b6a54] dark:text-[#dec684] border-none px-3 py-2 rounded-xl">
                          Aktif & Terverifikasi
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-16 text-center font-medium">
                      <div className="flex flex-col items-center gap-3 text-slate-400 dark:text-slate-500">
                        <Users className="w-10 h-10 opacity-30" />
                        <span>
                          {searchQuery
                            ? 'Tidak ada akun admin yang cocok dengan pencarian.'
                            : 'Tidak ada akun admin yang ditemukan.'}
                        </span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Formulir Tambah Admin Baru dengan daisyUI Modal */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box w-full max-w-lg bg-white dark:bg-[#14231e] rounded-3xl border border-[#e8dfcf] dark:border-[#223831] shadow-2xl p-7 sm:p-9 relative text-slate-800 dark:text-[#f9f6ef]">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn btn-sm btn-ghost btn-circle absolute top-6 right-6 text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-[#1b6a54]/10 dark:bg-[#1b6a54]/30 text-[#1b6a54] dark:text-[#dec684] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                <UserPlus className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-[#f9f6ef]">
                Tambah Pengguna Baru
              </h3>
              <p className="text-sm text-slate-500 dark:text-[#dec684]/80 mt-1 font-medium">
                Kredensial akun internal akan disimpan terenkripsi dengan aman di database.
              </p>
            </div>

            {formError && (
              <div className="alert alert-error mb-5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-sm flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                <span>{formError}</span>
              </div>
            )}

            {successMessage && (
              <div className="alert alert-success mb-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-sm flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-[#1b6a54] dark:text-[#dec684]" />
                <span className="font-semibold">{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  Nama Lengkap Administrator *
                </label>
                <input
                  type="text"
                  required
                  value={formData.namaLengkap}
                  onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value })}
                  placeholder="Contoh: Admin Riset Halal"
                  className="input input-bordered w-full px-4 py-3 h-auto rounded-2xl border-slate-300 dark:border-[#28443b] text-slate-900 dark:text-white bg-white dark:bg-[#1a2d27] focus:border-[#1b6a54]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  Alamat Email Resmi *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="admin.riset@rpnn.depok.go.id"
                  className="input input-bordered w-full px-4 py-3 h-auto rounded-2xl border-slate-300 dark:border-[#28443b] text-slate-900 dark:text-white bg-white dark:bg-[#1a2d27] focus:border-[#1b6a54]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  Password Baru *
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Minimal 6 karakter"
                  className="input input-bordered w-full px-4 py-3 h-auto rounded-2xl border-slate-300 dark:border-[#28443b] text-slate-900 dark:text-white bg-white dark:bg-[#1a2d27] focus:border-[#1b6a54]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  Konfirmasi Password *
                </label>
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Ulangi password baru"
                  className="input input-bordered w-full px-4 py-3 h-auto rounded-2xl border-slate-300 dark:border-[#28443b] text-slate-900 dark:text-white bg-white dark:bg-[#1a2d27] focus:border-[#1b6a54]"
                />
              </div>

              <div className="modal-action pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-ghost px-5 py-2.5 rounded-2xl text-slate-600 dark:text-slate-300 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn bg-[#1b6a54] hover:bg-[#145241] text-[#f9f6ef] border-none font-bold px-6 py-3 rounded-2xl shadow-md gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Daftarkan Pengguna</span>
                </button>
              </div>
            </form>
          </div>
          <div className="modal-backdrop bg-slate-900/60" onClick={() => setIsModalOpen(false)}></div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
