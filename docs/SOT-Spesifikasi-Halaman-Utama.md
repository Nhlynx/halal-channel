# Single Source of Truth (SOT) — Spesifikasi Antarmuka dan Arsitektur Halaman Utama (Homepage / Home.jsx)

## 1. Orientasi dan Spesifikasi Fondasi Halaman Utama

Halaman Utama (Homepage / `Home.jsx`) merupakan pintu gerbang utama (*front-facing landing page*) dari ekosistem digital **HalalChannel.id** dan **RPNN Depok**. Halaman ini dirancang untuk menyajikan pengalaman jelajah (*browsing experience*) yang responsif, visual, interaktif, serta berbasis sains dan gaya hidup ramah Muslim bagi pengguna umum (*User/Visitor*).

Desain tata letak (*layout*) Halaman Utama ini mengadaptasi dan menyelaraskan pola *user experience* (UX) serta komponen navigasi dari platform rujukan global pariwisata dan gaya hidup halal *LetsGoHalal*. Rujukan visual tersebut disesuaikan dengan identitas brand *Halal Channel* menggunakan komponen **daisyUI** dan **Tailwind CSS** dengan skema warna primer *Emerald / Corporate Green* (`#059669` / `#10B981`) yang melambangkan kebersihan, kepatuhan syariat, dan keaslian (*thayyib*).

Dokumen Single Source of Truth (SOT) ini disusun sebagai pedoman teknis baku bagi pengembang *frontend* (React + Vite) dan *backend* (Express.js + Prisma ORM) dalam mewujudkan antarmuka Halaman Utama yang kaya visual, terintegrasi dengan mesin pencari *real-time*, serta siap dihubungkan dengan CMS Admin Dashboard.

---

## 2. Struktur Tata Letak dan Hierarki Visual UI/UX

Antarmuka `Home.jsx` disusun secara modular dan vertikal dari atas ke bawah, mengadopsi 8 blok komponen visual utama yang menghadirkan kepadatan informasi yang terstruktur dan mudah dipindai (*scannable*).

### 2.1. Pembagian Blok Komponental Halaman Utama

1. **Header & Navigation Bar (`Navbar.jsx`)**: Menampilkan Logo *Halal Channel / RPNN Depok*, menu navigasi utama (Beranda, Wisata Halal, Kuliner & Resto Korea, Resep, Sains Pangan, Podcast), indikator status login pengguna (Tautan Login / Profile Avatar), dan pemilih bahasa/tema.
2. **Hero Banner & Mesin Pencari Utama (`HeroSearch.jsx`)**: Banner utama bergaya *LetsGoHalal* dengan latar visual inspiratif, judul tajam ("Platform Terintegrasi Edukasi Sains, Gaya Hidup Halal & Wisata Ramah Muslim"), serta bilah pencarian interaktif yang menonjol.
3. **Bar Navigasi Kategori Cepat (`CategoryPills.jsx`)**: *Filter pill bar* interaktif untuk menyaring konten secara instan berdasarkan pilar utama (Wisata Halal, Kuliner Korea, Resep Pangan, Sains & Edukasi, Media Podcast).
4. **Seksi Wisata Halal & Galeri Visual (`WisataSection.jsx`)**: Seksi berfitur visual tinggi (*rich image density*) yang menampilkan destinasi wisata ramah Muslim favorit, lengkap dengan informasi fasilitas ibadah, peta geolokasi, dan galeri foto placeholder berkualitas tinggi.
5. **Seksi Kuliner Halal & Resto Korea (`KulinerSection.jsx`)**: Showcase rekomendasi tempat makan halal dan katalog restoran Korea terverifikasi BPJPH/Thayyib di Indonesia/Depok.
6. **Seksi Artikel Sains Pangan & Resep Halal (`ContentCMSSection.jsx`)**: Kartu artikel edukasi populer (seperti pembahasan *sains pangan*, *uji lab*, dan *resep kuliner halal*).
7. **Seksi Media Podcast & Video Shorts (`PodcastSection.jsx`)**: Frame pemutar media podcast kasual (model *Escape / Putar Balik*) dan cuplikan video pendek.
8. **Footer Terintegrasi (`Footer.jsx`)**: Footer lengkap sesuai standar *LetsGoHalal* mencakup informasi portal, navigasi cepat, area kemitraan B2B/LPH, link regulasi privasi, dan hak cipta.

---

## 3. Spesifikasi Komponen & Panduan Elemen daisyUI

Tabel berikut menetapkan spesifikasi komponen antarmuka, kelas komponen daisyUI yang digunakan, jenis input, serta perilaku visual di sisi *frontend*:

| Blok Antarmuka | Komponen / Kelas daisyUI | Elemen & Data Tampilan | Perilaku & Interaksi Visual |
| :--- | :--- | :--- | :--- |
| **Navbar Utama** | `navbar bg-base-100 shadow-sm sticky top-0 z-50` | Logo Web, Menu Navigasi, Badge Status Login | Sticky di atas layar, responsif (hamburger menu `drawer` di mobile). |
| **Hero Banner** | `hero min-h-[70vh] bg-base-200 relative` | Background Image Overlay, Typography Heading, Subtitle | Visual hero berukuran besar dengan lapisan transparan abu-abu/hijau. |
| **Bilah Pencarian (Search)** | `join input input-lg input-bordered w-full shadow-lg` | Input Teks, Filter Dropdown, Tombol `btn btn-primary` | Pencarian *live debounce* (300ms) dengan *dropdown preview* hasil. |
| **Pill Kategori** | `badge badge-lg badge-outline hover:badge-primary cursor-pointer` | Tombol Ikon & Label Kategori (Wisata, Kuliner, Resep, Sains) | Mengubah state kategori aktif dan menyaring kartu konten secara *real-time*. |
| **Kartu Wisata (Rich Visual)** | `card card-compact bg-base-100 shadow-xl image-full hover:scale-105 transition` | Foto Visual Utama (Placeholder), Rating, Badge Ibadah, Lokasi | Gambar memenuhi kartu dengan efek *overlay gradient* dan teks info di atasnya. |
| **Kartu Kuliner Korea** | `card card-side bg-base-100 shadow-md border border-base-200` | Foto Makanan/Resto, Badge "Sertifikat BPJPH", Rating Bintang, Alamat | Layout mendatar (*card-side*) di desktop, responsif di seluler. |
| **Kartu Sains & Resep** | `card card-compact bg-base-100 shadow-md` | Thumbnail Artikel/Resep, Tag Sains/Thayyib, Waktu Baca, Penulis | Tampilan kisi 3 atau 4 kolom dengan label tag berwarna khas (`badge-accent`). |
| **Pemutar Podcast** | `card bg-neutral text-neutral-content shadow-2xl` | Embedded Player / Video Frame, Judul Episode, Tag "Podcast Kasual" | Latar gelap kontras untuk menonjolkan tayangan media video/audio. |
| **State Loading** | `skeleton h-64 w-full rounded-box` | Animasi shimmer skeleton loaders | Tampil saat data dari backend sedang diambil (`loading = true`). |

---

## 4. Arsitektur Teknis Mesin Pencari Interaktif (Search Engine)

Fitur pencarian (*Search*) di Halaman Utama dirancang agar berfungsi penuh (*fully functional*) secara *real-time* dengan penanganan kata kunci fleksibel lintas modul data (Artikel, Resep, Kuliner, Wisata).

### 4.1. Spesifikasi Kontrak API Backend

* **URL Endpoint**: `/api/search`
* **Metode HTTP**: `GET`
* **Query Parameters**:
  * `q` (string, opsional): Kata kunci pencarian (misal: `"Korea"`, `"Koro"`, `"Myeongdong"`, `"Ayam"`, `"Ramadhan"`).
  * `category` (string, opsional): Kategori filter (`"all"`, `"wisata"`, `"kuliner"`, `"resep"`, `"edukasi"`).
  * `page` (number, default: `1`): Nomor halaman.
  * `limit` (number, default: `12`): Jumlah item per halaman.

#### Format Respon API Berhasil (`200 OK`):

```json
{
  "success": true,
  "message": "Hasil pencarian berhasil ditemukan",
  "totalResults": 3,
  "query": "Korea",
  "data": {
    "wisata": [
      {
        "id": "w-uuid-001",
        "nama": "Spot Wisata Sejarah & Resto Korea Halal Myeongdong",
        "kategori": "Wisata International",
        "lokasi": "Myeongdong, Seoul / Depok Partner",
        "fotoUtama": "/assets/placeholders/wisata-korea.jpg",
        "rating": 4.9,
        "fasilitasIbadah": true
      }
    ],
    "kuliner": [
      {
        "id": "k-uuid-002",
        "nama": "Korean BBQ Halal Depok (Terverifikasi BPJPH)",
        "kategori": "Restoran Korea Halal",
        "alamat": "Jl. Margonda Raya No. 123, Depok",
        "fotoUtama": "/assets/placeholders/kuliner-korea.jpg",
        "statusHalal": "Terverifikasi BPJPH",
        "rating": 4.8
      }
    ],
    "edukasi": [
      {
        "id": "e-uuid-003",
        "judul": "Panduan Survival Kuliner & Bahan Tersembunyi Halal di Korea",
        "kategori": "Sains & Travel",
        "waktuBaca": "7 min read",
        "fotoUtama": "/assets/placeholders/edukasi-halal.jpg"
      }
    ]
  }
}
```

### 4.2. Logika Frontend & State Management (`Home.jsx`)

```javascript
// State utama pencarian di Home.jsx
const [searchQuery, setSearchQuery] = useState('');
const [selectedCategory, setSelectedCategory] = useState('all');
const [searchResults, setSearchResults] = useState(null);
const [isLoading, setIsLoading] = useState(false);

// Debouncing pencarian 300ms untuk efisiensi API Call
useEffect(() => {
  const handler = setTimeout(() => {
    if (searchQuery.trim().length > 0 || selectedCategory !== 'all') {
      fetchSearchResults(searchQuery, selectedCategory);
    } else {
      setSearchResults(null); // Kembali ke tampilan default beranda
    }
  }, 300);

  return () => clearTimeout(handler);
}, [searchQuery, selectedCategory]);
```

---

## 5. Strategi Media Gambar (Rich Image Density & Placeholder System)

Untuk menghadirkan tampilan visual yang memikat seperti rujukan *LetsGoHalal*, Halaman Utama mewajibkan penggunaan aset gambar beresolusi tinggi pada seluruh elemen kartu konten, khususnya pada seksi **Wisata Halal** dan **Kuliner Halal**.

### 5.1. Struktur Data Gambar pada Skema Database (Prisma)

Seluruh entitas konten (`WisataHalal`, `Restoran`, `Edukasi`, `Resep`) dilengkapi dengan atribut gambar:
* `fotoUtama`: URL gambar sampul utama (`VarChar(255)`).
* `galeriFoto`: Array string URL foto pendukung / galeri (`JSON` / `Text`).

### 5.2. Strategi Placeholder & Transisi ke CMS Admin Gambar

1. **Fase Perancangan Awal (Placeholder System)**:
   * Menggunakan URL aset lokal atau CDN image placeholder dengan keyword spesifik yang relevan (misal: `halal-food`, `muslim-travel`, `korean-bbq`, `mosque-tourism`).
   * Menyiapkan komponen `ImageWithFallback.jsx` untuk menangani kondisi gambar rusak (*broken image link*) dengan menampilkan gambar *fallback default* bertema Halal Channel.
2. **Fase Integrasi CMS Galeri Admin (Sprint Selanjutnya)**:
   * Admin akan mengunggah gambar nyata melalui modul CRUD Dashboard Admin (dilengkapi *Multer file upload middleware* di backend).
   * Gambar yang diunggah Admin secara otomatis menggantikan URL *placeholder* pada Halaman Utama.

---

## 6. Validasi dan Kriteria Kelayakan (Definition of Done - DoD)

Modul Halaman Utama (`Home.jsx`) dinyatakan tuntas apabila memenuhi kriteria berikut:
* [x] Tata letak antarmuka mengadopsi struktur rujukan *LetsGoHalal* dengan skema warna hijau/emerald *Halal Channel* dan komponen daisyUI.
* [x] Fitur Pencarian (*Search Bar*) berfungsi secara *real-time* (mendukung pencarian kata kunci & penyaringan kategori).
* [x] Seksi Wisata Halal dan Kuliner Korea Halal tampil kaya gambar (*rich image density*) menggunakan sistem gambar placeholder yang siap terhubung dengan database.
* [x] Komponen responsif di berbagai resolusi layar (Mobile, Tablet, Desktop) tanpa mengalami kebocoran layout (*overflow*).
* [x] Integrasi API backend mengembalikan status HTTP 200 OK dan menangani kondisi pencarian kosong (zero results state) secara informatif.
