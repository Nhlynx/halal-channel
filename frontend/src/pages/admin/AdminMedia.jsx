import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import {
  Plus,
  Video,
  Mic,
  Film,
  Edit2,
  Trash2,
  X,
  Loader2,
  AlertTriangle,
  ExternalLink,
  Search,
  Radio,
} from 'lucide-react';

const AdminMedia = () => {
  useDocumentTitle('Media Podcast & Shorts');

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tipeFilter, setTipeFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const [formData, setFormData] = useState({
    judul: '',
    tipeMedia: 'AUDIO_PODCAST',
    embedUrl: '',
    host: '',
    narasumber: '',
    deskripsi: '',
    statusPublikasi: 'PUBLISHED',
  });

  const fetchData = useCallback(async () => {
    try {
      const res = await api.get('/admin/media');
      if (res.data && res.data.success) {
        setItems(res.data.data);
      }
    } catch (err) {
      console.error('Error memuat data media:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    api.get('/admin/media')
      .then((res) => {
        if (!ignore && res.data?.success) {
          setItems(res.data.data);
        }
      })
      .catch((err) => {
        console.error('Gagal mengambil data media:', err);
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
      tipeMedia: 'AUDIO_PODCAST',
      embedUrl: '',
      host: 'Host Halal Channel',
      narasumber: '',
      deskripsi: '',
      statusPublikasi: 'PUBLISHED',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      judul: item.judul || '',
      tipeMedia: item.tipeMedia || 'AUDIO_PODCAST',
      embedUrl: item.embedUrl || '',
      host: item.host || '',
      narasumber: item.narasumber || '',
      deskripsi: item.deskripsi || '',
      statusPublikasi: item.statusPublikasi || 'PUBLISHED',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Yakin ingin menghapus episode '${title}'?`)) return;
    try {
      await api.delete(`/admin/media/${id}`);
      fetchData();
    } catch {
      alert('Gagal menghapus media.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.judul.trim()) {
      setFormError('Judul program media wajib diisi.');
      return;
    }

    setSubmitting(true);
    setFormError('');
    try {
      if (editingItem) {
        await api.put(`/admin/media/${editingItem.id}`, formData);
      } else {
        await api.post('/admin/media', formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Gagal menyimpan media.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchTipe = tipeFilter === 'ALL' ? true : item.tipeMedia === tipeFilter;
    const matchSearch = searchQuery.trim() === ''
      ? true
      : item.judul?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.host?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.narasumber?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTipe && matchSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header Modul dengan daisyUI Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-[#f9f6ef] tracking-tight flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#1b6a54]/10 dark:bg-[#1b6a54]/30 text-[#1b6a54] dark:text-[#dec684]">
              <Video className="w-7 h-7" />
            </div>
            <span>Manajemen Media Podcast & Video Shorts</span>
          </h2>
          <p className="text-base text-slate-600 dark:text-[#dec684]/80 mt-1.5 font-medium">
            Pengelolaan konten format Escape Model (dialog audio podcast santai & video edukasi pendek vertikal).
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="btn bg-[#1b6a54] hover:bg-[#145241] text-[#f9f6ef] border-none text-sm font-bold h-auto py-3 px-5 rounded-2xl shadow-md hover:shadow-lg transition duration-150 gap-2"
        >
          <Plus className="w-5 h-5 text-[#dec684]" />
          <span>Tambah Episode Media</span>
        </button>
      </div>

      {/* Filter Bar — Format Selector (Segment Tabs) + Search Bar */}
      <div className="card card-bordered bg-white dark:bg-[#14231e] rounded-3xl border-[#e8dfcf] dark:border-[#223831] shadow-xs">
        <div className="card-body p-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Format Segment Selector */}
            <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#f9f6ef] dark:bg-[#1a2d27] rounded-2xl border border-[#e8dfcf] dark:border-[#28443b] self-start lg:self-auto">
              <button
                type="button"
                onClick={() => setTipeFilter('ALL')}
                className={`btn btn-sm rounded-xl border-none font-bold text-xs gap-1.5 transition ${
                  tipeFilter === 'ALL'
                    ? 'bg-[#1b6a54] text-[#f9f6ef] shadow-sm'
                    : 'btn-ghost text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-[#14231e]'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                Semua Format
              </button>
              <button
                type="button"
                onClick={() => setTipeFilter('AUDIO_PODCAST')}
                className={`btn btn-sm rounded-xl border-none font-bold text-xs gap-1.5 transition ${
                  tipeFilter === 'AUDIO_PODCAST'
                    ? 'bg-[#1b6a54] text-[#f9f6ef] shadow-sm'
                    : 'btn-ghost text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-[#14231e]'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                Audio Podcast
              </button>
              <button
                type="button"
                onClick={() => setTipeFilter('VIDEO_SHORTS')}
                className={`btn btn-sm rounded-xl border-none font-bold text-xs gap-1.5 transition ${
                  tipeFilter === 'VIDEO_SHORTS'
                    ? 'bg-[#1b6a54] text-[#f9f6ef] shadow-sm'
                    : 'btn-ghost text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-[#14231e]'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                Video Shorts
              </button>
            </div>

            {/* Search Input & Counter */}
            <div className="flex items-center gap-3">
              <label className="input input-bordered flex items-center gap-2 h-auto px-4 py-2 rounded-2xl bg-white dark:bg-[#1a2d27] border-slate-300 dark:border-[#28443b] focus-within:border-[#1b6a54] w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari judul, host, pakar..."
                  className="grow text-sm text-slate-800 dark:text-slate-200 bg-transparent outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
                {searchQuery && (
                  <button type="button" onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </label>

              {(searchQuery || tipeFilter !== 'ALL') && (
                <div className="badge bg-[#1b6a54]/10 dark:bg-[#1b6a54]/30 text-[#1b6a54] dark:text-[#dec684] border-none font-bold text-xs py-3 px-3 rounded-xl flex-shrink-0">
                  {filteredItems.length} hasil
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabel Data Media dengan daisyUI Table & Card */}
      <div className="card card-bordered bg-white dark:bg-[#14231e] rounded-3xl border-[#e8dfcf] dark:border-[#223831] shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin mx-auto text-[#1b6a54] dark:text-[#dec684] mb-3" />
            <p className="text-sm font-semibold">Memuat katalog media...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full text-left">
              <thead>
                <tr className="bg-[#f9f6ef]/80 dark:bg-[#162722] border-b border-[#e8dfcf] dark:border-[#223831] text-xs font-extrabold text-[#a08145] dark:text-[#dec684] uppercase tracking-wider">
                  <th className="py-4 px-5">Judul Program & Format</th>
                  <th className="py-4 px-5">Host & Narasumber</th>
                  <th className="py-4 px-5">Tautan Embed / Sumber</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-[#f9f6ef]/40 dark:hover:bg-[#1a2d27]/70 transition">
                      <td className="py-4 px-5 max-w-sm">
                        <div className="font-extrabold text-slate-900 dark:text-[#f9f6ef] text-base leading-snug">
                          {item.judul}
                        </div>
                        <div className="mt-1.5 flex items-center gap-2">
                          {item.tipeMedia === 'AUDIO_PODCAST' ? (
                            <span className="badge badge-sm font-bold bg-[#dec684]/25 text-[#a08145] dark:text-[#dec684] border-[#a08145]/30 gap-1.5 py-2">
                              <Mic className="w-3.5 h-3.5" /> Audio Podcast
                            </span>
                          ) : (
                            <span className="badge badge-sm font-bold bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800/50 gap-1.5 py-2">
                              <Film className="w-3.5 h-3.5" /> Video Shorts
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-5 text-slate-700 dark:text-slate-300">
                        <div className="font-bold text-slate-900 dark:text-white">Host: {item.host || '-'}</div>
                        <div className="text-xs text-[#a08145] dark:text-[#dec684] font-medium mt-0.5">Pakar: {item.narasumber || '-'}</div>
                      </td>
                      <td className="py-4 px-5 text-slate-600 dark:text-slate-400">
                        {item.embedUrl ? (
                          <a
                            href={item.embedUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-[#1b6a54] dark:text-[#dec684] hover:underline font-mono text-xs font-semibold truncate max-w-xs"
                          >
                            <span className="truncate">{item.embedUrl}</span>
                            <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                          </a>
                        ) : (
                          <span className="text-slate-400 font-mono text-xs">-</span>
                        )}
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
                            title="Edit Media"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id, item.judul)}
                            className="btn btn-sm btn-ghost btn-circle text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400"
                            title="Hapus Media"
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
                        <Video className="w-10 h-10 opacity-30" />
                        <span>
                          {searchQuery || tipeFilter !== 'ALL'
                            ? 'Tidak ada episode media yang cocok dengan filter.'
                            : 'Belum ada episode media yang terdaftar.'}
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
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-[#f9f6ef]">
                {editingItem ? 'Edit Episode Media' : 'Tambah Episode Media Baru'}
              </h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-[#dec684]/80 mb-6 font-medium">
              Daftarkan podcast dialog santai atau tautan video edukasi vertikal singkat.
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
                  Judul Program Media *
                </label>
                <input
                  type="text"
                  required
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  placeholder="Contoh: Podcast Halal Insight Ep. 02: Membedah Saus Masakan Korea"
                  className="input input-bordered w-full px-4 py-3 h-auto rounded-2xl border-slate-300 dark:border-[#28443b] text-slate-900 dark:text-white bg-white dark:bg-[#1a2d27] focus:border-[#1b6a54]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2">
                    Tipe Format Media
                  </label>
                  <select
                    value={formData.tipeMedia}
                    onChange={(e) => setFormData({ ...formData, tipeMedia: e.target.value })}
                    className="select select-bordered w-full px-4 py-3 h-auto rounded-2xl border-slate-300 dark:border-[#28443b] text-slate-800 dark:text-slate-200 bg-white dark:bg-[#1a2d27] focus:border-[#1b6a54] font-medium"
                  >
                    <option value="AUDIO_PODCAST">Audio Podcast (Spotify / Soundcloud)</option>
                    <option value="VIDEO_SHORTS">Video Shorts (YouTube / Reels)</option>
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
                  Tautan Embed / Sumber Streaming (Spotify / YouTube)
                </label>
                <input
                  type="url"
                  value={formData.embedUrl}
                  onChange={(e) => setFormData({ ...formData, embedUrl: e.target.value })}
                  placeholder="https://open.spotify.com/episode/... atau https://youtube.com/shorts/..."
                  className="input input-bordered w-full px-4 py-3 h-auto rounded-2xl border-slate-300 dark:border-[#28443b] text-slate-900 dark:text-white bg-white dark:bg-[#1a2d27] focus:border-[#1b6a54] font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2">
                    Nama Host
                  </label>
                  <input
                    type="text"
                    value={formData.host}
                    onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                    placeholder="Contoh: Ahmad Faiz"
                    className="input input-bordered w-full px-4 py-3 h-auto rounded-2xl border-slate-300 dark:border-[#28443b] text-slate-900 dark:text-white bg-white dark:bg-[#1a2d27] focus:border-[#1b6a54]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2">
                    Narasumber / Pakar
                  </label>
                  <input
                    type="text"
                    value={formData.narasumber}
                    onChange={(e) => setFormData({ ...formData, narasumber: e.target.value })}
                    placeholder="Contoh: Dr. Halim (Auditor BPJPH)"
                    className="input input-bordered w-full px-4 py-3 h-auto rounded-2xl border-slate-300 dark:border-[#28443b] text-slate-900 dark:text-white bg-white dark:bg-[#1a2d27] focus:border-[#1b6a54]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2">
                  Deskripsi Episode & Transkrip Intisari
                </label>
                <textarea
                  rows="3"
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  placeholder="Catatan poin penting perbincangan sains pangan..."
                  className="textarea textarea-bordered w-full px-4 py-3 rounded-2xl border-slate-300 dark:border-[#28443b] text-slate-900 dark:text-white bg-white dark:bg-[#1a2d27] focus:border-[#1b6a54]"
                ></textarea>
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
                  <span>{editingItem ? 'Simpan Perubahan' : 'Tambah Media'}</span>
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

export default AdminMedia;
