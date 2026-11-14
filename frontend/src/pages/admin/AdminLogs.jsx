import { useState, useEffect } from 'react';
import api from '../../services/api';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import {
  FileText,
  Search,
  Filter,
  Loader2,
  Calendar,
  User,
  X,
} from 'lucide-react';

const AdminLogs = () => {
  useDocumentTitle('Audit Log');

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [aksiFilter, setAksiFilter] = useState('ALL');
  const [modulFilter, setModulFilter] = useState('ALL');

  useEffect(() => {
    let ignore = false;
    api.get('/admin/logs')
      .then((res) => {
        if (!ignore && res.data?.success) {
          setLogs(res.data.data);
        }
      })
      .catch((err) => {
        console.error('Gagal mengambil log aktivitas:', err);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchSearch =
      !search ||
      log.deskripsi.toLowerCase().includes(search.toLowerCase()) ||
      log.adminName.toLowerCase().includes(search.toLowerCase());

    const matchAksi = aksiFilter === 'ALL' || log.aksi === aksiFilter;
    const matchModul = modulFilter === 'ALL' || log.modulTarget === modulFilter;

    return matchSearch && matchAksi && matchModul;
  });

  return (
    <div className="space-y-8">
      {/* Header Modul */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-[#f9f6ef] tracking-tight flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#1b6a54]/10 dark:bg-[#1b6a54]/30 text-[#1b6a54] dark:text-[#dec684]">
              <FileText className="w-7 h-7" />
            </div>
            <span>Audit Log & Jejak Aktivitas Administrator</span>
          </h2>
          <p className="text-base text-slate-600 dark:text-[#dec684]/80 mt-1.5 font-medium">
            Pencatatan riwayat setiap aksi penambahan, perubahan, dan verifikasi data di platform Halal Channel.
          </p>
        </div>
      </div>

      {/* Filter & Pencarian dengan daisyUI Input & Select */}
      <div className="card card-bordered bg-white dark:bg-[#14231e] rounded-3xl border-[#e8dfcf] dark:border-[#223831] shadow-xs">
        <div className="card-body p-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <label className="input input-bordered flex items-center gap-2 h-auto px-4 py-2.5 rounded-2xl bg-white dark:bg-[#1a2d27] border-slate-300 dark:border-[#28443b] focus-within:border-[#1b6a54] flex-1">
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari rincian aktivitas atau nama admin..."
                className="grow text-sm text-slate-800 dark:text-slate-200 bg-transparent outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </label>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <Filter className="w-3.5 h-3.5" />
                <span>Filter</span>
              </div>

              <select
                value={aksiFilter}
                onChange={(e) => setAksiFilter(e.target.value)}
                className="select select-bordered px-3 py-2 h-auto rounded-2xl border-slate-300 dark:border-[#28443b] text-sm text-slate-800 dark:text-slate-200 bg-white dark:bg-[#1a2d27] focus:border-[#1b6a54] font-medium"
              >
                <option value="ALL">Semua Jenis Aksi</option>
                <option value="CREATE">CREATE</option>
                <option value="UPDATE">UPDATE</option>
                <option value="DELETE">DELETE</option>
                <option value="VERIFY">VERIFY</option>
                <option value="LOGIN">LOGIN</option>
              </select>

              <select
                value={modulFilter}
                onChange={(e) => setModulFilter(e.target.value)}
                className="select select-bordered px-3 py-2 h-auto rounded-2xl border-slate-300 dark:border-[#28443b] text-sm text-slate-800 dark:text-slate-200 bg-white dark:bg-[#1a2d27] focus:border-[#1b6a54] font-medium"
              >
                <option value="ALL">Semua Modul Target</option>
                <option value="KULINER">KULINER</option>
                <option value="ARTIKEL_EDUKASI">ARTIKEL_EDUKASI</option>
                <option value="RESEP_HALAL">RESEP_HALAL</option>
                <option value="WISATA">WISATA</option>
                <option value="MEDIA">MEDIA</option>
                <option value="USER">USER</option>
              </select>

              {(search || aksiFilter !== 'ALL' || modulFilter !== 'ALL') && (
                <div className="badge bg-[#1b6a54]/10 dark:bg-[#1b6a54]/30 text-[#1b6a54] dark:text-[#dec684] border-none font-bold text-xs py-3 px-3 rounded-xl flex-shrink-0">
                  {filteredLogs.length} log
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabel Audit Log dengan daisyUI Table & Card */}
      <div className="card card-bordered bg-white dark:bg-[#14231e] rounded-3xl border-[#e8dfcf] dark:border-[#223831] shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin mx-auto text-[#1b6a54] dark:text-[#dec684] mb-3" />
            <p className="text-sm font-semibold">Memuat rekam jejak audit log...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full text-left">
              <thead>
                <tr className="bg-[#f9f6ef]/80 dark:bg-[#162722] border-b border-[#e8dfcf] dark:border-[#223831] text-xs font-extrabold text-[#a08145] dark:text-[#dec684] uppercase tracking-wider">
                  <th className="py-4 px-5">Waktu Kejadian</th>
                  <th className="py-4 px-5">Administrator</th>
                  <th className="py-4 px-5">Jenis Aksi</th>
                  <th className="py-4 px-5">Modul Target</th>
                  <th className="py-4 px-5">Deskripsi Rincian Tindakan</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#f9f6ef]/40 dark:hover:bg-[#1a2d27]/70 transition">
                      <td className="py-4 px-5 text-slate-500 dark:text-slate-400 whitespace-nowrap font-mono text-xs">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span>{new Date(log.waktu).toLocaleString('id-ID')}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2 font-extrabold text-slate-900 dark:text-[#f9f6ef]">
                          <User className="w-4 h-4 text-[#1b6a54] dark:text-[#dec684]" />
                          <span>{log.adminName}</span>
                        </div>
                        <div className="text-xs text-slate-400 truncate mt-0.5">
                          {log.adminEmail}
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <span
                          className={`badge font-bold text-xs uppercase px-3 py-2.5 rounded-lg border-none ${
                            log.aksi === 'CREATE'
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                              : log.aksi === 'UPDATE'
                              ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300'
                              : log.aksi === 'DELETE'
                              ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                              : log.aksi === 'VERIFY'
                              ? 'bg-[#1b6a54] text-[#f9f6ef]'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {log.aksi}
                        </span>
                      </td>
                      <td className="py-4 px-5 font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                        {log.modulTarget}
                      </td>
                      <td className="py-4 px-5 text-slate-700 dark:text-slate-200 leading-relaxed max-w-lg">
                        {log.deskripsi}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-16 text-center font-medium">
                      <div className="flex flex-col items-center gap-3 text-slate-400 dark:text-slate-500">
                        <FileText className="w-10 h-10 opacity-30" />
                        <span>
                          {search || aksiFilter !== 'ALL' || modulFilter !== 'ALL'
                            ? 'Tidak ada entri log yang cocok dengan kriteria filter.'
                            : 'Belum ada rekaman audit log sistem.'}
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
    </div>
  );
};

export default AdminLogs;
