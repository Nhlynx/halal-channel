/**
 * ContentCard.jsx
 * Komponen kartu konten yang dapat digunakan ulang di semua halaman publik.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Clock, Award, Users, Leaf, ChevronRight } from 'lucide-react';

/** Gambar dengan fallback jika URL rusak */
export const ImgWithFallback = ({ src, alt, className }) => {
  const [err, setErr] = useState(false);
  return err || !src ? (
    <div className={`bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center ${className}`}>
      <Leaf className="w-10 h-10 text-emerald-300" />
    </div>
  ) : (
    <img src={src} alt={alt} className={className} onError={() => setErr(true)} />
  );
};

/** Badge halal */
export const HalalBadge = ({ label = 'BPJPH ✓', size = 'sm' }) => (
  <span className={`badge badge-${size} bg-emerald-100 text-emerald-700 dark:bg-emerald-800/40 dark:text-emerald-300 border-0 font-semibold gap-1`}>
    <Award className="w-3 h-3" /> {label}
  </span>
);

/** Skeleton loader untuk kartu */
export const SkeletonCard = ({ count = 1 }) =>
  Array.from({ length: count }).map((_, i) => (
    <div key={i} className="card bg-base-100 dark:bg-[#14231e] overflow-hidden animate-pulse">
      <div className="skeleton h-48 w-full rounded-none" />
      <div className="card-body gap-3">
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
        <div className="skeleton h-3 w-full rounded" />
      </div>
    </div>
  ));

/**
 * Kartu Wisata — full-bleed image dengan overlay gradient
 */
export const WisataCard = ({ item, linkTo }) => (
  <Link
    to={linkTo || `/wisata/${item.id}`}
    className="card card-compact bg-base-100 dark:bg-[#14231e] shadow-xl border border-base-200 dark:border-emerald-900/30 overflow-hidden group transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl"
  >
    <figure className="relative h-52 overflow-hidden">
      <ImgWithFallback
        src={item.foto || item.fotoDestinasi}
        alt={item.namaDestinasi}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      {item.kategoriWisata && (
        <span className="absolute top-3 left-3 badge badge-sm bg-emerald-500/90 text-white border-0 font-bold backdrop-blur-sm">
          {item.kategoriWisata}
        </span>
      )}
      {item.hargaTiket && (
        <span className="absolute top-3 right-3 badge badge-sm bg-white/90 text-emerald-700 border-0 font-semibold">
          {item.hargaTiket}
        </span>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p className="text-white font-black text-sm leading-tight line-clamp-2">{item.namaDestinasi}</p>
      </div>
    </figure>
    <div className="card-body px-4 py-3 gap-2">
      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
        <MapPin className="w-3 h-3 text-emerald-500" /> {item.lokasi || item.kecamatan}
      </p>
      {item.fasilitas?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {item.fasilitas.slice(0, 2).map((f) => (
            <span key={f} className="badge badge-xs badge-outline text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 text-[10px]">
              {f}
            </span>
          ))}
          {item.fasilitas.length > 2 && (
            <span className="badge badge-xs badge-ghost text-slate-400 text-[10px]">
              +{item.fasilitas.length - 2}
            </span>
          )}
        </div>
      )}
    </div>
  </Link>
);

/**
 * Kartu Kuliner — card-side horizontal
 */
export const KulinerCard = ({ item, linkTo }) => (
  <Link
    to={linkTo || `/kuliner/${item.id}`}
    className="card card-side bg-base-100 dark:bg-[#14231e] shadow-md hover:shadow-xl border border-base-200 dark:border-emerald-900/30 overflow-hidden group transition-all duration-200 hover:-translate-y-0.5"
  >
    <figure className="w-32 sm:w-40 flex-shrink-0 overflow-hidden">
      <ImgWithFallback
        src={item.foto || item.fotoUtama}
        alt={item.namaRestoran}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
    </figure>
    <div className="card-body px-4 py-3 gap-2">
      <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug line-clamp-2">{item.namaRestoran}</h3>
      <HalalBadge label={item.statusSertifikasi || item.statusHalal || 'Halal'} />
      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-start gap-1">
        <MapPin className="w-3 h-3 mt-0.5 text-emerald-500 flex-shrink-0" />
        <span className="line-clamp-2">{item.alamat}</span>
      </p>
      <div className="flex items-center justify-between mt-auto pt-1">
        <span className="text-xs text-slate-400 font-medium">{item.kisaranHarga && `Harga: ${item.kisaranHarga}`}</span>
        <span className="badge badge-xs badge-outline text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700">
          {item.kategoriKuliner}
        </span>
      </div>
    </div>
  </Link>
);

/**
 * Kartu Resep
 */
export const ResepCard = ({ item, linkTo }) => (
  <Link
    to={linkTo || `/resep/${item.id}`}
    className="card card-compact bg-base-100 dark:bg-[#14231e] shadow-md hover:shadow-xl border border-base-200 dark:border-emerald-900/30 overflow-hidden group transition-all duration-200 hover:-translate-y-1"
  >
    <figure className="relative h-48 overflow-hidden">
      <ImgWithFallback
        src={item.foto || item.fotoResep}
        alt={item.judulResep}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      {item.kategoriResep && (
        <span className="absolute top-3 left-3 badge badge-sm bg-orange-500/90 text-white border-0 font-bold backdrop-blur-sm">
          {item.kategoriResep}
        </span>
      )}
      {item.tingkatKesulitan && (
        <span className="absolute top-3 right-3 badge badge-sm bg-white/90 text-slate-700 border-0 font-semibold text-xs">
          {item.tingkatKesulitan}
        </span>
      )}
    </figure>
    <div className="card-body gap-2 px-4 py-3">
      <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug line-clamp-2">{item.judulResep}</h3>
      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" /> {item.waktuMasakMenit ? `${item.waktuMasakMenit} mnt` : '-'}
        </span>
        <span className="flex items-center gap-1">
          <Users className="w-3 h-3" /> {item.porsi ? `${item.porsi} porsi` : '-'}
        </span>
      </div>
      {item.deskripsi && (
        <p className="text-xs text-slate-400 line-clamp-2 mt-1">{item.deskripsi}</p>
      )}
    </div>
  </Link>
);

/**
 * Kartu Artikel/Edukasi
 */
const TAG_COLORS = {
  'Sains Pangan': 'badge-info',
  'Edukasi Halal': 'badge-success',
  'Resep Halal': 'badge-warning',
  'Travel Halal': 'badge-secondary',
  'Survival Guide': 'badge-accent',
  'Pangan Lokal': 'badge-primary',
};

export const ArtikelCard = ({ item, linkTo }) => (
  <Link
    to={linkTo || `/artikel/${item.id}`}
    className="card card-compact bg-base-100 dark:bg-[#14231e] shadow-md hover:shadow-xl border border-base-200 dark:border-emerald-900/30 overflow-hidden group transition-all duration-200 hover:-translate-y-1"
  >
    <figure className="relative h-44 overflow-hidden">
      <ImgWithFallback
        src={item.foto}
        alt={item.judul}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      {item.kategori && (
        <span className={`absolute top-3 left-3 badge badge-sm font-bold ${TAG_COLORS[item.kategori] || 'badge-ghost'}`}>
          {item.kategori}
        </span>
      )}
    </figure>
    <div className="card-body px-4 py-3 gap-2">
      <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug line-clamp-3">{item.judul}</h3>
      {item.ringkasan && (
        <p className="text-xs text-slate-400 line-clamp-2">{item.ringkasan}</p>
      )}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-auto pt-1">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" /> {item.waktuBaca || '5 menit'}
        </span>
        <span className="font-medium truncate max-w-[100px]">{item.penulis}</span>
      </div>
    </div>
  </Link>
);

/**
 * Empty state
 */
export const EmptyState = ({ title = 'Belum ada data', desc = '' }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
      <Leaf className="w-8 h-8 text-slate-300" />
    </div>
    <h3 className="text-base font-bold text-slate-600 dark:text-slate-300 mb-1">{title}</h3>
    {desc && <p className="text-sm text-slate-400 max-w-sm">{desc}</p>}
  </div>
);

/**
 * Section header
 */
export const SectionHeader = ({ badge, title, desc, linkTo, linkLabel = 'Lihat semua' }) => (
  <div className="flex items-end justify-between mb-8">
    <div>
      {badge && (
        <span className="badge badge-sm font-bold mb-2 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-0">
          {badge}
        </span>
      )}
      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">{title}</h2>
      {desc && <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">{desc}</p>}
    </div>
    {linkTo && (
      <Link
        to={linkTo}
        className="btn btn-sm btn-ghost text-emerald-600 dark:text-emerald-400 gap-1 font-semibold hidden sm:flex"
      >
        {linkLabel} <ChevronRight className="w-4 h-4" />
      </Link>
    )}
  </div>
);
