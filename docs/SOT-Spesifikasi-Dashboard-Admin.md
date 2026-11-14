# Single Source of Truth (SOT) — Spesifikasi Antarmuka dan Arsitektur Dashboard Admin

## 1. Orientasi dan Spesifikasi Fondasi Dashboard Admin

Dashboard Admin merupakan pusat kendali utama (*command center*) bagi pengelola platform *halalchannel.id* dan ekosistem digital RPNN Depok. Modul ini bertindak sebagai tempat pengelolaan konten (*Content Management System / CMS*), pemantauan statistik agregasi, peninjauan status verifikasi halal, serta manajemen jejak audit aktivitas administrator. Penyusunan Single Source of Truth (SOT) ini bertujuan untuk memberikan panduan teknis yang presisi, terstruktur, dan baku bagi tim pengembang *frontend* maupun *backend* dalam mengeksekusi pembangunan Dashboard Admin pada Sprint 1 dan Sprint 2.

Sejalan dengan arsitektur dua sayap (*dual-engine model*) yang dipaparkan dalam blueprint strategis *halalchannel.id*, Dashboard Admin dirancang untuk menyokong pilar B2C (*Audience & Traffic Engine*) serta pilar B2B (*Revenue & Verified Directory Engine*). Sistem ini mengintegrasikan lima modul utama: Modul Autentikasi & Pengaturan Akses, Modul Pengelolaan Konten & Media (CMS Engine), Modul Direktori Interaktif & Geolokasi, Modul Manajemen Akun Admin, serta Modul Dashboard Analytics & Audit Log.

### 1.1 Alur Pengalihan Otomatis Pasca-Login (Role-Based Redirect Workflow)

Sesuai dengan spesifikasi autentikasi pada Modul Login, setelah pengguna berhasil melakukan otentikasi melalui endpoint `POST /api/auth/login`, sistem di sisi *frontend* menjalankan alur verifikasi sesi dan pengalihan halaman secara otomatis.

1. **Penerimaan Respon & Token**: Komponen `LoginForm.jsx` menerima respon HTTP `200 OK` yang membawa token JSON Web Token (JWT) serta objek profil pengguna (`id`, `namaLengkap`, `email`, `role`).
2. **Penyimpanan Sesi di AuthContext**: Fungsi `login(userData, token)` pada `AuthContext.jsx` menyimpan token JWT ke `localStorage` dan mengatur header default Axios `Authorization: Bearer <token>`.
3. **Pemeriksaan Hak Akses Peran (Role Check)**: `AuthContext` mengevaluasi nilai `user.role.namaRole`.
   - Jika `namaRole === 'Admin'`, sistem secara otomatis mengeksekusi pengalihan rute (*redirect*) menggunakan `navigate('/admin/dashboard')`.
   - Jika `namaRole === 'User'`, sistem mengarahkan pengguna ke halaman utama `/` atau halaman profil `/profile`.
4. **Proteksi Rute Terkunci (Protected Admin Route)**: Komponen `ProtectedAdminRoute.jsx` membungkus rute `/admin/*`. Apabila terdapat upaya akses langsung ke rute admin oleh pengguna yang belum terautentikasi atau tidak memiliki peran `Admin`, sistem secara paksa mengembalikan rute ke `/login` dengan pesan kesalahan HTTP `403 Forbidden`.

## 2. Arsitektur Layout & Komponen UI/UX Dashboard Admin

Antarmuka Dashboard Admin dibangun menggunakan arsitektur tata letak induk (*Master Layout*) berbasis React + Vite dan Tailwind CSS melalui komponen `AdminLayout.jsx`. Layout ini menyediakan struktur navigasi yang konsisten, responsif, dan mudah dioperasikan.

### 2.1 Struktur Navigasi dan Hierarki Layout (`AdminLayout.jsx`)

Tata letak antarmuka Admin terbagi menjadi tiga area visual utama:

* **Sidebar Navigasi Kiri (Left Sidebar)**: Menyajikan bilah navigasi vertikal yang memuat logo platform RPNN Depok / Halal Channel, indikator versi sistem, serta menu navigasi modul:
  * **Dashboard**: Ringkasan statistik & aktivitas terbaru (`/admin/dashboard`).
  * **Kelola Artikel Edukasi**: Manajemen artikel sains pangan & syariat (`/admin/edukasi`).
  * **Kelola Resep Halal**: Manajemen resep makanan & panduan masak (`/admin/resep`).
  * **Kelola Direktori Kuliner**: Katalog tempat makan & restoran Korea halal (`/admin/kuliner`).
  * **Kelola Wisata Halal**: Katalog destinasi wisata & fasilitas ibadah (`/admin/wisata`).
  * **Kelola Media Podcast/Video**: Manajemen media audio podcast & video shorts (`/admin/media`).
  * **Kelola Akun Admin**: Fitur pendaftaran & manajemen admin (`/admin/users`).
  * **Log Aktivitas**: Catatan jejak audit sistem (`/admin/logs`).
* **Header Bar Atas (Top Header Bar)**: Menampilkan tombol *toggle* collapsible sidebar, pencarian global cepat, tombol navigasi langsung ke halaman publik (*Live Website View*), serta profil ringkas Admin yang sedang aktif (nama, foto profil, dan tombol *Logout*).
* **Area Konten Utama (Main Content Viewport)**: Area dinamis yang me-render komponen halaman aktif berdasarkan sub-rute React Router.

### 2.2 Ringkasan Statistik dan Panel Verifikasi (Analytics Dashboard)

Halaman utama `/admin/dashboard` dilengkapi dengan empat blok *widget* statistik agregat yang memberikan gambaran umum mengenai performa dan status konten platform.

Tabel berikut merincikan spesifikasi widget indikator performa utama pada Dashboard Admin:

| Nama Widget / Metric Card | Indikator Data | Tipe Visual / Komponen | Perilaku Interaktif & Fungsi |
| :--- | :--- | :--- | :--- |
| **Total Konten Edukasi & Resep** | Jumlah artikel sains pangan, syariat, dan resep halal. | Metric Card dengan ikon buku/resep & badge persentase pertumbuhan. | Klik mengarahkan langsung ke halaman `/admin/edukasi` atau `/admin/resep`. |
| **Total Direktori Kuliner & Wisata** | Jumlah tempat makan (termasuk resto Korea halal) & destinasi wisata. | Metric Card dengan ikon lokasi/restoran & total lokasi terverifikasi BPJPH. | Klik mengarahkan ke halaman `/admin/kuliner` atau `/admin/wisata`. |
| **Total Media Audio/Video** | Jumlah episode podcast audio & video shorts yang terbit. | Metric Card dengan ikon media/mic & durasi total tayangan. | Klik mengarahkan ke halaman `/admin/media`. |
| **Status Verifikasi Konten** | Agregasi status konten: Draft, In Review, Verified/Published. | Pie Chart / Progress Bar & Indicator Badge. | Filter cepat untuk menampilkan konten yang membutuhkan persetujuan Admin. |

## 3. Spesifikasi Modul CMS & Pengelolaan Konten Utama (CRUD)

Modul CMS pada Dashboard Admin menangani alur pembuatan, pembacaan, pembaruan, dan penghapusan data (*Create, Read, Update, Delete*) untuk seluruh jenis konten di platform.

### 3.1 Manajemen Artikel Edukasi Halal & Sains Pangan

Modul ini memfasilitasi publikasi artikel edukasi yang berfokus pada sains pangan, titik kritis bahan baku, kepatuhan syariat, serta gaya hidup *thayyib*.

* **Elemen Formulir Input**:
  * Judul Artikel (Text Input, Max 150 Karakter).
  * Slug URL (Auto-generated dari judul, Unique).
  * Kategori Edukasi (Dropdown Select: Sains Pangan, Hukum Syariat, Uji Lab & Mitos, Survival Guide).
  * Penulis / Expert Reviewer (Text Input / Select Admin).
  * Ringkasan / Excerpt (Textarea, Max 250 Karakter).
  * Isi Konten Utama (Rich Text Editor / Markdown Editor).
  * Gambar Sampul / Cover Image (File Upload Image, Max 2MB).
  * Tags & Keywords SEO (Tag Input).
  * Status Publikasi (Radio/Select: `DRAFT`, `IN_REVIEW`, `PUBLISHED`).

### 3.2 Manajemen Resep Makanan Halal

Modul ini mengelola katalog resep makanan halal yang dilengkapi dengan takaran bahan, analisis kandungan nutrisi, serta langkah-langkah pembuatan.

* **Elemen Formulir Input**:
  * Nama Resep (Text Input, Max 100 Karakter).
  * Kategori Resep (Dropdown Select: Pangan Lokal / Koro Pedang, Olahan Sehat, Bebas Bahan Sintetis).
  * Waktu Memasak & Porsi (Number Input: Menit & Jumlah Porsi).
  * Tingkat Kesulitan (Select: Mudah, Sedang, Sulit).
  * Gambar Hasil Resep (File Upload Image).
  * Rincian Bahan Masak (Dynamic Repeater Input: Nama Bahan, Takaran, Satuan, Status Halal Bahan).
  * Langkah-Langkah Pembuatan (Dynamic Repeater Input: Nomor Urut, Instruksi Masak, Foto Opsional).
  * Status Publikasi (`DRAFT`, `PUBLISHED`).

### 3.3 Manajemen Katalog Tempat Makan & Kuliner Halal

Modul ini mengelola direktori interaktif tempat makan halal, mencakup usaha kuliner lokal Depok hingga jaringan restoran internasional seperti Restoran Korea Halal di Indonesia.

* **Elemen Formulir Input**:
  * Nama Tempat Makan / Restoran (Text Input).
  * Kategori Kuliner (Dropdown Select: Restoran Korea Halal, F&B Lokal Depok, Cafe Ramah Muslim, Fast Food Halal).
  * Status Sertifikasi BPJPH (Select: `TERSERTIFIKASI_RESMI`, `PROSES_SERTIFIKASI`, `SELF_DECLARE_HALAL`).
  * Nomor Sertifikat Halal & Masa Berlaku (Text Input & Date Picker).
  * Alamat Lengkap & Wilayah/Kecamatan (Text Input & Select Kecamatan Depok/Nasional).
  * Koordinat Geolokasi (Number Input: `latitude` & `longitude` untuk integrasi Leaflet/Maps).
  * Kisaran Harga (Select: $, $$, $$$).
  * Jam Operasional & Kontak (Text Input / Time Input).
  * Menu Unggulan & Foto Galeri (File Upload Multiple Images).
  * Status Verifikasi Admin (`DRAFT`, `IN_REVIEW`, `VERIFIED`).

### 3.4 Manajemen Destinasi Wisata Halal & Fasilitas Ibadah

Modul ini mengelola direktori objek wisata ramah Muslim beserta ketersediaan fasilitas pendukung ibadah.

* **Elemen Formulir Input**:
  * Nama Destinasi Wisata (Text Input).
  * Kategori Wisata (Dropdown Select: Wisata Alam, Wisata Sejarah & Warisan Islam, Wisata Keluarga).
  * Alamat & Lokasi Geolokasi (`latitude`, `longitude`).
  * Fasilitas Ibadah & Ramah Muslim (Checkbox Multiple: Musholla/Masjid Bersih, Tempat Wudhu Terpisah, Makanan Halal Tersedia, Toilet Ramah Muslim).
  * Jam Buka & Harga Tiket Masuk (Text Input & Currency Input).
  * Foto Destinasi & Deskripsi Ulasan (File Upload & Rich Text).
  * Status Verifikasi (`DRAFT`, `VERIFIED`).

### 3.5 Manajemen Media Video Shorts & Audio Podcast (Escape Model)

Sesuai dengan blueprint strategis *halalchannel.id*, modul media ini mendukung format konten *Escape Model* (podcast dialog kasual dua arah antara host awam dan pakar sains/syariat serta video edukasi durasi pendek).

* **Elemen Formulir Input**:
  * Judul Program Media (Text Input).
  * Tipe Media (Select: `AUDIO_PODCAST`, `VIDEO_SHORTS`).
  * Sumber Media / Embed Link (URL Input: Spotify Embed, YouTube Embed, atau File Upload Audio MP3/MP4).
  * Nama Host & Narasumber Pakar (Text Input).
  * Deskripsi Episode & Transkrip Ringkas (Textarea / Rich Text).
  * Gambar Thumbnail Episode (File Upload Image).
  * Status Publikasi (`DRAFT`, `PUBLISHED`).

## 4. Modul Manajemen Akun Admin & Log Aktivitas Sistem

### 4.1 Fitur Tambah & Manajemen Akun Admin (`/admin/users`)

Sesuai kesepakatan tata kelola keamanan sistem, pendaftaran akun Admin baru **tidak disediakan pada halaman publik**, melainkan dikelola secara internal di dalam Dashboard Admin oleh Admin yang sudah terautentikasi.

* **Alur Pendaftaran Admin Baru (Create Admin Workflow)**:
  1. Admin membuka halaman `/admin/users` dan menekan tombol **"Tambah Admin Baru"**.
  2. Modal formulir pendaftaran terbuka dengan bidang isian: Nama Lengkap, Email, Password, Konfirmasi Password, serta Pemilihan Role (`Admin`).
  3. Klien melakukan validasi format email dan kecocokan password (minimal 6 karakter).
  4. Klien mengirimkan permintaan `POST /api/admin/users` dengan membawa token JWT Admin di header.
  5. Backend memverifikasi token JWT, mengecek apakah email sudah terdaftar di database, me-hash password menggunakan `bcrypt.hash()`, dan menyimpan user baru dengan `roleId` Admin.
  6. Tabel daftar Admin memuat ulang (*refresh*) secara otomatis.

### 4.2 Sistem Audit Log & Log Aktivitas Admin (`/admin/logs`)

Untuk menjamin akuntabilitas dan transparansi sistem, setiap tindakan perubahan data yang dilakukan oleh Admin dicatat secara otomatis ke dalam tabel audit log.

Tabel berikut merincikan struktur data dan komponen antarmuka untuk pencatatan Log Aktivitas Admin:

| Kolom Log Aktivitas | Tipe Data / Format | Deskripsi & Contoh Data |
| :--- | :--- | :--- |
| **ID Log** | UUID `CHAR(36)` | Pengenal unik log audit (`e4a1b2c3-8d9e-4f5a-6b7c-8d9e0f1a2b3c`). |
| **Administrator** | Object User (`namaLengkap`, `email`) | Nama dan email Admin yang melakukan tindakan (misal: "Admin Halal Channel"). |
| **Jenis Aksi (Action)** | Enum String | Jenis tindakan: `CREATE`, `UPDATE`, `DELETE`, `VERIFY`, `LOGIN`. |
| **Modul Target** | String | Nama modul target: `ARTIKEL_EDUKASI`, `RESEP_HALAL`, `KULINER`, `WISATA`, `MEDIA`, `USER`. |
| **Deskripsi Detail** | Text | Deskripsi ringkas aksi (misal: "Menyetujui verifikasi restoran Korea Halal 'K-Bbq Depok'"). |
| **Waktu Kejadian** | DateTime (ISO 8601) | Timestamp presisi waktu eksekusi (misal: `2026-11-06T09:30:00Z`). |

## 5. Spesifikasi Arsitektur Teknikal & Kontrak REST API

### 5.1 Skema Data Prisma ORM & Pemetaan Model Data (UUID CHAR(36))

Sistem Dashboard Admin memanfaatkan skema Prisma ORM dengan basis data MySQL yang menggunakan pengenal unik UUID `CHAR(36)` pada tabel-tabel utama:

```prisma
model User {
  id          String   @id @default(uuid()) @db.Char(36)
  roleId      String   @map("role_id") @db.Char(36)
  namaLengkap String   @map("nama_lengkap") @db.VarChar(100)
  email       String   @unique @db.VarChar(100)
  password    String   @db.VarChar(255)
  fotoProfil  String?  @map("foto_profil") @db.VarChar(255)
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  role Role @relation(fields: [roleId], references: [id])
  logs LogAktivitasAdmin[]

  @@map("users")
}

model LogAktivitasAdmin {
  id          String   @id @default(uuid()) @db.Char(36)
  userId      String   @map("user_id") @db.Char(36)
  aksi        String   @db.VarChar(50)
  modulTarget String   @map("modul_target") @db.VarChar(50)
  deskripsi   String   @db.Text
  createdAt   DateTime @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id])

  @@map("log_aktivitas_admin")
}
```

### 5.2 Rincian Endpoint REST API Dashboard Admin

Seluruh endpoint pada Dashboard Admin membutuhkan header `Authorization: Bearer <token>` dan dilindungi oleh middleware `verifyToken` serta `checkRole(['Admin'])`.

#### A. Endpoint Summary Dashboard & Log Aktivitas
* **`GET /api/admin/dashboard/stats`**: Mengembalikan ringkasan statistik total data dan status verifikasi.
* **`GET /api/admin/logs`**: Mengembalikan daftar riwayat log aktivitas admin dengan penomoran halaman (*pagination*).

#### B. Endpoint Manajemen Akun Admin
* **`GET /api/admin/users`**: Mengambil daftar akun Admin yang terdaftar.
* **`POST /api/admin/users`**: Menambahkan akun Admin baru dari dalam Dashboard Admin.

Format Request Body `POST /api/admin/users`:
```json
{
  "namaLengkap": "Admin Riset Halal",
  "email": "admin.riset@rpnn.depok.go.id",
  "password": "PasswordAdmin123!"
}
```

Format Response Success `201 Created`:
```json
{
  "success": true,
  "message": "Akun Admin baru berhasil dibuat.",
  "data": {
    "id": "f5b2c3d4-e6f7-4a5b-8c9d-0e1f2a3b4c5d",
    "namaLengkap": "Admin Riset Halal",
    "email": "admin.riset@rpnn.depok.go.id",
    "role": "Admin",
    "createdAt": "2026-11-06T10:15:00Z"
  }
}
```

#### C. Endpoint CRUD Konten CMS (Artikel, Resep, Kuliner, Wisata, Media)
* **`GET /api/admin/kuliner`**: Menampilkan katalog tempat makan halal (dengan query search & filter kategori/status).
* **`POST /api/admin/kuliner`**: Membuat data tempat makan baru (termasuk resto Korea halal).
* **`PUT /api/admin/kuliner/:id`**: Memperbarui data tempat makan berdasarkan ID UUID.
* **`DELETE /api/admin/kuliner/:id`**: Menghapus data tempat makan.
* **`PATCH /api/admin/kuliner/:id/status`**: Memperbarui status verifikasi (`DRAFT`, `IN_REVIEW`, `VERIFIED`).

Format Response `GET /api/admin/dashboard/stats` (200 OK):
```json
{
  "success": true,
  "message": "Berhasil mengambil statistik dashboard",
  "data": {
    "totalArtikel": 24,
    "totalResep": 18,
    "totalKuliner": 35,
    "totalWisata": 12,
    "totalMedia": 15,
    "statusVerifikasi": {
      "draft": 8,
      "inReview": 5,
      "verified": 91
    }
  }
}
```

### 5.3 Proteksi Akses & Middleware Backend

Setiap request ke grup rute `/api/admin/*` wajib melewati dua lapisan proteksi middleware pada Express.js:

```javascript
// backend/src/middlewares/authMiddleware.js
const verifyToken = (req, res, next) => { ... };
const checkRole = (allowedRoles) => { ... };

// Contoh Registrasi Rute Admin di Router
router.use(verifyToken);
router.use(checkRole(['Admin']));

router.get('/dashboard/stats', getDashboardStats);
router.post('/users', createNewAdmin);
```

## 6. Validasi Form, Keamanan, dan Kriteria Kelayakan (DoD)

### 6.1 Matriks Validasi Input Formulir Admin

Tabel berikut menetapkan aturan validasi yang diterapkan pada komponen formulir di Dashboard Admin:

| Input Field | Aturan Validasi Client-Side | Aturan Validasi Server-Side | Pesan Kesalahan Visual |
| :--- | :--- | :--- | :--- |
| **Nama Admin Baru** | Teks wajib diisi, Min. 3 Karakter. | Sanitasi string `trim()`. | "Nama lengkap wajib diisi minimal 3 karakter." |
| **Email Admin Baru** | Format regex email valid. | Unique check di tabel `users`. | "Email sudah terdaftar atau format tidak valid." |
| **Password Admin Baru**| Min. 6 Karakter. | Hash `bcrypt` salt round 10. | "Password minimal 6 karakter." |
| **Judul Konten / Resto**| Teks wajib diisi, Max 150 Karakter.| Sanitasi string & auto-slug. | "Judul / Nama tempat wajib diisi." |
| **Geolokasi (Lat/Long)**| Angka desimal valid (-90 s.d 90 & -180 s.d 180). | Type validation float. | "Koordinat geolokasi tidak valid." |

### 6.2 Kebijakan Keamanan Admin Panel (Security Measures)

* **Enkripsi & Tokenization**: Penggunaan token JWT dengan masa berlaku terbatas (`1d`) dan enkripsi password mengandalkan `bcryptjs`.
* **RBAC Enforcement**: Seluruh API endpoint pengolahan data dikunci rapat dengan middleware `checkRole(['Admin'])`.
* **Sanitasi Upload File**: Pengunggahan berkas foto/media dibatasi pada format `.jpg`, `.png`, `.webp`, `.mp3`, `.mp4` dengan ukuran maksimum 5MB.
* **Pencatatan Audit Trail**: Setiap perubahan data penting wajib mencetuskan entri baru di tabel `log_aktivitas_admin`.

### 6.3 Kriteria Kelayakan Selesai (Definition of Done - Sprint 1 & 2)

Dashboard Admin dinyatakan tuntas dan siap dilaporkan apabila memenuhi tolok ukur berikut:

* [x] Pengguna dengan peran `Admin` berhasil diarahkan secara otomatis ke `/admin/dashboard` pasca-login.
* [x] Tata letak `AdminLayout.jsx` menampilkan Sidebar Navigasi, Header Bar, dan Profil Admin secara simetris dan responsif.
* [x] Widget statistik menampilkan agregasi jumlah data artikel, resep, kuliner (termasuk resto Korea halal), wisata, media, dan status verifikasi secara akurat dari database.
* [x] Modul CRUD untuk Artikel, Resep, Tempat Makan Halal, Wisata Halal, dan Media Podcast/Video berfungsi secara penuh end-to-end.
* [x] Fitur **Tambah Admin Baru** berfungsi dengan baik dari dalam Dashboard Admin (`/admin/users`) dan menyimpan password secara terenkripsi.
* [x] Setiap tindakan pembuatan, pengubahan, penghapusan, dan verifikasi data terekam secara otomatis pada tabel **Log Aktivitas Admin** (`/admin/logs`).
