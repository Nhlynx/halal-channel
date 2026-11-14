import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import {
  Plus,
  UtensilsCrossed,
  Clock,
  Users,
  Edit2,
  Trash2,
  X,
  Loader2,
  AlertTriangle,
  ChefHat,
  Search,
  Filter,
} from 'lucide-react';

import ImageInput from '../../components/ui/ImageInput';

const AdminResep = () => {
  useDocumentTitle('Resep Halal');

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [kategoriFilter, setKategoriFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const [formData, setFormData] = useState({
    judulResep: '',
    kategoriResep: 'Olahan Sehat',
    porsi: 4,
    waktuMasakMenit: 30,
    tingkatKesulitan: 'Mudah',
    deskripsi: '',
    bahanBahan: '',
    instruksi: '',
    statusPublikasi: 'PUBLISHED',
    foto: '',
  });

  const fetchData = useCallback(async () => {
    try {
      const res = await api.get('/admin/resep');
      if (res.data && res.data.success) {
        setItems(res.data.data);
      }
    } catch (err) {
      console.error('Error memuat data resep:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    api.get('/admin/resep')
      .then((res) => {
        if (!ignore && res.data?.success) {
          setItems(res.data.data);
        }
      })
      .catch((err) => {
        console.error('Gagal mengambil resep:', err);
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
      judulResep: '',
      kategoriResep: 'Olahan Sehat',
      porsi: 4,
      waktuMasakMenit: 30,
      tingkatKesulitan: 'Mudah',
      deskripsi: '',
      bahanBahan: '',
      instruksi: '',
      statusPublikasi: 'PUBLISHED',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      judulResep: item.judulResep || '',
      kategoriResep: item.kategoriResep || 'Olahan Sehat',
      porsi: item.porsi || 4,
      waktuMasakMenit: item.waktuMasakMenit || 30,
      tingkatKesulitan: item.tingkatKesulitan || 'Mudah',
      deskripsi: item.deskripsi || '',
      bahanBahan: item.bahanBahan || '',
      instruksi: item.instruksi || '',
      statusPublikasi: item.statusPublikasi || 'PUBLISHED',
      foto: item.foto || item.fotoResep || '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Yakin ingin menghapus resep '${title}'?`)) return;
    try {
      await api.delete(`/admin/resep/${id}`);
      fetchData();
    } catch {
      alert('Gagal menghapus resep.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.judulResep.trim()) {
      setFormError('Nama resep masakan halal wajib diisi.');
      return;
    }

    setSubmitting(true);
    setFormError('');
    try {
      if (editingItem) {
        await api.put(`/admin/resep/${editingItem.id}`, formData);
      } else {
        await api.post('/admin/resep', formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Gagal menyimpan data resep.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchKategori = kategoriFilter === 'ALL' ? true : item.kategoriResep === kategoriFilter;
    const matchSearch = searchQuery.trim() === ''
      ? true
      : item.judulResep?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.deskripsi?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchKategori && matchSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header Modul dengan daisyUI Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-[#f9f6ef] tracking-tight flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#1b6a54]/10 dark:bg-[#1b6a54]/30 text-[#1b6a54] dark:text-[#dec684]">
              <UtensilsCrossed className="w-7 h-7" />
            </div>
            <span>Manajemen Resep Makanan Halal</span>
          </h2>
          <p className="text-base text-slate-600 dark:text-[#dec684]/80 mt-1.5 font-medium">
            Katalog resep makanan halal sehat, substitusi bahan non-halal, dan inovasi olahan kacang koro pedang Depok.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="btn bg-[#1b6a54] hover:bg-[#145241] text-[#f9f6ef] border-none text-sm font-bold h-auto py-3 px-5 rounded-2xl shadow-md hover:shadow-lg transition duration-150 gap-2"
        >
          <Plus className="w-5 h-5 text-[#dec684]" />
          <span>Tambah Resep Baru</span>
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
                placeholder="Cari resep atau bahan..."
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
                className="select select-bordered px-3 py-2 h-auto rounded-2xl text-sm font-medium text-slate-800 dark:text-slate-200 bg-white dark:bg-[#1a2d27] border-slate-300 dark:border-[#28443b] focus:border-[#1b6a54] min-w-[200px]"
              >
                <option value="ALL">Semua Kategori</option>
                <option value="Olahan Sehat">Olahan Sehat</option>
                <option value="Pangan Lokal / Koro Pedang">Pangan Lokal / Koro Pedang</option>
                <option value="Bebas Bahan Sintetis">Bebas Bahan Sintetis</option>
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

      {/* Tabel Data Resep dengan daisyUI Table & Card */}
      <div className="card card-bordered bg-white dark:bg-[#14231e] rounded-3xl border-[#e8dfcf] dark:border-[#223831] shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin mx-auto text-[#1b6a54] dark:text-[#dec684] mb-3" />
            <p className="text-sm font-semibold">Memuat katalog resep halal...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full text-left">
              <thead>
                <tr className="bg-[#f9f6ef]/80 dark:bg-[#162722] border-b border-[#e8dfcf] dark:border-[#223831] text-xs font-extrabold text-[#a08145] dark:text-[#dec684] uppercase tracking-wider">
                  <th className="py-4 px-5">Nama Resep & Kategori</th>
                  <th className="py-4 px-5">Porsi & Durasi Memasak</th>
                  <th className="py-4 px-5">Tingkat Kesulitan</th>
                  <th className="py-4 px-5">Status Publikasi</th>
                  <th className="py-4 px-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-[#f9f6ef]/40 dark:hover:bg-[#1a2d27]/70 transition">
                      <td className="py-4 px-5 max-w-sm">
                        <div className="font-extrabold text-slate-900 dark:text-[#f9f6ef] text-base">
                          {item.judulResep}
                        </div>
                        <span className="badge badge-sm font-bold text-[#1b6a54] dark:text-[#dec684] bg-[#1b6a54]/10 dark:bg-[#1b6a54]/30 border-none mt-1">
                          {item.kategoriResep}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-slate-700 dark:text-slate-300">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1.5 font-semibold">
                            <Clock className="w-4 h-4 text-[#a08145] dark:text-[#dec684]" />
                            {item.waktuMasakMenit} mnt
                          </span>
                          <span className="flex items-center gap-1.5 font-semibold">
                            <Users className="w-4 h-4 text-slate-400" />
                            {item.porsi} porsi
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <span
                          className={`badge font-bold text-xs uppercase px-3 py-2 rounded-xl border-none ${
                            item.tingkatKesulitan === 'Mudah'
                              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : item.tingkatKesulitan === 'Sedang'
                              ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                              : 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                          }`}
                        >
                          {item.tingkatKesulitan}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <span
                          className={`badge font-extrabold text-xs uppercase px-3 py-2.5 rounded-full border-none ${
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
                            title="Edit Resep"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id, item.judulResep)}
                            className="btn btn-sm btn-ghost btn-circle text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400"
                            title="Hapus Resep"
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
                        <UtensilsCrossed className="w-10 h-10 opacity-30" />
                        <span>
                          {searchQuery || kategoriFilter !== 'ALL'
                            ? 'Tidak ada resep yang cocok dengan filter.'
                            : 'Belum ada katalog resep halal yang terdaftar.'}
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

            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-[#1b6a54]/10 dark:bg-[#1b6a54]/30 text-[#1b6a54] dark:text-[#dec684]">
                <ChefHat className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-[#f9f6ef]">
                {editingItem ? 'Edit Resep Makanan Halal' : 'Tambah Resep Halal Baru'}
              </h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-[#dec684]/80 mb-6 font-medium">
              Isikan takaran bahan dan langkah pengolahan halal yang higienis, bergizi, dan thayyib.
            </p>

            {formError && (
              <div className="alert alert-error mb-5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-sm flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 text-sm">
              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2">
                  Nama Resep Masakan *
                </label>
                <input
                  type="text"
                  required
                  value={formData.judulResep}
                  onChange={(e) => setFormData({ ...formData, judulResep: e.target.value })}
                  placeholder="Contoh: Bulgogi Daging Sapi Saus Apel Halal"
                  className="input input-bordered w-full px-4 py-3 h-auto rounded-2xl border-slate-300 dark:border-[#28443b] text-slate-900 dark:text-white bg-white dark:bg-[#1a2d27] focus:border-[#1b6a54]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2">
                    Kategori Resep
                  </label>
                  <select
                    value={formData.kategoriResep}
                    onChange={(e) => setFormData({ ...formData, kategoriResep: e.target.value })}
                    className="select select-bordered w-full px-4 py-3 h-auto rounded-2xl border-slate-300 dark:border-[#28443b] text-slate-800 dark:text-slate-200 bg-white dark:bg-[#1a2d27] focus:border-[#1b6a54] font-medium"
                  >
                    <option value="Olahan Sehat">Olahan Sehat</option>
                    <option value="Pangan Lokal / Koro Pedang">Pangan Lokal / Koro Pedang</option>
                    <option value="Bebas Bahan Sintetis">Bebas Bahan Sintetis</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2">
                    Porsi Saji (Orang)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.porsi}
                    onChange={(e) => setFormData({ ...formData, porsi: e.target.value })}
                    className="input input-bordered w-full px-4 py-3 h-auto rounded-2xl border-slate-300 dark:border-[#28443b] text-slate-900 dark:text-white bg-white dark:bg-[#1a2d27] focus:border-[#1b6a54]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2">
                    Durasi (Menit)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.waktuMasakMenit}
                    onChange={(e) => setFormData({ ...formData, waktuMasakMenit: e.target.value })}
                    className="input input-bordered w-full px-4 py-3 h-auto rounded-2xl border-slate-300 dark:border-[#28443b] text-slate-900 dark:text-white bg-white dark:bg-[#1a2d27] focus:border-[#1b6a54]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2">
                    Tingkat Kesulitan
                  </label>
                  <select
                    value={formData.tingkatKesulitan}
                    onChange={(e) => setFormData({ ...formData, tingkatKesulitan: e.target.value })}
                    className="select select-bordered w-full px-4 py-3 h-auto rounded-2xl border-slate-300 dark:border-[#28443b] text-slate-800 dark:text-slate-200 bg-white dark:bg-[#1a2d27] focus:border-[#1b6a54] font-medium"
                  >
                    <option value="Mudah">Mudah</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Sulit">Sulit</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2">
                    Status Publikasi
                  </label>
                  <select
                    value={formData.statusPublikasi}
                    onChange={(e) => setFormData({ ...formData, statusPublikasi: e.target.value })}
                    className="select select-bordered w-full px-4 py-3 h-auto rounded-2xl border-slate-300 dark:border-[#28443b] text-slate-800 dark:text-slate-200 bg-white dark:bg-[#1a2d27] focus:border-[#1b6a54] font-medium"
                  >
                    <option value="PUBLISHED">PUBLISHED (Tayang)</option>
                    <option value="DRAFT">DRAFT (Konsep)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2">
                  Deskripsi Ringkas & Manfaat Gizi
                </label>
                <textarea
                  rows="2"
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  placeholder="Catatan kehalalan bahan dan manfaat nutrisi..."
                  className="textarea textarea-bordered w-full px-4 py-3 rounded-2xl border-slate-300 dark:border-[#28443b] text-slate-900 dark:text-white bg-white dark:bg-[#1a2d27] focus:border-[#1b6a54]"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2">
                  Rincian Bahan-Bahan Masakan Halal
                </label>
                <textarea
                  rows="3"
                  value={formData.bahanBahan}
                  onChange={(e) => setFormData({ ...formData, bahanBahan: e.target.value })}
                  placeholder="Contoh: 500g Daging Sapi Halal, 1 Buah Pir Korea parut, 2 sdm Kecap Asin Halal..."
                  className="textarea textarea-bordered w-full px-4 py-3 rounded-2xl border-slate-300 dark:border-[#28443b] text-slate-900 dark:text-white bg-white dark:bg-[#1a2d27] focus:border-[#1b6a54]"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2">
                  Langkah-Langkah Pembuatan
                </label>
                <textarea
                  rows="3"
                  value={formData.instruksi}
                  onChange={(e) => setFormData({ ...formData, instruksi: e.target.value })}
                  placeholder="1. Iris daging tipis. 2. Marinasi dengan bumbu halal selama 30 menit..."
                  className="textarea textarea-bordered w-full px-4 py-3 rounded-2xl border-slate-300 dark:border-[#28443b] text-slate-900 dark:text-white bg-white dark:bg-[#1a2d27] focus:border-[#1b6a54]"
                ></textarea>
              </div>

              <ImageInput
                label="Foto Masakan / Resep"
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
                  <span>{editingItem ? 'Simpan Perubahan' : 'Tambah Resep'}</span>
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

export default AdminResep;
