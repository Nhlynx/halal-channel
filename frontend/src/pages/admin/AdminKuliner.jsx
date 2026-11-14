import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import {
  Plus,
  Search,
  Store,
  CheckCircle,
  Clock,
  AlertTriangle,
  Edit2,
  Trash2,
  X,
  Loader2,
  ShieldCheck,
  MapPin,
  Filter,
} from 'lucide-react';

import ImageInput from '../../components/ui/ImageInput';

const AdminKuliner = () => {
  useDocumentTitle('Kuliner & Resto Korea');

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [kategoriFilter, setKategoriFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // State Modal Form (Tambah / Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const [formData, setFormData] = useState({
    namaRestoran: '',
    kategoriKuliner: 'Restoran Korea Halal',
    statusSertifikasi: 'Terverifikasi BPJPH',
    nomorSertifikatHalal: '',
    alamat: '',
    kecamatan: 'Beji',
    latitude: '-6.3688',
    longitude: '106.8332',
    kisaranHarga: '$$',
    jamOperasional: '10:00 - 22:00 WIB',
    statusVerifikasi: 'VERIFIED',
    foto: '',
  });

  const fetchData = useCallback(async () => {
    try {
      const res = await api.get('/admin/kuliner', {
        params: {
          search: search || undefined,
          kategori: kategoriFilter,
          status: statusFilter,
        },
      });
      if (res.data && res.data.success) {
        setItems(res.data.data);
      }
    } catch (err) {
      console.error('Error saat mengambil data kuliner:', err);
    } finally {
      setLoading(false);
    }
  }, [search, kategoriFilter, statusFilter]);

  useEffect(() => {
    let ignore = false;
    api.get('/admin/kuliner', {
      params: {
        kategori: kategoriFilter,
        status: statusFilter,
      },
    })
      .then((res) => {
        if (!ignore && res.data?.success) {
          setItems(res.data.data);
        }
      })
      .catch((err) => {
        console.error('Gagal mengambil data:', err);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [kategoriFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      namaRestoran: '',
      kategoriKuliner: 'Restoran Korea Halal',
      statusSertifikasi: 'Terverifikasi BPJPH',
      nomorSertifikatHalal: '',
      alamat: '',
      kecamatan: 'Beji',
      latitude: '-6.3688',
      longitude: '106.8332',
      kisaranHarga: '$$',
      jamOperasional: '10:00 - 22:00 WIB',
      statusVerifikasi: 'VERIFIED',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      namaRestoran: item.namaRestoran || '',
      kategoriKuliner: item.kategoriKuliner || 'Restoran Korea Halal',
      statusSertifikasi: item.statusSertifikasi || 'Terverifikasi BPJPH',
      nomorSertifikatHalal: item.nomorSertifikatHalal || '',
      alamat: item.alamat || '',
      kecamatan: item.kecamatan || 'Beji',
      latitude: item.latitude ? String(item.latitude) : '-6.3688',
      longitude: item.longitude ? String(item.longitude) : '106.8332',
      kisaranHarga: item.kisaranHarga || '$$',
      jamOperasional: item.jamOperasional || '10:00 - 22:00 WIB',
      statusVerifikasi: item.statusVerifikasi || 'VERIFIED',
      foto: item.foto || item.fotoUtama || '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Yakin ingin menghapus tempat makan '${name}'?`)) return;
    try {
      await api.delete(`/admin/kuliner/${id}`);
      fetchData();
    } catch {
      alert('Gagal menghapus data kuliner.');
    }
  };

  const handleToggleStatus = async (item) => {
    const nextStatus = item.statusVerifikasi === 'VERIFIED' ? 'IN_REVIEW' : 'VERIFIED';
    try {
      await api.patch(`/admin/kuliner/${item.id}/status`, { status: nextStatus });
      fetchData();
    } catch {
      alert('Gagal memperbarui status verifikasi.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.namaRestoran.trim()) {
      setFormError('Nama tempat makan/restoran wajib diisi.');
      return;
    }

    setSubmitting(true);
    setFormError('');
    try {
      if (editingItem) {
        await api.put(`/admin/kuliner/${editingItem.id}`, formData);
      } else {
        await api.post('/admin/kuliner', formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Terjadi kesalahan saat menyimpan data.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Modul dengan daisyUI Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-[#f9f6ef] tracking-tight flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#1b6a54]/10 dark:bg-[#1b6a54]/30 text-[#1b6a54] dark:text-[#dec684]">
              <Store className="w-7 h-7" />
            </div>
            <span>Direktori Kuliner & Restoran Korea Halal</span>
          </h2>
          <p className="text-base text-slate-600 dark:text-[#dec684]/80 mt-1.5 font-medium">
            Pengelolaan katalog tempat makan halal, resto Korea, F&B lokal Depok, dan verifikasi sertifikat BPJPH.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="btn bg-[#1b6a54] hover:bg-[#145241] text-[#f9f6ef] border-none text-sm font-bold h-auto py-3 px-5 rounded-2xl shadow-md hover:shadow-lg transition duration-150 gap-2"
        >
          <Plus className="w-5 h-5 text-[#dec684]" />
          <span>Tambah Tempat Makan</span>
        </button>
      </div>

      {/* Filter & Pencarian dengan daisyUI Input & Select */}
      <div className="card card-bordered bg-white dark:bg-[#14231e] rounded-3xl border-[#e8dfcf] dark:border-[#223831] shadow-xs">
        <div className="card-body p-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <form onSubmit={handleSearchSubmit} className="flex-1">
              <label className="input input-bordered flex items-center gap-2 h-auto px-4 py-2.5 rounded-2xl bg-white dark:bg-[#1a2d27] border-slate-300 dark:border-[#28443b] focus-within:border-[#1b6a54]">
                <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari restoran atau lokasi..."
                  className="grow text-sm text-slate-800 dark:text-slate-200 bg-transparent outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch('');
                      fetchData();
                    }}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </label>
            </form>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <Filter className="w-3.5 h-3.5" />
                <span>Filter</span>
              </div>

              <select
                value={kategoriFilter}
                onChange={(e) => setKategoriFilter(e.target.value)}
                className="select select-bordered px-3 py-2 h-auto rounded-2xl text-sm bg-white dark:bg-[#1a2d27] text-slate-800 dark:text-slate-200 border-slate-300 dark:border-[#28443b] focus:border-[#1b6a54] font-medium"
              >
                <option value="ALL">Semua Kategori</option>
                <option value="Restoran Korea Halal">Restoran Korea Halal</option>
                <option value="F&B Lokal Depok">F&B Lokal Depok</option>
                <option value="Cafe Ramah Muslim">Cafe Ramah Muslim</option>
                <option value="Fast Food Halal">Fast Food Halal</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="select select-bordered px-3 py-2 h-auto rounded-2xl text-sm bg-white dark:bg-[#1a2d27] text-slate-800 dark:text-slate-200 border-slate-300 dark:border-[#28443b] focus:border-[#1b6a54] font-medium"
              >
                <option value="ALL">Semua Status</option>
                <option value="VERIFIED">Terverifikasi</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="DRAFT">Draft</option>
              </select>

              {(search || kategoriFilter !== 'ALL' || statusFilter !== 'ALL') && (
                <div className="badge bg-[#1b6a54]/10 dark:bg-[#1b6a54]/30 text-[#1b6a54] dark:text-[#dec684] border-none font-bold text-xs py-3 px-3 rounded-xl flex-shrink-0">
                  {items.length} data
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabel Data Kuliner dengan daisyUI Table & Card */}
      <div className="card card-bordered bg-white dark:bg-[#14231e] rounded-3xl border-[#e8dfcf] dark:border-[#223831] shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin mx-auto text-[#1b6a54] dark:text-[#dec684] mb-3" />
            <p className="text-sm font-semibold">Memuat katalog kuliner...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full text-left">
              <thead>
                <tr className="bg-[#f9f6ef]/80 dark:bg-[#162722] border-b border-[#e8dfcf] dark:border-[#223831] text-xs font-extrabold text-[#a08145] dark:text-[#dec684] uppercase tracking-wider">
                  <th className="py-4 px-5">Nama Tempat & Kategori</th>
                  <th className="py-4 px-5">Sertifikasi BPJPH</th>
                  <th className="py-4 px-5">Alamat & Kecamatan</th>
                  <th className="py-4 px-5">Harga & Jam</th>
                  <th className="py-4 px-5">Status Verifikasi</th>
                  <th className="py-4 px-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium">
                {items.length > 0 ? (
                  items.map((item) => (
                    <tr key={item.id} className="hover:bg-[#f9f6ef]/40 dark:hover:bg-[#1a2d27]/70 transition">
                      <td className="py-4 px-5">
                        <div className="font-extrabold text-slate-900 dark:text-[#f9f6ef] text-base">
                          {item.namaRestoran}
                        </div>
                        <span className="badge badge-sm font-bold text-[#1b6a54] dark:text-[#dec684] bg-[#1b6a54]/10 dark:bg-[#1b6a54]/30 border-none mt-1">
                          {item.kategoriKuliner}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                          <ShieldCheck className="w-4 h-4 text-[#1b6a54] dark:text-[#dec684] flex-shrink-0" />
                          <span>{item.statusSertifikasi}</span>
                        </div>
                        <div className="text-xs text-slate-400 font-mono mt-1">
                          {item.nomorSertifikatHalal || '-'}
                        </div>
                      </td>
                      <td className="py-4 px-5 text-slate-600 dark:text-slate-300">
                        <div className="flex items-start gap-1.5">
                          <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                          <span className="truncate max-w-xs">{item.alamat} ({item.kecamatan})</span>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-slate-600 dark:text-slate-300">
                        <div className="font-bold text-slate-900 dark:text-[#f9f6ef]">{item.kisaranHarga}</div>
                        <div className="text-xs text-slate-400">{item.jamOperasional}</div>
                      </td>
                      <td className="py-4 px-5">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(item)}
                          title="Klik untuk ubah status verifikasi"
                          className={`badge font-bold text-xs uppercase px-3 py-2.5 rounded-xl border-none cursor-pointer gap-1.5 transition ${
                            item.statusVerifikasi === 'VERIFIED'
                              ? 'bg-[#1b6a54] text-[#f9f6ef]'
                              : item.statusVerifikasi === 'IN_REVIEW'
                              ? 'bg-[#a08145] text-[#f9f6ef]'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {item.statusVerifikasi === 'VERIFIED' ? (
                            <CheckCircle className="w-3.5 h-3.5" />
                          ) : (
                            <Clock className="w-3.5 h-3.5" />
                          )}
                          <span>{item.statusVerifikasi}</span>
                        </button>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="btn btn-sm btn-ghost btn-circle text-slate-600 dark:text-slate-300 hover:text-[#1b6a54] dark:hover:text-[#dec684]"
                            title="Edit Data"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id, item.namaRestoran)}
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
                    <td colSpan="6" className="py-16 text-center font-medium">
                      <div className="flex flex-col items-center gap-3 text-slate-400 dark:text-slate-500">
                        <Store className="w-10 h-10 opacity-30" />
                        <span>
                          {search || kategoriFilter !== 'ALL' || statusFilter !== 'ALL'
                            ? 'Tidak ada tempat makan yang sesuai kriteria pencarian.'
                            : 'Belum ada data tempat makan atau resto yang terdaftar.'}
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

      {/* Modal Form Tambah / Edit Kuliner dengan daisyUI Modal */}
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
              {editingItem ? 'Edit Data Restoran / Kuliner' : 'Tambah Tempat Makan Baru'}
            </h3>
            <p className="text-sm text-slate-500 dark:text-[#dec684] mb-6">
              Isi data lengkap tempat makan termasuk resto Korea halal dan informasi status BPJPH.
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
                  Nama Tempat Makan / Restoran *
                </label>
                <input
                  type="text"
                  required
                  value={formData.namaRestoran}
                  onChange={(e) => setFormData({ ...formData, namaRestoran: e.target.value })}
                  placeholder="Contoh: Chuseok Korean BBQ Halal"
                  className="input input-bordered w-full px-4 py-3 h-auto rounded-2xl border-slate-300 dark:border-[#28443b] bg-white dark:bg-[#1a2d27] text-slate-900 dark:text-white focus:border-[#1b6a54]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2">
                    Kategori Kuliner
                  </label>
                  <select
                    value={formData.kategoriKuliner}
                    onChange={(e) => setFormData({ ...formData, kategoriKuliner: e.target.value })}
                    className="select select-bordered w-full px-4 py-3 h-auto rounded-2xl border-slate-300 dark:border-[#28443b] bg-white dark:bg-[#1a2d27] text-slate-900 dark:text-white focus:border-[#1b6a54]"
                  >
                    <option value="Restoran Korea Halal">Restoran Korea Halal</option>
                    <option value="F&B Lokal Depok">F&B Lokal Depok</option>
                    <option value="Cafe Ramah Muslim">Cafe Ramah Muslim</option>
                    <option value="Fast Food Halal">Fast Food Halal</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2">
                    Status Sertifikasi BPJPH
                  </label>
                  <select
                    value={formData.statusSertifikasi}
                    onChange={(e) => setFormData({ ...formData, statusSertifikasi: e.target.value })}
                    className="select select-bordered w-full px-4 py-3 h-auto rounded-2xl border-slate-300 dark:border-[#28443b] bg-white dark:bg-[#1a2d27] text-slate-900 dark:text-white focus:border-[#1b6a54]"
                  >
                    <option value="Terverifikasi BPJPH">Terverifikasi BPJPH</option>
                    <option value="Self Declare">Self Declare Halal</option>
                    <option value="Proses">Dalam Proses Uji LPH</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2">
                  Nomor Sertifikat Halal
                </label>
                <input
                  type="text"
                  value={formData.nomorSertifikatHalal}
                  onChange={(e) => setFormData({ ...formData, nomorSertifikatHalal: e.target.value })}
                  placeholder="Contoh: ID32110001234560124"
                  className="input input-bordered w-full px-4 py-3 h-auto rounded-2xl border-slate-300 dark:border-[#28443b] bg-white dark:bg-[#1a2d27] text-slate-900 dark:text-white focus:border-[#1b6a54]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2">
                    Kecamatan Depok
                  </label>
                  <select
                    value={formData.kecamatan}
                    onChange={(e) => setFormData({ ...formData, kecamatan: e.target.value })}
                    className="select select-bordered w-full px-4 py-3 h-auto rounded-2xl border-slate-300 dark:border-[#28443b] bg-white dark:bg-[#1a2d27] text-slate-900 dark:text-white focus:border-[#1b6a54]"
                  >
                    <option value="Beji">Beji</option>
                    <option value="Pancoran Mas">Pancoran Mas</option>
                    <option value="Sukmajaya">Sukmajaya</option>
                    <option value="Cimanggis">Cimanggis</option>
                    <option value="Sawangan">Sawangan</option>
                    <option value="Cinere">Cinere</option>
                    <option value="Limo">Limo</option>
                    <option value="Bojongsari">Bojongsari</option>
                    <option value="Cilodong">Cilodong</option>
                    <option value="Tapos">Tapos</option>
                    <option value="Cipayung">Cipayung</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2">
                    Kisaran Harga
                  </label>
                  <select
                    value={formData.kisaranHarga}
                    onChange={(e) => setFormData({ ...formData, kisaranHarga: e.target.value })}
                    className="select select-bordered w-full px-4 py-3 h-auto rounded-2xl border-slate-300 dark:border-[#28443b] bg-white dark:bg-[#1a2d27] text-slate-900 dark:text-white focus:border-[#1b6a54]"
                  >
                    <option value="$">$ (Terjangkau: &lt; Rp 30rb)</option>
                    <option value="$$">$$ (Menengah: Rp 30rb - 100rb)</option>
                    <option value="$$$">$$$ (Premium: &gt; Rp 100rb)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2">
                  Alamat Lengkap
                </label>
                <textarea
                  rows="2"
                  value={formData.alamat}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  placeholder="Jl. Margonda Raya No. 120, Beji, Kota Depok"
                  className="textarea textarea-bordered w-full px-4 py-3 rounded-2xl border-slate-300 dark:border-[#28443b] bg-white dark:bg-[#1a2d27] text-slate-900 dark:text-white focus:border-[#1b6a54]"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2">
                    Jam Operasional
                  </label>
                  <input
                    type="text"
                    value={formData.jamOperasional}
                    onChange={(e) => setFormData({ ...formData, jamOperasional: e.target.value })}
                    placeholder="10:00 - 22:00 WIB"
                    className="input input-bordered w-full px-4 py-3 h-auto rounded-2xl border-slate-300 dark:border-[#28443b] bg-white dark:bg-[#1a2d27] text-slate-900 dark:text-white focus:border-[#1b6a54]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2">
                    Status Verifikasi
                  </label>
                  <select
                    value={formData.statusVerifikasi}
                    onChange={(e) => setFormData({ ...formData, statusVerifikasi: e.target.value })}
                    className="select select-bordered w-full px-4 py-3 h-auto rounded-2xl border-slate-300 dark:border-[#28443b] bg-white dark:bg-[#1a2d27] text-slate-900 dark:text-white focus:border-[#1b6a54]"
                  >
                    <option value="VERIFIED">VERIFIED (Disetujui Publik)</option>
                    <option value="IN_REVIEW">IN_REVIEW (Menunggu Audit)</option>
                    <option value="DRAFT">DRAFT (Arsip Internal)</option>
                  </select>
                </div>
              </div>

              <ImageInput
                label="Foto Restoran / Kuliner"
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
                  <span>{editingItem ? 'Simpan Perubahan' : 'Tambah Kuliner'}</span>
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

export default AdminKuliner;
