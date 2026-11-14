/**
 * ImageInput.jsx
 * Komponen field gambar dengan dua mode:
 *   1. Upload dari perangkat  → menghasilkan base64 / object URL untuk preview lokal
 *   2. Input URL eksternal    → Unsplash, CDN, dsb.
 *
 * Props:
 *   value    {string}  – URL saat ini (bisa http(s):// atau data:image/...)
 *   onChange {fn}      – dipanggil dengan nilai string baru
 *   label    {string}
 *   required {boolean}
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { Image, X, Link as LinkIcon, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';

/* ── Deteksi apakah value adalah data URL (hasil upload lokal) ── */
const isDataUrl = (v) => typeof v === 'string' && v.startsWith('data:image');
const isHttpUrl = (v) => typeof v === 'string' && (v.startsWith('http://') || v.startsWith('https://'));

/* ── Konversi File ke base64 ── */
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

/* ── Validasi tipe file ── */
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE_MB = 5;

const ImageInput = ({
  value = '',
  onChange,
  label = 'Gambar Utama',
  required = false,
}) => {
  /* tab: 'upload' | 'url' */
  const [tab, setTab] = useState(() => (isDataUrl(value) ? 'upload' : 'url'));
  const [urlInput, setUrlInput] = useState(() => (isHttpUrl(value) ? value : ''));
  const [previewSrc, setPreviewSrc] = useState(value || '');
  const [previewErr, setPreviewErr] = useState(false);
  const [fileError, setFileError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  /* Sinkronisasi preview saat value berubah dari luar (mode edit) */
  useEffect(() => {
    if (value) {
      setPreviewSrc(value);
      setPreviewErr(false);
      if (isHttpUrl(value)) {
        setUrlInput(value);
        setTab('url');
      } else if (isDataUrl(value)) {
        setTab('upload');
      }
    } else {
      setPreviewSrc('');
      setUrlInput('');
    }
  }, [value]);

  /* ── Handler URL ── */
  const handleUrlChange = (v) => {
    setUrlInput(v);
    setPreviewErr(false);
    onChange(v);
    setPreviewSrc(v);
  };

  /* ── Handler file (dari input atau drag-drop) ── */
  const processFile = useCallback(
    async (file) => {
      if (!file) return;
      setFileError('');

      if (!ACCEPTED.includes(file.type)) {
        setFileError('Format tidak didukung. Gunakan JPG, PNG, WebP, atau GIF.');
        return;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setFileError(`Ukuran file terlalu besar. Maksimal ${MAX_SIZE_MB} MB.`);
        return;
      }

      try {
        const base64 = await fileToBase64(file);
        setPreviewSrc(base64);
        setPreviewErr(false);
        onChange(base64);
      } catch {
        setFileError('Gagal membaca file. Coba pilih gambar lain.');
      }
    },
    [onChange]
  );

  const handleFileInput = (e) => {
    processFile(e.target.files?.[0]);
    /* Reset input agar file yang sama bisa dipilih ulang */
    e.target.value = '';
  };

  /* ── Drag & Drop ── */
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files?.[0]);
  };

  /* ── Hapus gambar ── */
  const handleClear = () => {
    setPreviewSrc('');
    setPreviewErr(false);
    setUrlInput('');
    setFileError('');
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  /* ── Ganti tab ── */
  const handleTabChange = (t) => {
    setTab(t);
    setFileError('');
    setPreviewErr(false);
    if (t === 'url') {
      /* Jika sebelumnya upload lokal, bersihkan */
      if (isDataUrl(previewSrc)) {
        setPreviewSrc('');
        onChange('');
      }
    } else {
      /* Jika sebelumnya URL, bersihkan */
      if (isHttpUrl(previewSrc)) {
        setPreviewSrc('');
        setUrlInput('');
        onChange('');
      }
    }
  };

  return (
    <div>
      {/* Label */}
      <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>

      {/* Tab switcher */}
      <div className="flex gap-1 mb-3 p-1 rounded-2xl bg-slate-100 dark:bg-[#162722] w-fit">
        <button
          type="button"
          onClick={() => handleTabChange('upload')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            tab === 'upload'
              ? 'bg-white dark:bg-[#1b6a54] text-[#1b6a54] dark:text-[#dec684] shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          Upload dari Perangkat
        </button>
        <button
          type="button"
          onClick={() => handleTabChange('url')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            tab === 'url'
              ? 'bg-white dark:bg-[#1b6a54] text-[#1b6a54] dark:text-[#dec684] shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          URL Gambar
        </button>
      </div>

      {/* ── Tab: Upload ── */}
      {tab === 'upload' && (
        <div>
          {/* Drop zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-dashed cursor-pointer transition-all select-none ${
              isDragging
                ? 'border-[#1b6a54] bg-[#1b6a54]/10 dark:bg-[#1b6a54]/20'
                : 'border-slate-300 dark:border-[#28443b] hover:border-[#1b6a54] dark:hover:border-[#1b6a54] bg-slate-50 dark:bg-[#0f1915] hover:bg-[#1b6a54]/5 dark:hover:bg-[#1b6a54]/10'
            }`}
          >
            <div className={`p-3 rounded-2xl ${isDragging ? 'bg-[#1b6a54]/20' : 'bg-slate-100 dark:bg-[#1a2d27]'}`}>
              <Upload className={`w-6 h-6 ${isDragging ? 'text-[#1b6a54]' : 'text-slate-400'}`} />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Klik untuk pilih gambar <span className="text-[#1b6a54] dark:text-[#dec684]">atau seret ke sini</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">JPG, PNG, WebP, GIF — maks. {MAX_SIZE_MB} MB</p>
            </div>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED.join(',')}
            onChange={handleFileInput}
            className="hidden"
          />

          {/* Error file */}
          {fileError && (
            <div className="mt-2 flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {fileError}
            </div>
          )}
        </div>
      )}

      {/* ── Tab: URL ── */}
      {tab === 'url' && (
        <div className="flex items-center gap-2 input input-bordered h-auto px-4 py-2.5 rounded-2xl bg-white dark:bg-[#1a2d27] border-slate-300 dark:border-[#28443b] focus-within:border-[#1b6a54]">
          <LinkIcon className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input
            type="url"
            value={urlInput}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://images.unsplash.com/photo-...?w=800&q=80"
            required={required && tab === 'url'}
            className="grow text-sm text-slate-800 dark:text-slate-200 bg-transparent outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          {urlInput && (
            <button
              type="button"
              onClick={handleClear}
              className="text-slate-400 hover:text-rose-500 transition flex-shrink-0"
              title="Hapus URL"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* ── Preview ── */}
      {previewSrc && !previewErr && (
        <div className="mt-3 relative rounded-2xl overflow-hidden border border-slate-200 dark:border-[#28443b] bg-slate-100 dark:bg-[#0f1915] group">
          <img
            src={previewSrc}
            alt="Preview gambar"
            className="w-full h-52 object-cover"
            onError={() => setPreviewErr(true)}
            onLoad={() => setPreviewErr(false)}
          />
          {/* Overlay info + tombol hapus */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-white text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Gambar berhasil dimuat
              </span>
              <button
                type="button"
                onClick={handleClear}
                className="btn btn-xs btn-circle bg-rose-600 hover:bg-rose-700 border-0 text-white"
                title="Hapus gambar"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error preview URL */}
      {previewSrc && previewErr && (
        <div className="mt-3 flex items-center gap-3 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Gambar tidak dapat dimuat</p>
            <p className="text-xs mt-0.5 text-rose-500">Periksa kembali URL atau coba gambar lain.</p>
          </div>
          <button type="button" onClick={handleClear} className="ml-auto text-rose-400 hover:text-rose-600 transition">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Empty state */}
      {!previewSrc && !fileError && tab === 'url' && !urlInput && (
        <div className="mt-3 flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-[#0f1915] border border-dashed border-slate-200 dark:border-[#28443b] text-slate-400 text-xs">
          <Image className="w-4 h-4 flex-shrink-0" />
          <span>Masukkan URL gambar untuk melihat preview. Contoh: Unsplash, CDN, atau hosting gambar publik.</span>
        </div>
      )}
    </div>
  );
};

export default ImageInput;
