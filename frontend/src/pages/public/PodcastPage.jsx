import { Play, Mic2, Clock } from 'lucide-react';
import PublicLayout from '../../layouts/PublicLayout';
import { ImgWithFallback, SkeletonCard, EmptyState } from '../../components/ui/ContentCard';
import usePublicData from '../../hooks/usePublicData';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const PodcastPage = () => {
  useDocumentTitle('Podcast — Halal Channel');

  const { data, isLoading } = usePublicData('/public/media');

  return (
    <PublicLayout>
      {/* Hero */}
      <section
        className="relative py-16 px-4 text-center"
        style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #7c3aed 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '28px 28px' }}
          aria-hidden="true"
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="badge badge-sm bg-white/20 text-white border-white/30 font-bold mb-4">
            Media & Podcast
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
            Podcast <span className="text-purple-200">Kasual Halal Channel</span>
          </h1>
          <p className="text-white/80 text-sm sm:text-base max-w-xl mx-auto">
            Obrolan santai seputar gaya hidup halal, wisata Muslim, riset sains pangan, dan kuliner Korea halal — kapan saja, di mana saja.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 py-12 bg-slate-50 dark:bg-[#0a1510] min-h-[40vh]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoading ? (
            <SkeletonCard count={3} />
          ) : data.length === 0 ? (
            <EmptyState title="Belum ada episode podcast" desc="Konten podcast akan segera hadir." />
          ) : (
            data.map((ep) => (
              <div
                key={ep.id}
                className="card bg-slate-800 dark:bg-slate-800/60 shadow-2xl overflow-hidden group cursor-pointer hover:-translate-y-1 transition-all duration-200 border border-slate-700/50"
              >
                <figure className="relative h-48 overflow-hidden">
                  <ImgWithFallback
                    src={ep.foto}
                    alt={ep.judul}
                    className="w-full h-full object-cover brightness-75 group-hover:brightness-90 transition-all duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/40 group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-white fill-white ml-1" />
                    </div>
                  </div>
                  <span className="absolute top-3 left-3 badge badge-sm bg-purple-600 text-white border-0 font-bold">
                    {ep.tipeMedia === 'AUDIO_PODCAST' ? 'Podcast' : 'Video Shorts'}
                  </span>
                </figure>
                <div className="card-body px-4 py-4 gap-2">
                  <h3 className="font-bold text-white text-sm leading-snug line-clamp-2">{ep.judul}</h3>
                  {ep.host && (
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <Mic2 className="w-3 h-3" /> Host: {ep.host}
                    </p>
                  )}
                  {ep.narasumber && (
                    <p className="text-xs text-slate-400">Narasumber: {ep.narasumber}</p>
                  )}
                  {ep.deskripsi && (
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">{ep.deskripsi}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </PublicLayout>
  );
};

export default PodcastPage;
