import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import PublicLayout from '../../layouts/PublicLayout';
import { ResepCard, SkeletonCard, EmptyState } from '../../components/ui/ContentCard';
import usePublicData from '../../hooks/usePublicData';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const KATEGORI = ['Semua', 'Olahan Sehat', 'Pangan Lokal / Koro Pedang', 'Bebas Bahan Sintetis'];
const KESULITAN = ['Semua', 'Mudah', 'Sedang', 'Sulit'];

const ResepPage = () => {
  useDocumentTitle('Resep Halal — Halal Channel');

  const { data: rawData, isLoading } = usePublicData('/public/resep');
  const [keyword, setKeyword] = useState('');
  const [kategori, setKategori] = useState('Semua');
  const [kesulitan, setKesulitan] = useState('Semua');
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    let result = rawData;
    if (keyword.trim()) {
      const q = keyword.toLowerCase();
      result = result.filter(
        (r) =>
          r.judulResep?.toLowerCase().includes(q) ||
          r.kategoriResep?.toLowerCase().includes(q) ||
          r.deskripsi?.toLowerCase().includes(q)
      );
    }
    if (kategori !== 'Semua') result = result.filter((r) => r.kategoriResep === kategori);
    if (kesulitan !== 'Semua') result = result.filter((r) => r.tingkatKesulitan === kesulitan);
    setFiltered(result);
  }, [rawData, keyword, kategori, kesulitan]);

  return (
    <PublicLayout>
      {/* Hero */}
      <section
        className="relative py-16 px-4 text-center"
        style={{ background: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '28px 28px' }}
          aria-hidden="true"
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="badge badge-sm bg-white/20 text-white border-white/30 font-bold mb-4">
            Resep Halal & Thayyib
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
            Resep Makanan <span className="text-orange-200">Halal Tersertifikasi</span>
          </h1>
          <p className="text-white/80 mb-8 text-sm sm:text-base max-w-xl mx-auto">
            Resep autentik nusantara dan Korea Halal — tanpa bahan haram, diverifikasi saintifik, lezat dan bergizi untuk keluarga Muslim.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Cari resep halal..."
                className="input input-bordered w-full pl-10 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white border-0 focus:outline-none"
              />
            </div>
            <select
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              className="select select-bordered rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-white border-0 font-semibold focus:outline-none sm:w-52"
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
            Menampilkan <strong className="text-orange-600">{isLoading ? '...' : filtered.length}</strong> resep
          </p>
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs text-slate-400 font-medium self-center">Kesulitan:</span>
            {KESULITAN.map((k) => (
              <button
                key={k}
                onClick={() => setKesulitan(k)}
                className={`btn btn-xs rounded-full border font-semibold whitespace-nowrap transition-all ${
                  kesulitan === k
                    ? 'bg-orange-500 border-orange-500 text-white'
                    : 'bg-transparent border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoading ? (
            <SkeletonCard count={6} />
          ) : filtered.length === 0 ? (
            <EmptyState title="Resep tidak ditemukan" desc="Coba kata kunci atau filter berbeda." />
          ) : (
            filtered.map((item) => <ResepCard key={item.id} item={item} />)
          )}
        </div>
      </section>
    </PublicLayout>
  );
};

export default ResepPage;
