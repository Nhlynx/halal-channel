# Single Source of Truth (SOT) — Spesifikasi Antarmuka dan Arsitektur Modul Login

## 1. Orientasi dan Spesifikasi Fondasi Modul Login

Modul Autentikasi Login merupakan pilar utama dalam ekosistem digital RPNN Depok dan platform *halalchannel.id*. Modul ini bertindak sebagai pintu gerbang (*gatekeeper*) yang mengatur identifikasi pengguna, penerbitan sesi terenkripsi, serta pembatasan hak akses berbasis peran (*Role-Based Access Control / RBAC*). Penyusunan Single Source of Truth (SOT) ini bertujuan untuk memberikan panduan teknis yang presisi dan baku bagi pengembang *frontend* maupun *backend* dalam mengeksekusi modul login pada Sprint 1.

Rancangan antarmuka modul login ini mengadopsi dan menyelaraskan pola *user experience* (UX) dari platform rujukan global industri halal *LetsGoHalal*. Rujukan ini dipadukan dengan arsitektur teknis berbasis React + Vite pada sisi *frontend*, Express.js pada sisi *backend*, serta Prisma ORM dengan basis data MySQL yang memanfaatkan pengenal unik UUID `CHAR(36)`. Pendekatan ini memastikan pengalaman masuk (*login*) yang responsif, terstruktur, intuitif bagi pengguna awam, serta aman secara standar industri.

## 2. Spesifikasi Antarmuka dan Komponen UI/UX

Antarmuka login dirancang fleksibel untuk mendukung dua mode penayangan: sebagai panel *modal overlay* di atas halaman utama (sesuai gaya platform rujukan *LetsGoHalal*) dan sebagai halaman khusus (*dedicated route*) pada alamat `/login`. Komponen antarmuka dibagi menjadi empat blok visual utama yang terorganisir secara sistematis.

### 2.1. Hierarki Visual dan Tata Letak Komponen

Tata letak antarmuka disusun secara vertikal dari atas ke bawah untuk memudahkan navigasi mata pengguna (*visual scanning*), sebagaimana dirincikan pada struktur berikut:

* **Blok 1: Header Modal / Halaman**: Menampilkan logo platform, judul sambutan "Welcome back!", serta deskripsi singkat manfaat masuk ke sistem.
* **Blok 2: Opsi Autentikasi Sosial (OAuth)**: Tombol akses cepat "Continue with Google" dan "Continue with Facebook", diikuti oleh garis pemisah (*divider*) berlabel "atau masuk dengan email".
* **Blok 3: Formulir Kredensial Utama**: Isian email, password dengan ikon penyembunyi/penampil password, opsi "Keep me logged in", serta tautan "Forgot your password?".
* **Blok 4: Tombol Utama & Footer Legal**: Tombol aksi "Log in", tautan pendaftaran bagi pengguna baru ("Don't have an account? Sign Up"), dan teks persetujuan syarat ketentuan serta kebijakan privasi.

### 2.2. Rincian Elemen Formulir dan Komponen Antarmuka

Tabel berikut menetapkan spesifikasi komponen antarmuka, jenis input, teks label, serta perilaku visual yang wajib diterapkan oleh tim *frontend*:

| Elemen Antarmuka | Tipe Komponen / Input | Label / Teks Antarmuka | Perilaku & Interaksi Visual |
| :--- | :--- | :--- | :--- |
| **Welcome Header** | Typography Heading | "Welcome back!" / "Log in to enjoy RPNN Depok" | Teks cetak tebal berukuran 24px, terletak di bagian paling atas. |
| **Social Login Google** | Button Component | "Continue with Google" | Latar putih, border abu-abu, menampilkan ikon warna resmi Google. |
| **Social Login Facebook** | Button Component | "Continue with Facebook" | Latar biru merek Facebook (`#1877F2`), teks putih. |
| **Input Email** | Text Input (`type="email"`) | "Email Address" | Focus ring warna primer, placeholder: "nama@domain.com". |
| **Input Password** | Password Input (`type="password"`) | "Password" | Dilengkapi ikon mata (*eye icon*) untuk toggle show/hide password. |
| **Remember Me** | Checkbox Input | "Keep me logged in" | Menyimpan sesi bertahan lebih lama saat diaktifkan. |
| **Forgot Password** | Navigation Link | "Forgot your password?" | Tautan warna primer, mengarahkan ke modal/halaman `/forgot-password`. |
| **Submit Button** | Primary Action Button | "Log in" | Latar warna primer penuh, menampilkan spinner saat kondisi *loading*. |
| **Sign Up Link** | Navigation Link | "Don't have an account? Sign Up" | Membuka dialog pendaftaran akun baru pada rute `/register`. |
| **Legal Consent** | Helper Text | "By continuing, you agree to Terms & Privacy Policy" | Teks sekunder ukuran 12px dengan tautan aktif ke halaman kebijakan. |

## 3. Arsitektur Teknikal dan Logika Sistem

Proses otentikasi mengeksekusi alur verifikasi data yang aman antara *frontend* React, *backend* Express.js, dan basis data MySQL melalui Prisma ORM.

### 3.1. Alur Kerja Autentikasi (Authentication Workflow)

Langkah-langkah pemrosesan otentikasi dari sisi pengguna hingga penerbitan sesi terenkripsi dijalankan melalui urutan berikut:

1. Pengguna menginput email dan password pada komponen `LoginForm.jsx` di aplikasi React.
2. *Frontend* melakukan validasi format di tingkat klien. Jika valid, *frontend* mengirimkan permintaan HTTP `POST` ke endpoint `/api/auth/login`.
3. *Backend* Express.js menerima permintaan, memvalidasi kelengkapan *body*, dan mencari data pengguna di tabel `users` melalui Prisma Client berdasarkan `email`.
4. Jika akun pengguna ditemukan, *backend* membandingkan password masukan dengan *hash* di database menggunakan `bcrypt.compare()`.
5. Jika password cocok, *backend* mengambil data `role` pengguna dari tabel `roles` untuk menentukan apakah akun berstatus `Admin` atau `User`.
6. *Backend* menerbitkan *JSON Web Token* (JWT) yang berisi *payload* `id`, `email`, dan `roleId`.
7. *Backend* mengembalikan respon `200 OK` berisi token JWT beserta objek profil pengguna.
8. *Frontend* menyimpan token di `localStorage` (atau state `AuthContext`) dan mengarahkan pengguna sesuai perannya (*role redirect*).

### 3.2. Struktur Pemetaan Model Data Prisma (UUID CHAR(36))

Pengidentifikasi utama (*Primary Key* dan *Foreign Key*) pada modul login terhubung langsung dengan model `User` dan `Role` berbasis `CHAR(36)` UUID v4:

```prisma
model Role {
  id        String   @id @default(uuid()) @db.Char(36)
  namaRole  String   @map("nama_role") @db.VarChar(50)
  deskripsi String?  @db.Text
  users     User[]

  @@map("roles")
}

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

  @@map("users")
}
```

## 4. Spesifikasi Kontrak API (API Contract)

### 4.1. Endpoint Utama
* **URL Endpoint**: `/api/auth/login`
* **Metode HTTP**: `POST`
* **Header**: `Content-Type: application/json`

### 4.2. Request Body
Format data JSON yang dikirimkan oleh klien:

```json
{
  "email": "admin@rpnn.depok.go.id",
  "password": "admin123",
  "rememberMe": true
}
```

### 4.3. Response Body — Berhasil (200 OK)
Format data JSON saat otentikasi berhasil:

```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "dec2eef8-8bc2-4d05-acff-24226feeecbe",
      "namaLengkap": "Admin Halal Channel",
      "email": "admin@rpnn.depok.go.id",
      "fotoProfil": null,
      "role": {
        "id": "dec2eef8-8bc2-4d05-acff-24226feeecbe",
        "namaRole": "Admin"
      }
    }
  }
}
```

### 4.4. Pemetaan Penanganan Error dan Kode Status HTTP

Proses otentikasi menyediakan pesan error yang informatif namun tetap menjaga keamanan sistem dari upaya penebakan akun.

| Kode Status | Pesan Error Response (`message`) | Skenario Pemicu |
| :--- | :--- | :--- |
| **400 Bad Request** | "Email dan password wajib diisi." | Payload request tidak lengkap atau string kosong. |
| **401 Unauthorized** | "Kredensial tidak valid. Cek email atau password Anda." | Email tidak ditemukan di database ATAU password `bcrypt` tidak cocok. |
| **500 Internal Error** | "Terjadi kesalahan pada server saat memproses login." | Kegagalan koneksi database atau kesalahan internal backend. |

## 5. State Management dan Proteksi Akses Frontend (React)

Pada sisi klien React + Vite, status login dikelola secara terpusat menggunakan **React Context API** (`AuthContext`).

### 5.1. Pengelolaan State Autentikasi (`AuthContext.jsx`)
* **State `user`**: Menyimpan objek pengguna aktif (`null` jika belum login).
* **State `token`**: Menyimpan string JWT yang diambil dari `localStorage` saat aplikasi dimuat.
* **Fungsi `login(userData, token)`**: Menyimpan token ke `localStorage`, memperbarui state `user`, dan mengatur *default header* `Authorization: Bearer <token>` pada Axios.
* **Fungsi `logout()`**: Menghapus token dari `localStorage`, mengosongkan state `user`, dan mengarahkan pengguna kembali ke halaman utama.

### 5.2. Aturan Pengalihan Halaman (*Role-Based Redirect*)
Setelah otentikasi sukses, aplikasi mengarahkan pengguna secara otomatis berdasarkan peran (`namaRole`):
* **Jika Role = `Admin`**: Diarahkan ke Dashboard Admin pada rute `/admin/dashboard`.
* **Jika Role = `User`**: Diarahkan ke halaman profil atau halaman utama `/`.

## 6. Validasi Form, Keamanan, dan Kriteria Kelayakan (DoD)

### 6.1. Matriks Validasi Input Formulir

Tabel berikut menguraikan aturan validasi yang diterapkan secara berlapis di sisi *frontend* dan *backend*:

| Input Field | Aturan Validasi Client-Side | Aturan Validasi Server-Side | Pesan Kesalahan Visual |
| :--- | :--- | :--- | :--- |
| **Email** | Format regex email valid; Tidak boleh kosong. | Sanitasi string `trim()`; Cek keberadaan di database. | "Masukkan format email yang valid." |
| **Password** | Min. 6 karakter; Tidak boleh kosong. | Sanitasi string; Verifikasi `bcrypt.compare()`. | "Password wajib diisi minimal 6 karakter." |

### 6.2. Kebijakan Keamanan (Security Measures)
* **Penyimpanan Password**: Password di-hash menggunakan `bcryptjs` dengan *salt round* minimum 10. Password teks biasa tidak boleh dicatat dalam log server.
* **Sanitasi Kredensial**: Pesan error otentikasi yang disajikan ke publik disamarkan (misalnya "Email atau password salah") untuk mencegah *enumeration attack*.
* **Proteksi Akses API**: Endpoint sensitif di backend dilindungi oleh *middleware* `verifyToken` dan `checkRole(['Admin'])`.

### 6.3. Kriteria Kelayakan Selesai (Definition of Done - Sprint 1)
Modul Login dinyatakan tuntas dan siap dilaporkan apabila memenuhi kriteria berikut:
* [x] Antarmuka Login selaras dengan rujukan visual *LetsGoHalal* (mencakup input email, password, remember me, lupa password, dan pendaftaran).
* [x] Endpoint `POST /api/auth/login` berfungsi dan mengembalikan token JWT serta data role yang valid.
* [x] Password akun diverifikasi dengan aman menggunakan `bcrypt.compare()`.
* [x] Pengguna dengan peran `Admin` berhasil diarahkan ke `/admin/dashboard`, sedangkan peran `User` ke halaman utama/profil.
* [x] Penanganan pesan error (400, 401, 500) tampil secara transparan pada antarmuka tanpa merusak layout.
