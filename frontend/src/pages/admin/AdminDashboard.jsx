import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import {
  BookOpen,
  Store,
  Video,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowUpRight,
  PlusCircle,
  FileText,
  UserPlus,
  Loader2,
  Activity,
} from 'lucide-react';

const AdminDashboard = () => {
  useDocumentTitle('Dashboard Admin');

  const [stats, setStats] = useState({
    totalArtikel: 0,
    totalResep: 0,
    totalKuliner: 0,
    totalWisata: 0,
    totalMedia: 0,
    statusVerifikasi: {
      draft: 0,
      inReview: 0,
      verified: 0,
    },
  });

  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    Promise.all([
      api.get('/admin/dashboard/stats').catch(() => ({ data: { data: null } })),
      api.get('/admin/logs').catch(() => ({ data: { data: [] } })),
    ])
      .then(([statsRes, logsRes]) => {
        if (!ignore) {
          if (statsRes.data?.success) {
            setStats(statsRes.data.data);
          }
          if (logsRes.data?.success) {
            setRecentLogs(logsRes.data.data.slice(0, 6));
          }
        }
      })
      .catch((err) => {
        console.error('Error memuat data dashboard:', err);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const totalEdukasiResep = (stats.totalArtikel || 0) + (stats.totalResep || 0);
  const totalKulinerWisata = (stats.totalKuliner || 0) + (stats.totalWisata || 0);

  if (loading) {
    return (
      <div className="py-28 flex flex-col items-center justify-center text-slate-500 dark:text-[#dec684]">
        <Loader2 className="w-10 h-10 animate-spin text-[#1b6a54] dark:text-[#dec684] mb-3" />
        <p className="text-base font-semibold">Memuat ringkasan analitik dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* ========================================================
          HEADER RINGKASAN & AKSI CEPAT (daisyUI Button)
      ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-[#f9f6ef] tracking-tight">
            Dashboard Overview
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-[#dec684]/90 mt-1.5 font-medium">
            Ringkasan status agregasi konten dan aktivitas sistem Halal Channel.
          </p>
        </div>

        {/* Shortcut Tombol Aksi Cepat dengan daisyUI btn */}
        <div className="flex items-center gap-3">
          <Link
            to="/admin/kuliner"
            className="btn bg-[#1b6a54] hover:bg-[#145241] text-[#f9f6ef] border-none text-sm font-bold h-auto py-3 px-5 rounded-2xl shadow-md hover:shadow-lg transition duration-150 gap-2"
          >
            <PlusCircle className="w-5 h-5 text-[#dec684]" />
            <span>Tambah Kuliner</span>
          </Link>
          <Link
            to="/admin/users"
            className="btn bg-white dark:bg-[#1a2d27] hover:bg-[#dec684]/15 text-slate-800 dark:text-[#f9f6ef] border border-[#e8dfcf] dark:border-[#28443b] text-sm font-bold h-auto py-3 px-5 rounded-2xl shadow-xs transition duration-150 gap-2"
          >
            <UserPlus className="w-5 h-5 text-[#a08145] dark:text-[#dec684]" />
            <span>Tambah Pengguna</span>
          </Link>
        </div>
      </div>

      {/* ========================================================
          EMPAT METRIC CARDS STATISTIK UTAMA (daisyUI stats, stat, card)
      ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Kartu 1: Edukasi & Resep */}
        <Link
          to="/admin/edukasi"
          className="card card-bordered bg-white dark:bg-[#14231e] border-[#e8dfcf] dark:border-[#223831] shadow-xs hover:shadow-xl hover:border-[#1b6a54] transition duration-200 rounded-3xl group overflow-hidden"
        >
          <div className="card-body p-6 sm:p-7 stat">
            <div className="flex items-center justify-between">
              <span className="stat-title text-xs sm:text-sm font-extrabold text-[#1b6a54] dark:text-[#dec684] uppercase tracking-wider p-0">
                Edukasi & Resep
              </span>
              <div className="stat-figure text-[#1b6a54] dark:text-[#dec684] w-14 h-14 rounded-2xl bg-[#1b6a54]/10 dark:bg-[#1b6a54]/30 flex items-center justify-center group-hover:scale-110 transition duration-150 shadow-inner">
                <BookOpen className="w-7 h-7" />
              </div>
            </div>
            <div className="stat-value text-4xl sm:text-5xl font-black text-slate-900 dark:text-[#f9f6ef] mt-2 p-0">
              {totalEdukasiResep}
            </div>
            <div className="stat-desc text-sm text-slate-500 dark:text-slate-400 font-medium p-0">
              konten terbit
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-[#1b6a54] dark:text-[#dec684] font-bold border-t border-[#e8dfcf] dark:border-[#223831] pt-3">
              <span>{stats.totalArtikel || 0} Artikel &bull; {stats.totalResep || 0} Resep</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#1b6a54] dark:group-hover:text-[#dec684] group-hover:translate-x-0.5 transition" />
            </div>
          </div>
        </Link>

        {/* Kartu 2: Kuliner & Wisata */}
        <Link
          to="/admin/kuliner"
          className="card card-bordered bg-white dark:bg-[#14231e] border-[#e8dfcf] dark:border-[#223831] shadow-xs hover:shadow-xl hover:border-[#a08145] transition duration-200 rounded-3xl group overflow-hidden"
        >
          <div className="card-body p-6 sm:p-7 stat">
            <div className="flex items-center justify-between">
              <span className="stat-title text-xs sm:text-sm font-extrabold text-[#a08145] dark:text-[#dec684] uppercase tracking-wider p-0">
                Kuliner & Wisata
              </span>
              <div className="stat-figure text-[#a08145] dark:text-[#dec684] w-14 h-14 rounded-2xl bg-[#a08145]/15 dark:bg-[#a08145]/30 flex items-center justify-center group-hover:scale-110 transition duration-150 shadow-inner">
                <Store className="w-7 h-7" />
              </div>
            </div>
            <div className="stat-value text-4xl sm:text-5xl font-black text-slate-900 dark:text-[#f9f6ef] mt-2 p-0">
              {totalKulinerWisata}
            </div>
            <div className="stat-desc text-sm text-slate-500 dark:text-slate-400 font-medium p-0">
              titik direktori
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-[#a08145] dark:text-[#dec684] font-bold border-t border-[#e8dfcf] dark:border-[#223831] pt-3">
              <span>{stats.totalKuliner || 0} Kuliner &bull; {stats.totalWisata || 0} Wisata</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#a08145] dark:group-hover:text-[#dec684] group-hover:translate-x-0.5 transition" />
            </div>
          </div>
        </Link>

        {/* Kartu 3: Media Audio / Video */}
        <Link
          to="/admin/media"
          className="card card-bordered bg-white dark:bg-[#14231e] border-[#e8dfcf] dark:border-[#223831] shadow-xs hover:shadow-xl hover:border-[#1b6a54] transition duration-200 rounded-3xl group overflow-hidden"
        >
          <div className="card-body p-6 sm:p-7 stat">
            <div className="flex items-center justify-between">
              <span className="stat-title text-xs sm:text-sm font-extrabold text-[#1b6a54] dark:text-[#dec684] uppercase tracking-wider p-0">
                Podcast & Shorts
              </span>
              <div className="stat-figure text-[#1b6a54] dark:text-[#dec684] w-14 h-14 rounded-2xl bg-[#dec684]/30 dark:bg-[#dec684]/20 flex items-center justify-center group-hover:scale-110 transition duration-150 shadow-inner">
                <Video className="w-7 h-7" />
              </div>
            </div>
            <div className="stat-value text-4xl sm:text-5xl font-black text-slate-900 dark:text-[#f9f6ef] mt-2 p-0">
              {stats.totalMedia || 0}
            </div>
            <div className="stat-desc text-sm text-slate-500 dark:text-slate-400 font-medium p-0">
              episode media
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-[#1b6a54] dark:text-[#dec684] font-bold border-t border-[#e8dfcf] dark:border-[#223831] pt-3">
              <span>Model Dialog Escape</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#1b6a54] dark:group-hover:text-[#dec684] group-hover:translate-x-0.5 transition" />
            </div>
          </div>
        </Link>

        {/* Kartu 4: Status Verifikasi */}
        <div className="card card-bordered bg-white dark:bg-[#14231e] border-[#e8dfcf] dark:border-[#223831] shadow-xs rounded-3xl overflow-hidden">
          <div className="card-body p-6 sm:p-7 stat">
            <div className="flex items-center justify-between">
              <span className="stat-title text-xs sm:text-sm font-extrabold text-[#a08145] dark:text-[#dec684] uppercase tracking-wider p-0">
                Verifikasi Halal
              </span>
              <div className="stat-figure text-[#a08145] dark:text-[#dec684] w-14 h-14 rounded-2xl bg-[#dec684]/20 dark:bg-[#dec684]/15 flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-7 h-7" />
              </div>
            </div>
            <div className="stat-value text-4xl sm:text-5xl font-black text-[#1b6a54] dark:text-[#dec684] mt-2 p-0">
              {stats.statusVerifikasi?.verified || 0}
            </div>
            <div className="stat-desc text-sm text-slate-500 dark:text-slate-400 font-medium p-0">
              terverifikasi BPJPH
            </div>
            <div className="mt-3 flex items-center justify-between text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold border-t border-[#e8dfcf] dark:border-[#223831] pt-3">
              <span className="flex items-center gap-1.5">
                <span className="badge badge-xs bg-[#a08145] border-none"></span>
                {stats.statusVerifikasi?.inReview || 0} In Review
              </span>
              <span className="flex items-center gap-1.5">
                <span className="badge badge-xs bg-slate-300 dark:bg-slate-600 border-none"></span>
                {stats.statusVerifikasi?.draft || 0} Draft
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          PANEL LOG AKTIVITAS TERBARU & STATUS VERIFIKASI (daisyUI table & card)
      ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Panel Kiri (2 Kolom): Tabel Log Aktivitas Terbaru */}
        <div className="lg:col-span-2 card card-bordered bg-white dark:bg-[#14231e] border-[#e8dfcf] dark:border-[#223831] shadow-xs rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-[#e8dfcf] dark:border-[#223831] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#1b6a54]/10 dark:bg-[#1b6a54]/30 text-[#1b6a54] dark:text-[#dec684]">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-[#f9f6ef] text-base sm:text-lg">
                Log Aktivitas Sistem Terbaru
              </h3>
            </div>
            <Link
              to="/admin/logs"
              className="btn btn-ghost btn-sm text-xs sm:text-sm font-bold text-[#1b6a54] dark:text-[#dec684] hover:bg-[#1b6a54]/10 rounded-xl gap-1.5"
            >
              <span>Lihat Semua</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            {/* daisyUI Table Table-Zebra */}
            <table className="table table-zebra w-full text-left">
              <thead>
                <tr className="bg-[#f9f6ef]/80 dark:bg-[#162722] border-b border-[#e8dfcf] dark:border-[#223831] text-xs font-extrabold text-[#a08145] dark:text-[#dec684] uppercase tracking-wider">
                  <th className="py-4 px-5">Waktu</th>
                  <th className="py-4 px-5">Admin</th>
                  <th className="py-4 px-5">Aksi</th>
                  <th className="py-4 px-5">Modul</th>
                  <th className="py-4 px-5">Deskripsi</th>
                </tr>
              </thead>
              <tbody className="text-xs sm:text-sm font-medium">
                {recentLogs.length > 0 ? (
                  recentLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#f9f6ef]/40 dark:hover:bg-[#1a2d27]/70 transition">
                      <td className="py-4 px-5 text-slate-500 dark:text-slate-400 whitespace-nowrap font-mono text-xs">
                        {new Date(log.waktu).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-4 px-5 font-bold text-slate-900 dark:text-[#f9f6ef] whitespace-nowrap">
                        {log.adminName}
                      </td>
                      <td className="py-4 px-5">
                        <span
                          className={`badge font-bold text-xs uppercase px-3 py-2.5 rounded-lg border-none ${
                            log.aksi === 'CREATE'
                              ? 'bg-[#1b6a54]/15 text-[#1b6a54] dark:bg-[#1b6a54]/30 dark:text-[#dec684]'
                              : log.aksi === 'UPDATE'
                              ? 'bg-[#a08145]/15 text-[#a08145] dark:bg-[#a08145]/30 dark:text-[#dec684]'
                              : log.aksi === 'DELETE'
                              ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
                              : log.aksi === 'VERIFY'
                              ? 'bg-[#1b6a54] text-[#f9f6ef]'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {log.aksi}
                        </span>
                      </td>
                      <td className="py-4 px-5 font-mono text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {log.modulTarget}
                      </td>
                      <td className="py-4 px-5 text-slate-700 dark:text-slate-300 max-w-sm truncate font-medium">
                        {log.deskripsi}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-slate-400 font-medium">
                      Belum ada riwayat aktivitas yang tercatat.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Panel Kanan (1 Kolom): Status Verifikasi & Navigasi Cepat (daisyUI Card) */}
        <div className="space-y-6">
          <div className="card card-bordered bg-white dark:bg-[#14231e] border-[#e8dfcf] dark:border-[#223831] shadow-xs rounded-3xl">
            <div className="card-body p-6 sm:p-7">
              <h3 className="card-title font-extrabold text-slate-900 dark:text-[#f9f6ef] text-base sm:text-lg mb-4">
                Distribusi Status Konten
              </h3>

              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-sm font-bold mb-1.5">
                    <span className="text-[#1b6a54] dark:text-[#dec684] flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Disetujui / Verified
                    </span>
                    <span className="text-slate-900 dark:text-[#f9f6ef]">
                      {stats.statusVerifikasi?.verified || 0}
                    </span>
                  </div>
                  {/* daisyUI Progress bar */}
                  <div className="w-full h-3 bg-[#e8dfcf] dark:bg-[#223831] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#1b6a54] rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          ((stats.statusVerifikasi?.verified || 0) /
                            Math.max(1, (stats.statusVerifikasi?.verified || 0) + (stats.statusVerifikasi?.inReview || 0) + (stats.statusVerifikasi?.draft || 0))) *
                            100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm font-bold mb-1.5">
                    <span className="text-[#a08145] dark:text-[#dec684] flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Menunggu Peninjauan
                    </span>
                    <span className="text-slate-900 dark:text-[#f9f6ef]">
                      {stats.statusVerifikasi?.inReview || 0}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-[#e8dfcf] dark:bg-[#223831] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#a08145] rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          ((stats.statusVerifikasi?.inReview || 0) /
                            Math.max(1, (stats.statusVerifikasi?.verified || 0) + (stats.statusVerifikasi?.inReview || 0) + (stats.statusVerifikasi?.draft || 0))) *
                            100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm font-bold mb-1.5">
                    <span className="text-slate-600 dark:text-slate-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" /> Draft / Arsip
                    </span>
                    <span className="text-slate-900 dark:text-[#f9f6ef]">
                      {stats.statusVerifikasi?.draft || 0}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-[#e8dfcf] dark:bg-[#223831] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-400 dark:bg-slate-600 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          ((stats.statusVerifikasi?.draft || 0) /
                            Math.max(1, (stats.statusVerifikasi?.verified || 0) + (stats.statusVerifikasi?.inReview || 0) + (stats.statusVerifikasi?.draft || 0))) *
                            100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Banner Promo Brand Halal Channel */}
          <div className="card bg-gradient-to-br from-[#1b6a54] via-[#145241] to-[#0f3c30] rounded-3xl text-[#f9f6ef] shadow-lg relative overflow-hidden border border-[#dec684]/20">
            <div className="card-body p-6 sm:p-7">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-[#dec684]/10 blur-xl pointer-events-none"></div>
              <h4 className="card-title font-extrabold text-lg sm:text-xl mb-2 text-[#f9f6ef]">
                Platform Halal Channel
              </h4>
              <p className="text-sm text-[#dec684] leading-relaxed mb-5 font-medium">
                Pusat referensi sains pangan halal, kurasi kuliner ramah Muslim, dan panduan gaya hidup thayyib Kota Depok.
              </p>
              <div className="card-actions">
                <Link
                  to="/admin/kuliner"
                  className="btn bg-[#dec684] text-[#1b6a54] hover:bg-white border-none text-xs sm:text-sm font-bold transition shadow-sm rounded-xl h-auto py-2.5 px-4 gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Kelola Direktori Resto Korea & ID</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
