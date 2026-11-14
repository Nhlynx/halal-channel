import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import {
  Plus,
  Compass,
  MapPin,
  Clock,
  CheckCircle,
  Edit2,
  Trash2,
  X,
  Loader2,
  AlertTriangle,
  Search,
  Filter,
} from 'lucide-react';
import ImageInput from '../../components/ui/ImageInput';

const AdminWisata = () => {
  useDocumentTitle('Wisata Halal');

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [kategoriFilter, setKategoriFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const [formData, setFormData] = useState({
    namaDestinasi: '',
    kategoriWisata: 'Wisata Alam',
    lokasi: '',
    kecamatan: 'Sawangan',
    jamBuka: '08:00 - 17:00 WIB',
    hargaTiket: 'Gratis',
    deskripsi: '',
    statusVerifikasi: 'VERIFIED',
    fasilitas: ['Musholla Bersih', 'Tempat Wudhu Terpisah', 'Kuliner Halal'],
    foto: '',
  });

  const availableFacilities = [
    'Musholla Bersih',
    'Tempat Wudhu Terpisah',
    'Kuliner Halal',
    'Toilet Ramah Muslim',
  ];

  const fetchData = useCallback(async () => {
    try {
      const res = await api.get('/admin/wisata');
      if (res.data && res.data.success) {
        setItems(res.data.data);
      }
    } catch (err) {
      console.error('Error memuat data wisata:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    api.get('/admin/wisata')
      .then((res) => {
        if (!ignore && res.data?.success) {
          setItems(res.data.data);
        }
      })
      .catch((err) => {
        console.error('Gagal mengambil wisata:', err);
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
      namaDestinasi: '',
      kategoriWisata: 'Wisata Alam',
      lokasi: '',
      kecamatan: 'Sawangan',
      jamBuka: '08:00 - 17:00 WIB',
      hargaTiket: 'Gratis',
      deskripsi: '',
      statusVerifikasi: 'VERIFIED',
      fasilitas: ['Musholla Bersih', 'Tempat Wudhu Terpisah', 'Kuliner Halal'],
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      namaDestinasi: item.namaDestinasi || '',
      kategoriWisata: item.kategoriWisata || 'Wisata Alam',
      lokasi: item.lokasi || '',
      kecamatan: item.kecamatan || 'Sawangan',
      jamBuka: item.jamBuka || '08:00 - 17:00 WIB',
      hargaTiket: item.hargaTiket || 'Gratis',
      deskripsi: item.deskripsi || '',
      statusVerifikasi: item.statusVerifikasi || 'VERIFIED',
      fasilitas: Array.isArray(item.fasilitas) ? item.fasilitas : [],
      foto: item.foto || item.fotoDestinasi || '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Yakin ingin menghapus destinasi '${title}'?`)) return;
    try {
      await api.delete(`/admin/wisata/${id}`);
      fetchData();
    } catch {
      alert('Gagal menghapus destinasi wisata.');
    }
  };

  const handleToggleFacility = (fac) => {
    setFormData((prev) => {
      const exists = prev.fasilitas.includes(fac);
      return {
        ...prev,
        fasilitas: exists
          ? prev.fasilitas.filter((f) => f !== fac)
          : [...prev.fasilitas, fac],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.namaDestinasi.trim()) {
      setFormError('Nama destinasi wisata halal wajib diisi.');
      return;
    }

    setSubmitting(true);
    setFormError('');
    try {
      if (editingItem) {
        await api.put(`/admin/wisata/${editingItem.id}`, formData);
      } else {
        await api.post('/admin/wisata', formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Gagal menyimpan destinasi wisata.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchKategori = kategoriFilter === 'ALL' ? true : item.kategoriWisata === kategoriFilter;
    const matchSearch = searchQuery.trim() === ''
      ? true
      : item.namaDestinasi?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.lokasi?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.kecamatan?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchKategori && matchSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header Modul dengan daisyUI Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-[#f9f6ef] tracking-tight flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#1b6a54]/10 dark:bg-[#1b6a54]/30 text-[#1b6a54] dark:text-[#dec684]">
              <Compass className="w-7 h-7" />
            </div>
            <span>Manajemen Destinasi Wisata Halal</span>
          </h2>
          <p className="text-base text-slate-600 dark:text-[#dec684]/80 mt-1.5 font-medium">
            Katalog objek wisata ramah Muslim dan verifikasi ketersediaan fasilitas ibadah di Kota Depok.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="btn bg-[#1b6a54] hover:bg-[#145241] text-[#f9f6ef] border-none text-sm font-bold h-auto py-3 px-5 rounded-2xl shadow-md hover:shadow-lg transition duration-150 gap-2"
        >
          <Plus className="w-5 h-5 text-[#dec684]" />
          <span>Tambah Destinasi Wisata</span>
        </button>
      </div>

      {/* Filter Bar — Search + Kategori Wisata */}
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
                placeholder="Cari destinasi, lokasi, atau kecamatan..."
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

            {/* Filter Kategori Wisata */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <Filter className="w-3.5 h-3.5" />
                <span>Kategori</span>
              </div>
              <select
                value={kategoriFilter}
                onChange={(e) => setKategoriFilter(e.target.value)}
                className="select select-bordered px-3 py-2 h-auto rounded-2xl text-sm font-medium text-slate-800 dark:text-slate-200 bg-white dark:bg-[#1a2d27] border-slate-300 dark:border-[#28443b] focus:border-[#1b6a54] min-w-[190px]"
              >
                <option value="ALL">Semua Kategori</option>
                <option value="Wisata Alam">Wisata Alam</option>
                <option value="Wisata Religi">Wisata Religi</option>
                <option value="Taman & Rekreasi">Taman & Rekreasi</option>
                <option value="Cagar Budaya">Cagar Budaya</option>
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

      {/* Tabel Data Wisata dengan daisyUI Table & Card */}
      <div className="card card-bordered bg-white dark:bg-[#14231e] rounded-3xl border-[#e8dfcf] dark:border-[#223831] shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin mx-auto text-[#1b6a54] dark:text-[#dec684] mb-3" />
            <p className="text-sm font-semibold">Memuat katalog wisata...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full text-left">
              <thead>
                <tr className="bg-[#f9f6ef]/80 dark:bg-[#162722] border-b border-[#e8dfcf] dark:border-[#223831] text-xs font-extrabold text-[#a08145] dark:text-[#dec684] uppercase tracking-wider">
                  <th className="py-4 px-5">Destinasi & Kategori</th>
                  <th className="py-4 px-5">Lokasi & Kecamatan</th>
                  <th className="py-4 px-5">Fasilitas Ibadah</th>
                  <th className="py-4 px-5">Tiket & Jam Operasional</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-[#f9f6ef]/40 dark:hover:bg-[#1a2d27]/70 transition">
                      <td className="py-4 px-5 max-w-xs">
                        <div className="font-extrabold text-slate-900 dark:text-[#f9f6ef] text-base">
                          {item.namaDestinasi}
                        </div>
                        <span className="badge badge-sm font-bold text-[#1b6a54] dark:text-[#dec684] bg-[#1b6a54]/10 dark:bg-[#1b6a54]/30 border-none mt-1">
                          {item.kategoriWisata}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-slate-700 dark:text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-[#a08145] dark:text-[#dec684] flex-shrink-0" />
                          <span className="truncate max-w-xs font-medium">{item.lokasi} ({item.kecamatan})</span>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex flex-wrap gap-1.5 max-w-xs">
                          {Array.isArray(item.fasilitas) &&
                            item.fasilitas.map((f, idx) => (
                              <span
                                key={idx}
                                className="badge badge-sm bg-[#f9f6ef] dark:bg-[#1a2d27] text-slate-700 dark:text-[#dec684] border-[#e8dfcf] dark:border-[#223831] font-semibold"
                              >
                                {f}
                              </span>
                            ))}
                        </div>
                      </td>
                      <td className="py-4 px-5 text-slate-700 dark:text-slate-300">
                        <div className="font-extrabold text-slate-900 dark:text-white">{item.hargaTiket}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.jamBuka}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <span className="badge font-extrabold text-xs uppercase px-3 py-2.5 rounded-full bg-[#1b6a54] text-[#f9f6ef] border-none gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>{item.statusVerifikasi}</span>
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="btn btn-sm btn-ghost btn-circle text-slate-600 dark:text-slate-300 hover:text-[#1b6a54] dark:hover:text-[#dec684]"
                            title="Edit Wisata"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id, item.namaDestinasi)}
                            className="btn btn-sm btn-ghost btn-circle text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400"
                            title="Hapus Wisata"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-16 text-center font-medium">
                      <div className="flex flex-col items-center gap-3 text-slate-400 dark:text-slate-500">
                        <Compass className="w-10 h-10 opacity-30" />
                        <span>
                          {searchQuery || kategoriFilter !== 'ALL'
                            ? 'Tidak ada destinasi wisata yang cocok dengan filter.'
                            : 'Belum ada objek wisata ramah Muslim yang terdaftar.'}
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
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-[#f9f6ef]">
                {editingItem ? 'Edit Destinasi Wisata Halal' : 'Tambah Destinasi Wisata Baru'}
              </h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-[#dec684]/80 mb-6 font-medium">
              Kelola destinasi wisata ramah Muslim lengkap dengan fasilitas ibadah pendukung.
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
                  Nama Destinasi Wisata *
                </label>
                <input
                  type="text"
                  required
                  value={formData.namaDestinasi}
                  onChange={(e) => setFormData({ ...formData, namaDestinasi: e.target.value })}
                  placeholder="Contoh: Situ Pengasinan Wisata Religi Depok"
                  className="input input-bordered w-full px-4 py-3 h-auto rounded-2xl border-slate-300 dark:border-[#28443b] text-slate-900 dark:text-white bg-white dark:bg-[#1a2d27] focus:border-[#1b6a54]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2">
                    Kategori Wisata
                  </label>
                  <select
                    value={formData.kategoriWisata}
                    onChange={(e) => setFormData({ ...formData, kategoriWisata: e.target.value })}
                    className="select select-bordered w-full px-4 py-3 h-auto rounded-2xl border-slate-300 dark:border-[#28443b] text-slate-800 dark:text-slate-200 bg-white dark:bg-[#1a2d27] focus:border-[#1b6a54] font-medium"
                  >
                    <option value="Wisata Alam">Wisata Alam</option>
                    <option value="Wisata Sejarah & Warisan Islam">Wisata Sejarah & Warisan Islam</option>
                    <option value="Wisata Keluarga">Wisata Keluarga</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2">
                    Kecamatan Depok
                  </label>
                  <select
                    value={formData.kecamatan}
                    onChange={(e) => setFormData({ ...formData, kecamatan: e.target.value })}
                    className="select select-bordered w-full px-4 py-3 h-auto rounded-2xl border-slate-300 dark:border-[#28443b] text-slate-800 dark:text-slate-200 bg-white dark:bg-[#1a2d27] focus:border-[#1b6a54] font-medium"
                  >
                    <option value="Sawangan">Sawangan</option>
                    <option value="Beji">Beji</option>
                    <option value="Pancoran Mas">Pancoran Mas</option>
                    <option value="Cimanggis">Cimanggis</option>
                    <option value="Sukmajaya">Sukmajaya</option>
                    <option value="Cinere">Cinere</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2">
                  Alamat / Lokasi Lengkap
                </label>
                <input
                  type="text"
                  value={formData.lokasi}
                  onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                  placeholder="Jl. Pengasinan Raya, Sawangan, Kota Depok"
                  className="input input-bordered w-full px-4 py-3 h-auto rounded-2xl border-slate-300 dark:border-[#28443b] text-slate-900 dark:text-white bg-white dark:bg-[#1a2d27] focus:border-[#1b6a54]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2">
                    Jam Operasional
                  </label>
                  <input
                    type="text"
                    value={formData.jamBuka}
                    onChange={(e) => setFormData({ ...formData, jamBuka: e.target.value })}
                    placeholder="07:00 - 17:30 WIB"
                    className="input input-bordered w-full px-4 py-3 h-auto rounded-2xl border-slate-300 dark:border-[#28443b] text-slate-900 dark:text-white bg-white dark:bg-[#1a2d27] focus:border-[#1b6a54]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2">
                    Harga Tiket Masuk
                  </label>
                  <input
                    type="text"
                    value={formData.hargaTiket}
                    onChange={(e) => setFormData({ ...formData, hargaTiket: e.target.value })}
                    placeholder="Rp 5.000 / orang atau Gratis"
                    className="input input-bordered w-full px-4 py-3 h-auto rounded-2xl border-slate-300 dark:border-[#28443b] text-slate-900 dark:text-white bg-white dark:bg-[#1a2d27] focus:border-[#1b6a54]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-3">
                  Fasilitas Ibadah & Ramah Muslim
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {availableFacilities.map((fac) => (
                    <label
                      key={fac}
                      className="flex items-center gap-3 p-3 rounded-2xl border border-[#e8dfcf] dark:border-[#28443b] cursor-pointer hover:bg-[#f9f6ef] dark:hover:bg-[#1a2d27] transition select-none"
                    >
                      <input
                        type="checkbox"
                        checked={formData.fasilitas.includes(fac)}
                        onChange={() => handleToggleFacility(fac)}
                        className="checkbox checkbox-sm text-[#1b6a54] rounded-md border-slate-300 dark:border-[#28443b] checked:bg-[#1b6a54]"
                      />
                      <span className="text-slate-800 dark:text-slate-200 font-semibold">{fac}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2">
                  Deskripsi & Daya Tarik
                </label>
                <textarea
                  rows="3"
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  placeholder="Informasi keindahan alam, kegiatan, dan kemudahan fasilitas..."
                  className="textarea textarea-bordered w-full px-4 py-3 rounded-2xl border-slate-300 dark:border-[#28443b] text-slate-900 dark:text-white bg-white dark:bg-[#1a2d27] focus:border-[#1b6a54]"
                ></textarea>
              </div>

              <ImageInput
                label="Foto Destinasi Wisata"
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
                  <span>{editingItem ? 'Simpan Perubahan' : 'Tambah Wisata'}</span>
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

export default AdminWisata;
