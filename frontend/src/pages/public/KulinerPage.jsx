import { useState, useEffect } from 'react';
import { Search, Filter, Award } from 'lucide-react';
import PublicLayout from '../../layouts/PublicLayout';
import { KulinerCard, SkeletonCard, EmptyState } from '../../components/ui/ContentCard';
import usePublicData from '../../hooks/usePublicData';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const KATEGORI = ['Semua', 'Restoran Korea Halal', 'F&B Lokal Depok', 'Cafe Ramah Muslim', 'Fast Food Halal'];
const STATUS = ['Semua', 'Terverifikasi BPJPH', 'Self Declare', 'Proses'];

const KulinerPage = () => {
  useDocumentTitle('Kuliner Halal — Halal Channel');

  const { data: rawData, isLoading } = usePublicData('/public/kuliner');
  const [keyword, setKeyword] = useState('');
  const [kategori, setKategori] = useState('Semua');
  const [status, setStatus] = useState('Semua');
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    let result = rawData;
    if (keyword.trim()) {
      const q = keyword.toLowerCase();
      result = result.filter(
        (k) =>
          k.namaRestoran?.toLowerCase().includes(q) ||
          k.alamat?.toLowerCase().includes(q) ||
          k.kecamatan?.toLowerCase().includes(q)
      );
    }
    if (kategori !== 'Semua') result = result.filter((k) => k.kategoriKuliner === kategori);
    if (status !== 'Semua') result = result.filter((k) => k.statusSertifikasi === status);
    setFiltered(result);
  }, [rawData, keyword, kategori, status]);

  return (
    <PublicLayout>
      {/* Hero */}
      <section
        className="relative py-16 px-4 text-center"
        style={{ background: 'linear-gradient(135deg, #92400e 0%, #d97706 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '28px 28px' }}
          aria-hidden="true"
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="badge badge-sm bg-white/20 text-white border-white/30 font-bold mb-4">
            Kuliner & Restoran Korea Halal
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
            Katalog Kuliner Halal <span className="text-amber-200">&amp; Resto Korea</span>
          </h1>
          <p className="text-white/80 mb-8 text-sm sm:text-base max-w-xl mx-auto">
            Rekomendasi tempat makan halal di Depok dan sekitarnya, termasuk restoran Korea terverifikasi BPJPH dan berlabel Thayyib.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Cari nama restoran atau alamat..."
                className="input input-bordered w-full pl-10 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white border-0 focus:outline-none"
              />
            </div>
            <select
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              className="select select-bordered rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-white border-0 font-semibold focus:outline-none sm:w-48"
            >
              {KATEGORI.map((k) => <option key={k}>{k}</option>)}
            </select>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {/* Filter bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Menampilkan <strong className="text-amber-600">{isLoading ? '...' : filtered.length}</strong> tempat makan
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <Award className="w-3 h-3" /> Status:
            </span>
            {STATUS.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`btn btn-xs rounded-full border font-semibold whitespace-nowrap transition-all ${
                  status === s
                    ? 'bg-amber-500 border-amber-500 text-white'
                    : 'bg-transparent border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card card-side bg-base-100 shadow-md animate-pulse overflow-hidden">
                <div className="skeleton w-36 h-full rounded-none" />
                <div className="card-body gap-3 p-4">
                  <div className="skeleton h-4 w-3/4 rounded" />
                  <div className="skeleton h-3 w-1/2 rounded" />
                  <div className="skeleton h-3 w-full rounded" />
                </div>
              </div>
            ))
          ) : filtered.length === 0 ? (
            <EmptyState title="Restoran tidak ditemukan" desc="Coba kata kunci atau filter berbeda." />
          ) : (
            filtered.map((item) => <KulinerCard key={item.id} item={item} />)
          )}
        </div>
      </section>
    </PublicLayout>
  );
};

export default KulinerPage;
