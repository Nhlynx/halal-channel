import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import {
  Plus,
  BookOpen,
  Edit2,
  Trash2,
  X,
  Loader2,
  AlertTriangle,
  Search,
  Filter,
} from 'lucide-react';

import ImageInput from '../../components/ui/ImageInput';

const AdminEdukasi = () => {
  useDocumentTitle('Konten Artikel Edukasi');

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [kategoriFilter, setKategoriFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const [formData, setFormData] = useState({
    judul: '',
    kategori: 'Sains Pangan',
    penulis: '',
    ringkasan: '',
    isiKonten: '',
    statusPublikasi: 'PUBLISHED',
    foto: '',
  });

  const fetchData = useCallback(async () => {
    try {
      const res = await api.get('/admin/edukasi');
      if (res.data && res.data.success) {
        setItems(res.data.data);
      }
    } catch (err) {
      console.error('Error memuat data edukasi:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    api.get('/admin/edukasi')
      .then((res) => {
        if (!ignore && res.data?.success) {
          setItems(res.data.data);
        }
      })
      .catch((err) => {
        console.error('Gagal mengambil data edukasi:', err);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      judul: '',
      kategori: 'Sains Pangan',
      penulis: '',
      ringkasan: '',
      isiKonten: '',
      statusPublikasi: 'PUBLISHED',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      judul: item.judul || '',
      kategori: item.kategori || 'Sains Pangan',
      penulis: item.penulis || '',
      ringkasan: item.ringkasan || '',
      isiKonten: item.isiKonten || '',
      statusPublikasi: item.statusPublikasi || 'PUBLISHED',
      foto: item.foto || '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Yakin ingin menghapus artikel '${title}'?`)) return;
    try {
      await api.delete(`/admin/edukasi/${id}`);
      fetchData();
    } catch {
      alert('Gagal menghapus artikel.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.judul.trim()) {
      setFormError('Judul artikel wajib diisi.');
      return;
    }

    setSubmitting(true);
    setFormError('');
    try {
      if (editingItem) {
        await api.put(`/admin/edukasi/${editingItem.id}`, formData);
      } else {
        await api.post('/admin/edukasi', formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Terjadi kesalahan saat menyimpan data.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchKategori = kategoriFilter === 'ALL' ? true : item.kategori === kategoriFilter;
    const matchSearch = searchQuery.trim() === ''
      ? true
      : item.judul?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.penulis?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchKategori && matchSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header Modul dengan daisyUI Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-[#f9f6ef] tracking-tight flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#1b6a54]/10 dark:bg-[#1b6a54]/30 text-[#1b6a54] dark:text-[#dec684]">
              <BookOpen className="w-7 h-7" />
            </div>
            <span>Manajemen Artikel Edukasi Sains Pangan</span>
          </h2>
          <p className="text-base text-slate-600 dark:text-[#dec684]/80 mt-1.5 font-medium">
            Publikasi artikel titik kritis bahan baku, telaah hukum syariat, dan edukasi konsumsi thayyib.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="btn bg-[#1b6a54] hover:bg-[#145241] text-[#f9f6ef] border-none text-sm font-bold h-auto py-3 px-5 rounded-2xl shadow-md hover:shadow-lg transition duration-150 gap-2"
        >
          <Plus className="w-5 h-5 text-[#dec684]" />
          <span>Tulis Artikel Baru</span>
        </button>
      </div>

      {/* Filter Bar — Search + Kategori */}
      <div className="card card-bordered bg-white dark:bg-[#14231e] rounded-3xl border-[#e8dfcf] dark:border-[#223831] shadow-xs">
        <div className="card-body p-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Search Input */}
            <label className="input input-bordered flex items-center gap-2 flex-1 h-auto px-4 py-2.5 rounded-2xl bg-white dark:bg-[#1a2d27] border-slate-300 dark:border-[#28443b] focus-within:border-[#1b6a54]">
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari judul atau penulis..."
                className="grow text-sm text-slate-800 dark:text-slate-200 bg-transparent outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </label>

            {/* Divider (hidden on mobile) */}
            <div className="hidden sm:block w-px h-8 bg-slate-200 dark:bg-[#28443b]" />

            {/* Filter Kategori */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <Filter className="w-3.5 h-3.5" />
                <span>Kategori</span>
              </div>
              <select
                value={kategoriFilter}
                onChange={(e) => setKategoriFilter(e.target.value)}
                className="select select-bordered px-3 py-2 h-auto rounded-2xl text-sm font-medium text-slate-800 dark:text-slate-200 bg-white dark:bg-[#1a2d27] border-slate-300 dark:border-[#28443b] focus:border-[#1b6a54] min-w-[180px]"
              >
                <option value="ALL">Semua Kategori</option>
                <option value="Sains Pangan">Sains Pangan</option>
                <option value="Hukum Syariat">Hukum Syariat</option>
                <option value="Uji Lab & Mitos">Uji Lab & Mitos</option>
                <option value="Survival Guide">Survival Guide</option>
              </select>
            </div>

            {/* Result Count Badge */}
            {(searchQuery || kategoriFilter !== 'ALL') && (
              <div className="badge bg-[#1b6a54]/10 dark:bg-[#1b6a54]/30 text-[#1b6a54] dark:text-[#dec684] border-none font-bold text-xs py-3 px-3 rounded-xl flex-shrink-0">
                {filteredItems.length} hasil
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabel Artikel dengan daisyUI Table & Card */}
      <div className="card card-bordered bg-white dark:bg-[#14231e] rounded-3xl border-[#e8dfcf] dark:border-[#223831] shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin mx-auto text-[#1b6a54] dark:text-[#dec684] mb-3" />
            <p className="text-sm font-semibold">Memuat daftar artikel...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full text-left">
              <thead>
                <tr className="bg-[#f9f6ef]/80 dark:bg-[#162722] border-b border-[#e8dfcf] dark:border-[#223831] text-xs font-extrabold text-[#a08145] dark:text-[#dec684] uppercase tracking-wider">
                  <th className="py-4 px-5">Judul Artikel & Slug</th>
                  <th className="py-4 px-5">Kategori</th>
                  <th className="py-4 px-5">Penulis / Reviewer</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-[#f9f6ef]/40 dark:hover:bg-[#1a2d27]/70 transition">
                      <td className="py-4 px-5 max-w-md">
                        <div className="font-extrabold text-slate-900 dark:text-[#f9f6ef] text-base leading-snug">{item.judul}</div>
                        <div className="text-xs text-slate-400 font-mono mt-1 truncate">
                          /{item.slug}
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <span className="badge badge-sm font-bold text-[#1b6a54] dark:text-[#dec684] bg-[#1b6a54]/10 dark:bg-[#1b6a54]/30 border-none">
                          {item.kategori}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-slate-700 dark:text-slate-300 font-semibold">
                        {item.penulis}
                      </td>
                      <td className="py-4 px-5">
                        <span
                          className={`badge font-bold text-xs uppercase px-3 py-2.5 rounded-full border-none ${
                            item.statusPublikasi === 'PUBLISHED'
                              ? 'bg-[#1b6a54] text-[#f9f6ef]'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {item.statusPublikasi}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="btn btn-sm btn-ghost btn-circle text-slate-600 dark:text-slate-300 hover:text-[#1b6a54] dark:hover:text-[#dec684]"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id, item.judul)}
                            className="btn btn-sm btn-ghost btn-circle text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-16 text-center font-medium">
                      <div className="flex flex-col items-center gap-3 text-slate-400 dark:text-slate-500">
                        <BookOpen className="w-10 h-10 opacity-30" />
                        <span>
                          {searchQuery || kategoriFilter !== 'ALL'
                            ? 'Tidak ada artikel yang cocok dengan filter.'
                            : 'Belum ada artikel edukasi yang terdaftar.'}
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

      {/* Modal Form Tambah / Edit dengan daisyUI Modal */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box w-full max-w-2xl bg-white dark:bg-[#14231e] rounded-3xl border border-[#e8dfcf] dark:border-[#223831] shadow-2xl p-7 sm:p-9 relative text-slate-800 dark:text-[#f9f6ef]">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn btn-sm btn-ghost btn-circle absolute top-6 right-6 text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-black text-slate-900 dark:text-[#f9f6ef] mb-1.5">
              {editingItem ? 'Edit Artikel Edukasi' : 'Tulis Artikel Edukasi Baru'}
            </h3>
            <p className="text-sm text-slate-500 dark:text-[#dec684] mb-6">
              Publikasikan kajian sains pangan, kepatuhan syariat, atau panduan survival halal.
            </p>

            {formError && (
              <div className="alert alert-error mb-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-sm font-medium flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 text-sm">
              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2">
                  Judul Artikel *
                </label>
                <input
                  type="text"
                  required
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  placeholder="Contoh: Titik Kritis Bahan Baku Halal pada Makanan Olahan"
                  className="input input-bordered w-full px-4 py-3 h-auto rounded-2xl border-slate-300 dark:border-[#28443b] bg-white dark:bg-[#1a2d27] text-slate-900 dark:text-white focus:border-[#1b6a54]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2">
                    Kategori Edukasi
                  </label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                    className="select select-bordered w-full px-4 py-3 h-auto rounded-2xl border-slate-300 dark:border-[#28443b] bg-white dark:bg-[#1a2d27] text-slate-900 dark:text-white focus:border-[#1b6a54]"
                  >
                    <option value="Sains Pangan">Sains Pangan</option>
                    <option value="Hukum Syariat">Hukum Syariat</option>
                    <option value="Uji Lab & Mitos">Uji Lab & Mitos</option>
                    <option value="Survival Guide">Survival Guide</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2">
                    Penulis / Reviewer
                  </label>
                  <input
                    type="text"
                    value={formData.penulis}
                    onChange={(e) => setFormData({ ...formData, penulis: e.target.value })}
                    placeholder="Contoh: Dr. Ir. Siti Halimah, M.Sc."
                    className="input input-bordered w-full px-4 py-3 h-auto rounded-2xl border-slate-300 dark:border-[#28443b] bg-white dark:bg-[#1a2d27] text-slate-900 dark:text-white focus:border-[#1b6a54]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2">
                  Ringkasan / Excerpt (Maks. 250 Karakter)
                </label>
                <textarea
                  rows="2"
                  value={formData.ringkasan}
                  onChange={(e) => setFormData({ ...formData, ringkasan: e.target.value })}
                  placeholder="Uraian ringkas intisari artikel..."
                  className="textarea textarea-bordered w-full px-4 py-3 rounded-2xl border-slate-300 dark:border-[#28443b] bg-white dark:bg-[#1a2d27] text-slate-900 dark:text-white focus:border-[#1b6a54]"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2">
                  Isi Konten Utama
                </label>
                <textarea
                  rows="6"
                  value={formData.isiKonten}
                  onChange={(e) => setFormData({ ...formData, isiKonten: e.target.value })}
                  placeholder="Ketik isi artikel atau format teks di sini..."
                  className="textarea textarea-bordered w-full px-4 py-3 rounded-2xl border-slate-300 dark:border-[#28443b] bg-white dark:bg-[#1a2d27] text-slate-900 dark:text-white focus:border-[#1b6a54] font-sans"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2">
                  Status Publikasi
                </label>
                <select
                  value={formData.statusPublikasi}
                  onChange={(e) => setFormData({ ...formData, statusPublikasi: e.target.value })}
                  className="select select-bordered w-full px-4 py-3 h-auto rounded-2xl border-slate-300 dark:border-[#28443b] bg-white dark:bg-[#1a2d27] text-slate-900 dark:text-white focus:border-[#1b6a54]"
                >
                  <option value="PUBLISHED">PUBLISHED (Tayang Publik)</option>
                  <option value="DRAFT">DRAFT (Arsip Konsep)</option>
                </select>
              </div>

              <ImageInput
                label="Foto Thumbnail Artikel"
                value={formData.foto}
                onChange={(val) => setFormData({ ...formData, foto: val })}
                placeholder="https://images.unsplash.com/photo-...?w=800&q=80"
              />

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
                  <span>{editingItem ? 'Simpan Perubahan' : 'Terbitkan Artikel'}</span>
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

export default AdminEdukasi;
