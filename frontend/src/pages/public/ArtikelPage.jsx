import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import PublicLayout from '../../layouts/PublicLayout';
import { ArtikelCard, SkeletonCard, EmptyState } from '../../components/ui/ContentCard';
import usePublicData from '../../hooks/usePublicData';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const KATEGORI = ['Semua', 'Sains Pangan', 'Edukasi Halal', 'Survival Guide', 'Travel Halal', 'Pangan Lokal'];

const ArtikelPage = () => {
  useDocumentTitle('Artikel & Sains Pangan — Halal Channel');

  const { data: rawData, isLoading } = usePublicData('/public/edukasi');
  const [keyword, setKeyword] = useState('');
  const [kategori, setKategori] = useState('Semua');
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    let result = rawData;
    if (keyword.trim()) {
      const q = keyword.toLowerCase();
      result = result.filter(
        (a) =>
          a.judul?.toLowerCase().includes(q) ||
          a.ringkasan?.toLowerCase().includes(q) ||
          a.penulis?.toLowerCase().includes(q)
      );
    }
    if (kategori !== 'Semua') result = result.filter((a) => a.kategori === kategori);
    setFiltered(result);
  }, [rawData, keyword, kategori]);

  return (
    <PublicLayout>
      {/* Hero */}
      <section
        className="relative py-16 px-4 text-center"
        style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '28px 28px' }}
          aria-hidden="true"
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="badge badge-sm bg-white/20 text-white border-white/30 font-bold mb-4">
            Artikel & Edukasi
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
            Sains Pangan &amp; <span className="text-blue-200">Edukasi Halal</span>
          </h1>
          <p className="text-white/80 mb-8 text-sm sm:text-base max-w-xl mx-auto">
            Artikel edukasi berbasis riset ilmiah — titik kritis bahan haram, uji lab BPJPH, panduan gaya hidup thayyib untuk keluarga Muslim.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Cari artikel sains pangan..."
                className="input input-bordered w-full pl-10 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white border-0 focus:outline-none"
              />
            </div>
            <select
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              className="select select-bordered rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-white border-0 font-semibold focus:outline-none sm:w-44"
            >
              {KATEGORI.map((k) => <option key={k}>{k}</option>)}
            </select>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {/* Filter pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Menampilkan <strong className="text-blue-600">{isLoading ? '...' : filtered.length}</strong> artikel
          </p>
          <div className="flex flex-wrap gap-2">
            {KATEGORI.map((k) => (
              <button
                key={k}
                onClick={() => setKategori(k)}
                className={`btn btn-xs rounded-full border font-semibold whitespace-nowrap transition-all ${
                  kategori === k
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-transparent border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {isLoading ? (
            <SkeletonCard count={6} />
          ) : filtered.length === 0 ? (
            <EmptyState title="Artikel tidak ditemukan" desc="Coba kata kunci atau pilih kategori berbeda." />
          ) : (
            filtered.map((item) => <ArtikelCard key={item.id} item={item} />)
          )}
        </div>
      </section>
    </PublicLayout>
  );
};

export default ArtikelPage;
