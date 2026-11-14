/**
 * publicController.js
 * Controller untuk endpoint publik (tanpa auth) — Halaman Utama frontend.
 * Mengambil data dari adminController in-memory mock, dengan fallback graceful.
 */

const prisma = require('../config/db');

// Referensi mock data dari adminController (shared module-level state)
// Karena mock data di adminController adalah module-level `let`, kita impor
// kembali dari sana. Namun karena tidak diekspor, kita definisikan ulang data
// publik statis yang selaras dengan field mock di adminController.

// ─── MOCK DATA PUBLIK (sinkron dengan adminController) ────────────────────────

const mockWisata = [
  {
    id: 'w-1',
    namaDestinasi: 'Taman Hutan Raya Depok & Kawasan Religi Situ Pengasinan',
    kategoriWisata: 'Wisata Alam',
    lokasi: 'Jl. Pengasinan Raya, Sawangan',
    kecamatan: 'Sawangan',
    fasilitas: ['Musholla Bersih', 'Tempat Wudhu Terpisah', 'Kuliner Halal', 'Toilet Ramah Muslim'],
    jamBuka: '07:00 - 17:30 WIB',
    hargaTiket: 'Rp 5.000 / orang',
    deskripsi:
      'Destinasi wisata hijau yang asri dengan kemudahan sarana ibadah di setiap titik utama kawasan.',
    statusVerifikasi: 'VERIFIED',
    foto: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'w-2',
    namaDestinasi: 'Masjid Dian Al-Mahri (Masjid Kubah Emas) Depok',
    kategoriWisata: 'Wisata Religi',
    lokasi: 'Jl. Meruyung Raya, Cinere',
    kecamatan: 'Cinere',
    fasilitas: ['Musholla Bersih', 'Tempat Wudhu Terpisah', 'Kuliner Halal', 'Parkir Luas'],
    jamBuka: '04:00 - 21:00 WIB',
    hargaTiket: 'Gratis',
    deskripsi:
      'Masjid megah berlapis kubah emas murni, landmark religi kebanggaan Kota Depok yang terbuka untuk umum.',
    statusVerifikasi: 'VERIFIED',
    foto: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'w-3',
    namaDestinasi: 'Kampung Budaya Betawi Setu Babakan',
    kategoriWisata: 'Wisata Budaya',
    lokasi: 'Jl. RM. Kahfi II, Jagakarsa',
    kecamatan: 'Beji',
    fasilitas: ['Musholla Bersih', 'Kuliner Halal', 'Area Parkir'],
    jamBuka: '09:00 - 17:00 WIB',
    hargaTiket: 'Rp 10.000 / orang',
    deskripsi:
      'Kawasan pelestarian budaya Betawi dengan pertunjukan seni, kuliner khas, dan nuansa kampung halaman yang autentik.',
    statusVerifikasi: 'VERIFIED',
    foto: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'w-4',
    namaDestinasi: 'Danau Situ Rawa Besar Depok',
    kategoriWisata: 'Wisata Alam',
    lokasi: 'Pancoran Mas, Depok',
    kecamatan: 'Pancoran Mas',
    fasilitas: ['Musholla Bersih', 'Kuliner Halal', 'Spot Foto'],
    jamBuka: '06:00 - 18:00 WIB',
    hargaTiket: 'Gratis',
    deskripsi:
      'Danau buatan alami dengan suasana sejuk dan spot foto instagramable, cocok untuk keluarga Muslim.',
    statusVerifikasi: 'VERIFIED',
    foto: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'w-5',
    namaDestinasi: 'Taman Wisata Matahari Puncak',
    kategoriWisata: 'Wisata Keluarga',
    lokasi: 'Jl. Raya Puncak KM 93, Bogor',
    kecamatan: 'Cimanggis',
    fasilitas: ['Musholla Bersih', 'Tempat Wudhu Terpisah', 'Kuliner Halal', 'Area Bermain'],
    jamBuka: '08:00 - 17:00 WIB',
    hargaTiket: 'Rp 60.000 / orang',
    deskripsi:
      'Taman hiburan keluarga dengan kolam renang, wahana, dan fasilitas ibadah lengkap. Cocok untuk liburan akhir pekan.',
    statusVerifikasi: 'VERIFIED',
    foto: 'https://images.unsplash.com/photo-1575783970733-1aaedde1db74?w=800&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'w-6',
    namaDestinasi: 'Pesona Alam Eco Resort Puncak',
    kategoriWisata: 'Wisata Keluarga',
    lokasi: 'Jl. Hanjawar, Pacet, Cianjur',
    kecamatan: 'Sukmajaya',
    fasilitas: ['Musholla Bersih', 'Kuliner Halal', 'Penginapan Ramah Muslim'],
    jamBuka: 'Buka 24 Jam',
    hargaTiket: 'Mulai Rp 350.000',
    deskripsi:
      'Resort eko-wisata di lereng pegunungan dengan konsep ramah Muslim, sajian kuliner halal, dan pemandangan alam yang memukau.',
    statusVerifikasi: 'VERIFIED',
    foto: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    createdAt: new Date().toISOString(),
  },
];

const mockKuliner = [
  {
    id: 'k-1',
    namaRestoran: 'Chuseok Korean Halal BBQ',
    kategoriKuliner: 'Restoran Korea Halal',
    statusSertifikasi: 'Terverifikasi BPJPH',
    nomorSertifikatHalal: 'ID32110001234560124',
    alamat: 'Jl. Margonda Raya No. 120',
    kecamatan: 'Beji',
    kisaranHarga: '$$',
    jamOperasional: '10:00 - 22:00 WIB',
    statusVerifikasi: 'VERIFIED',
    foto: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'k-2',
    namaRestoran: 'Kedai Koro Pedang Nusantara',
    kategoriKuliner: 'F&B Lokal Depok',
    statusSertifikasi: 'Self Declare',
    nomorSertifikatHalal: 'ID32110009876540224',
    alamat: 'Jl. Raya Sawangan No. 45',
    kecamatan: 'Pancoran Mas',
    kisaranHarga: '$',
    jamOperasional: '08:00 - 21:00 WIB',
    statusVerifikasi: 'VERIFIED',
    foto: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'k-3',
    namaRestoran: 'Seoul Tteokbokki & Ramyun Halal',
    kategoriKuliner: 'Restoran Korea Halal',
    statusSertifikasi: 'Proses',
    nomorSertifikatHalal: 'Dalam Proses Uji LPH',
    alamat: 'Jl. Juanda No. 88',
    kecamatan: 'Sukmajaya',
    kisaranHarga: '$$',
    jamOperasional: '11:00 - 21:30 WIB',
    statusVerifikasi: 'IN_REVIEW',
    foto: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'k-4',
    namaRestoran: 'Warung Sate Halal Pak Didi',
    kategoriKuliner: 'F&B Lokal Depok',
    statusSertifikasi: 'Terverifikasi BPJPH',
    nomorSertifikatHalal: 'ID32110004567890324',
    alamat: 'Jl. Ir. H. Juanda No. 45',
    kecamatan: 'Beji',
    kisaranHarga: '$',
    jamOperasional: '09:00 - 22:00 WIB',
    statusVerifikasi: 'VERIFIED',
    foto: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'k-5',
    namaRestoran: 'Nasi Padang Mande Riang Halal',
    kategoriKuliner: 'F&B Lokal Depok',
    statusSertifikasi: 'Terverifikasi BPJPH',
    nomorSertifikatHalal: 'ID32110007654320524',
    alamat: 'Jl. Siliwangi No. 88',
    kecamatan: 'Pancoran Mas',
    kisaranHarga: '$',
    jamOperasional: '07:00 - 22:00 WIB',
    statusVerifikasi: 'VERIFIED',
    foto: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'k-6',
    namaRestoran: 'Resto Seoul Kitchen Halal Certified',
    kategoriKuliner: 'Restoran Korea Halal',
    statusSertifikasi: 'Terverifikasi BPJPH',
    nomorSertifikatHalal: 'ID32110008888880624',
    alamat: 'Grand Depok City Mall Lt. 2',
    kecamatan: 'Cimanggis',
    kisaranHarga: '$$$',
    jamOperasional: '10:00 - 22:00 WIB',
    statusVerifikasi: 'VERIFIED',
    foto: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&q=80',
    createdAt: new Date().toISOString(),
  },
];

const mockArtikel = [
  {
    id: 'a-1',
    judul: 'Titik Kritis Bahan Baku Halal pada Makanan Olahan Modern',
    slug: 'titik-kritis-bahan-baku-halal-olahan-modern',
    kategori: 'Sains Pangan',
    penulis: 'Dr. Ir. Siti Halimah, M.Sc.',
    ringkasan:
      'Mengenal enzim, emulsifier E471, dan gelatin dalam pangan olahan impor — mana yang aman, mana yang harus diwaspadai.',
    statusPublikasi: 'PUBLISHED',
    waktuBaca: '7 menit',
    foto: 'https://images.unsplash.com/photo-1532094349884-543559c3661a?w=800&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'a-2',
    judul: 'Panduan Wisata Kuliner Korea Ramah Muslim di Jabodetabek',
    slug: 'panduan-wisata-kuliner-korea-ramah-muslim',
    kategori: 'Survival Guide',
    penulis: 'Admin Riset Halal',
    ringkasan:
      'Daftar lengkap restoran Korea yang bebas mirin, arak masak, dan berstatus halal resmi di area Jabodetabek.',
    statusPublikasi: 'PUBLISHED',
    waktuBaca: '5 menit',
    foto: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'a-3',
    judul: 'Uji Lab Tersembunyi: Bagaimana BPJPH Memverifikasi Kehalalan Produk Impor',
    slug: 'uji-lab-tersembunyi-cara-bpjph-verifikasi',
    kategori: 'Edukasi Halal',
    penulis: 'Tim Halal Channel',
    ringkasan:
      'Proses panjang di balik segel halal — mulai dari sampling produk, uji DNA babi, hingga audit rantai pasok.',
    statusPublikasi: 'PUBLISHED',
    waktuBaca: '6 menit',
    foto: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'a-4',
    judul: 'Wisata Halal Ramadhan: 10 Destinasi Favorit Muslim di Jawa Barat',
    slug: 'wisata-halal-ramadhan-10-destinasi-jawa-barat',
    kategori: 'Travel Halal',
    penulis: 'Redaksi RPNN',
    ringkasan:
      'Panduan lengkap destinasi wisata halal di Jawa Barat yang cocok untuk liburan Ramadhan bersama keluarga.',
    statusPublikasi: 'PUBLISHED',
    waktuBaca: '8 menit',
    foto: 'https://images.unsplash.com/photo-1537031503481-5a1f9b7f2bae?w=800&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'a-5',
    judul: 'Mengenal Koro Pedang: Superfood Lokal Depok Pengganti Kedelai Impor',
    slug: 'mengenal-koro-pedang-superfood-lokal-depok',
    kategori: 'Pangan Lokal',
    penulis: 'Dr. Ahmad Fauzan, M.Gizi',
    ringkasan:
      'Kacang koro pedang khas Depok mengandung protein tinggi dan berpotensi menggantikan kedelai impor dalam industri pangan halal.',
    statusPublikasi: 'PUBLISHED',
    waktuBaca: '5 menit',
    foto: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=800&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'a-6',
    judul: 'Gochujang Halal vs Non-Halal: Cara Membedakannya di Label Produk',
    slug: 'gochujang-halal-vs-non-halal-cara-membedakan',
    kategori: 'Sains Pangan',
    penulis: 'Chef Hana Ramadhani',
    ringkasan:
      'Panduan praktis membaca label produk bumbu Korea — kapan gochujang aman dikonsumsi dan kapan harus dihindari.',
    statusPublikasi: 'PUBLISHED',
    waktuBaca: '4 menit',
    foto: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=800&q=80',
    createdAt: new Date().toISOString(),
  },
];

const mockResep = [
  {
    id: 'r-1',
    judulResep: 'Bulgogi Daging Sapi Saus Apel Halal Tanpa Mirin',
    slug: 'bulgogi-daging-sapi-halal-tanpa-mirin',
    kategoriResep: 'Olahan Sehat',
    porsi: 4,
    waktuMasakMenit: 30,
    tingkatKesulitan: 'Sedang',
    deskripsi:
      'Resep bulgogi autentik Korea menggunakan perasan buah pir & apel sebagai pengganti arak beras. Halal, lezat, dan tersertifikasi.',
    bahanBahan:
      '500g Daging Sapi Has Luar\n1 Buah Pir Korea (parut)\n1 Buah Apel (parut)\n4 sdm Kecap Asin Halal\n2 sdm Minyak Wijen Halal\n3 siung Bawang Putih\n1 sdm Gula Merah\nBawang Bombay',
    instruksi:
      '1. Iris daging sapi tipis-tipis.\n2. Campurkan parutan pir, apel, kecap asin, minyak wijen, bawang putih, dan gula merah.\n3. Marinasi daging selama minimal 30 menit.\n4. Panaskan wajan anti lengket, masak daging hingga matang kecoklatan.',
    foto: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
    statusPublikasi: 'PUBLISHED',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'r-2',
    judulResep: 'Nugget Tempe Koro Pedang Sumber Protein Nabati',
    slug: 'nugget-tempe-koro-pedang',
    kategoriResep: 'Pangan Lokal / Koro Pedang',
    porsi: 6,
    waktuMasakMenit: 45,
    tingkatKesulitan: 'Mudah',
    deskripsi:
      'Inovasi olahan pangan lokal kacang koro pedang khas Depok yang bergizi tinggi dan cocok sebagai camilan sehat keluarga.',
    bahanBahan:
      '300g Tempe Koro Pedang\n2 siung Bawang Putih\n1 sdt Garam\n1/2 sdt Merica\nTepung Panir Halal\n2 Butir Telur',
    instruksi:
      '1. Kukus tempe hingga empuk.\n2. Haluskan bersama bumbu-bumbu.\n3. Bentuk adonan menjadi nugget.\n4. Celup ke telur, balur panir.\n5. Kukus 15 menit, lalu goreng hingga kuning keemasan.',
    foto: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
    statusPublikasi: 'PUBLISHED',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'r-3',
    judulResep: 'Tteokbokki Halal: Versi Autentik Tanpa Alkohol',
    slug: 'tteokbokki-halal-tanpa-alkohol',
    kategoriResep: 'Olahan Sehat',
    porsi: 3,
    waktuMasakMenit: 25,
    tingkatKesulitan: 'Mudah',
    deskripsi:
      'Tteokbokki (kue beras pedas Korea) halal dengan gochujang bersertifikat BPJPH, tanpa arak masak, sempurna untuk makan siang.',
    bahanBahan:
      '400g Tteok (Kue Beras Korea)\n3 sdm Gochujang Halal Bersertifikat\n2 sdm Kecap Asin Halal\n1 sdm Gula\n2 siung Bawang Putih\nDaun Bawang',
    instruksi:
      '1. Rendam tteok dalam air hangat 10 menit.\n2. Tumis bawang putih, masukkan gochujang.\n3. Tambahkan air 300ml, masak hingga mendidih.\n4. Masukkan tteok, aduk rata hingga saus mengental.',
    foto: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&q=80',
    statusPublikasi: 'PUBLISHED',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'r-4',
    judulResep: 'Bibimbap Halal — Rasa Autentik, 100% Thayyib',
    slug: 'bibimbap-halal',
    kategoriResep: 'Olahan Sehat',
    porsi: 2,
    waktuMasakMenit: 35,
    tingkatKesulitan: 'Sedang',
    deskripsi:
      'Bibimbap (nasi campur Korea) dengan sayuran segar, daging sapi halal, dan telur setengah matang. Sehat, bergizi, dan 100% halal.',
    bahanBahan:
      '2 porsi Nasi Putih\n200g Daging Sapi (iris)\n2 Butir Telur\nBayam, Wortel, Tauge (secukupnya)\n2 sdm Gochujang Halal\n1 sdm Minyak Wijen Halal',
    instruksi:
      '1. Tumis masing-masing sayuran secara terpisah dengan sedikit minyak dan garam.\n2. Masak daging sapi dengan bumbu halal.\n3. Susun nasi di mangkuk, tata sayuran dan daging di atasnya.\n4. Tambahkan telur ceplok setengah matang.\n5. Sajikan dengan gochujang halal di sisi.',
    foto: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&q=80',
    statusPublikasi: 'PUBLISHED',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'r-5',
    judulResep: 'Rendang Daging Sapi Premium — Resep Minangkabau Asli',
    slug: 'rendang-daging-sapi-premium',
    kategoriResep: 'Pangan Lokal / Koro Pedang',
    porsi: 6,
    waktuMasakMenit: 120,
    tingkatKesulitan: 'Sulit',
    deskripsi:
      'Rendang otentik Minangkabau dengan santan kelapa segar, cabai merah keriting, dan rempah pilihan. Resep turun-temurun, 100% halal.',
    bahanBahan:
      '1 kg Daging Sapi (potong dadu)\n1 liter Santan Kelapa Segar\n8 buah Cabai Merah Keriting\n4 siung Bawang Putih\n8 siung Bawang Merah\n2 batang Serai\nLengkuas, Jahe, Kunyit',
    instruksi:
      '1. Haluskan semua bumbu kecuali serai dan lengkuas.\n2. Tumis bumbu halus, masukkan serai dan lengkuas.\n3. Masukkan daging, aduk rata dengan bumbu.\n4. Tuang santan, masak api sedang sambil sesekali diaduk.\n5. Masak hingga santan surut dan daging berwarna kecoklatan (±2 jam).',
    foto: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80',
    statusPublikasi: 'PUBLISHED',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'r-6',
    judulResep: 'Japchae Halal: Mie Glass Noodle Korea Tanpa Mirin',
    slug: 'japchae-halal-tanpa-mirin',
    kategoriResep: 'Olahan Sehat',
    porsi: 3,
    waktuMasakMenit: 25,
    tingkatKesulitan: 'Mudah',
    deskripsi:
      'Japchae (mie kaca Korea) dengan sayuran warna-warni dan daging sapi tipis, menggunakan kecap halal tanpa mirin.',
    bahanBahan:
      '200g Dangmyeon (Mie Kaca Korea)\n150g Daging Sapi (iris tipis)\nSpinach, Wortel, Jamur Shiitake, Paprika\n3 sdm Kecap Asin Halal\n1 sdm Minyak Wijen Halal\n1 sdm Gula',
    instruksi:
      '1. Rendam dan rebus mie kaca hingga al dente.\n2. Tumis setiap sayuran secara terpisah.\n3. Masak daging dengan kecap asin halal.\n4. Campur semua bahan, tambahkan minyak wijen dan gula.\n5. Aduk rata di api kecil hingga bumbu meresap.',
    foto: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80',
    statusPublikasi: 'PUBLISHED',
    createdAt: new Date().toISOString(),
  },
];

const mockMedia = [
  {
    id: 'm-1',
    judul: 'Podcast Halal Insight Ep. 01: Mengupas Titik Kritis Daging Impor',
    tipeMedia: 'AUDIO_PODCAST',
    embedUrl: 'https://open.spotify.com/episode/sample',
    host: 'Ahmad Faiz',
    narasumber: 'Prof. Bambang (LPPOM Halal Auditor)',
    deskripsi:
      'Dialog santai model Escape membahas seluk beluk audit rumah potong hewan luar negeri dan apa yang perlu konsumen tahu.',
    statusPublikasi: 'PUBLISHED',
    foto: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'm-2',
    judul: 'Shorts: 3 Ciri Restoran Korea yang Menggunakan Bumbu Halal Bersertifikat',
    tipeMedia: 'VIDEO_SHORTS',
    embedUrl: 'https://youtube.com/shorts/sample',
    host: 'Dian Laksmi',
    narasumber: 'Chef Hana (Halal Korean Culinary)',
    deskripsi:
      'Tips cepat 60 detik membedakan gochujang halal bersertifikasi BPJPH dari produk yang belum tersertifikasi.',
    statusPublikasi: 'PUBLISHED',
    foto: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'm-3',
    judul: 'Podcast Ep. 02: Resep Ramadhan — Masakan Korea Halal untuk Sahur & Iftar',
    tipeMedia: 'AUDIO_PODCAST',
    embedUrl: 'https://open.spotify.com/episode/sample2',
    host: 'Ahmad Faiz',
    narasumber: 'Chef Sari Nurul (Korean Halal Cook)',
    deskripsi:
      'Inspirasi menu sahur dan buka puasa dengan masakan Korea halal yang praktis, bergizi, dan lezat.',
    statusPublikasi: 'PUBLISHED',
    foto: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=800&q=80',
    createdAt: new Date().toISOString(),
  },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const matchesSearch = (text, q) =>
  !q || (text || '').toLowerCase().includes(q.toLowerCase());

// ─── CONTROLLERS ──────────────────────────────────────────────────────────────

/**
 * GET /api/public/wisata
 * Daftar destinasi wisata halal (publik, tanpa auth)
 */
const getPublicWisata = async (req, res) => {
  const { q } = req.query;
  try {
    // Coba Prisma DB dulu
    const dbData = await prisma.wisataHalal.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    if (dbData.length > 0) {
      let result = dbData;
      if (q) result = result.filter((w) => matchesSearch(w.namaDestinasi, q) || matchesSearch(w.lokasi, q));
      return res.json({ success: true, data: result });
    }
  } catch {
    // fallback ke mock
  }

  let result = mockWisata;
  if (q) result = result.filter((w) => matchesSearch(w.namaDestinasi, q) || matchesSearch(w.lokasi, q) || matchesSearch(w.kategoriWisata, q));
  return res.json({ success: true, data: result });
};

/**
 * GET /api/public/wisata/:id
 */
const getPublicWisataById = async (req, res) => {
  const { id } = req.params;
  try {
    const dbItem = await prisma.wisataHalal.findUnique({ where: { id } });
    if (dbItem) return res.json({ success: true, data: dbItem });
  } catch {}
  const item = mockWisata.find((w) => w.id === id);
  if (!item) return res.status(404).json({ success: false, message: 'Destinasi tidak ditemukan.' });
  return res.json({ success: true, data: item });
};

/**
 * GET /api/public/kuliner
 * Daftar kuliner & restoran halal
 */
const getPublicKuliner = async (req, res) => {
  const { q } = req.query;
  try {
    const dbData = await prisma.restoran.findMany({ orderBy: { createdAt: 'desc' }, take: 20 });
    if (dbData.length > 0) {
      let result = dbData;
      if (q) result = result.filter((k) => matchesSearch(k.namaRestoran, q) || matchesSearch(k.alamat, q));
      return res.json({ success: true, data: result });
    }
  } catch {}

  let result = mockKuliner;
  if (q) result = result.filter((k) => matchesSearch(k.namaRestoran, q) || matchesSearch(k.alamat, q) || matchesSearch(k.kategoriKuliner, q));
  return res.json({ success: true, data: result });
};

/**
 * GET /api/public/kuliner/:id
 */
const getPublicKulinerById = async (req, res) => {
  const { id } = req.params;
  try {
    const dbItem = await prisma.restoran.findUnique({ where: { id } });
    if (dbItem) return res.json({ success: true, data: dbItem });
  } catch {}
  const item = mockKuliner.find((k) => k.id === id);
  if (!item) return res.status(404).json({ success: false, message: 'Kuliner tidak ditemukan.' });
  return res.json({ success: true, data: item });
};

/**
 * GET /api/public/resep
 * Daftar resep halal
 */
const getPublicResep = async (req, res) => {
  const { q } = req.query;
  try {
    const dbData = await prisma.resep.findMany({ orderBy: { createdAt: 'desc' }, take: 20 });
    if (dbData.length > 0) {
      let result = dbData;
      if (q) result = result.filter((r) => matchesSearch(r.judulResep, q));
      return res.json({ success: true, data: result });
    }
  } catch {}

  let result = mockResep;
  if (q) result = result.filter((r) => matchesSearch(r.judulResep, q) || matchesSearch(r.kategoriResep, q) || matchesSearch(r.deskripsi, q));
  return res.json({ success: true, data: result });
};

/**
 * GET /api/public/resep/:id
 */
const getPublicResepById = async (req, res) => {
  const { id } = req.params;
  try {
    const dbItem = await prisma.resep.findUnique({ where: { id } });
    if (dbItem) return res.json({ success: true, data: dbItem });
  } catch {}
  const item = mockResep.find((r) => r.id === id);
  if (!item) return res.status(404).json({ success: false, message: 'Resep tidak ditemukan.' });
  return res.json({ success: true, data: item });
};

/**
 * GET /api/public/edukasi
 * Daftar artikel edukasi/sains pangan
 */
const getPublicEdukasi = async (req, res) => {
  const { q } = req.query;
  try {
    const dbData = await prisma.edukasi.findMany({
      where: { statusPublikasi: 'Published' },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    if (dbData.length > 0) {
      let result = dbData;
      if (q) result = result.filter((a) => matchesSearch(a.judul, q));
      return res.json({ success: true, data: result });
    }
  } catch {}

  let result = mockArtikel;
  if (q) result = result.filter((a) => matchesSearch(a.judul, q) || matchesSearch(a.kategori, q) || matchesSearch(a.ringkasan, q));
  return res.json({ success: true, data: result });
};

/**
 * GET /api/public/edukasi/:id
 */
const getPublicEdukasiById = async (req, res) => {
  const { id } = req.params;
  try {
    const dbItem = await prisma.edukasi.findUnique({ where: { id } });
    if (dbItem) return res.json({ success: true, data: dbItem });
  } catch {}
  const item = mockArtikel.find((a) => a.id === id);
  if (!item) return res.status(404).json({ success: false, message: 'Artikel tidak ditemukan.' });
  return res.json({ success: true, data: item });
};

/**
 * GET /api/public/media
 * Daftar media podcast & video
 */
const getPublicMedia = async (req, res) => {
  return res.json({ success: true, data: mockMedia });
};

/**
 * GET /api/search
 * Pencarian lintas konten (wisata, kuliner, resep, edukasi)
 */
const searchAll = async (req, res) => {
  const { q = '', category = 'all' } = req.query;

  if (!q.trim() && category === 'all') {
    return res.json({ success: true, data: { wisata: [], kuliner: [], resep: [], edukasi: [] } });
  }

  const qLower = q.toLowerCase().trim();

  const filterItem = (text) => !qLower || (text || '').toLowerCase().includes(qLower);

  const results = {};

  if (category === 'all' || category === 'wisata') {
    results.wisata = mockWisata
      .filter((w) => filterItem(w.namaDestinasi) || filterItem(w.lokasi) || filterItem(w.kategoriWisata) || filterItem(w.deskripsi))
      .slice(0, 6)
      .map((w) => ({ id: w.id, nama: w.namaDestinasi, kategori: w.kategoriWisata, fotoUtama: w.foto, lokasi: w.lokasi }));
  }

  if (category === 'all' || category === 'kuliner') {
    results.kuliner = mockKuliner
      .filter((k) => filterItem(k.namaRestoran) || filterItem(k.alamat) || filterItem(k.kategoriKuliner))
      .slice(0, 6)
      .map((k) => ({ id: k.id, nama: k.namaRestoran, kategori: k.kategoriKuliner, fotoUtama: k.foto, alamat: k.alamat, statusHalal: k.statusSertifikasi }));
  }

  if (category === 'all' || category === 'resep') {
    results.resep = mockResep
      .filter((r) => filterItem(r.judulResep) || filterItem(r.kategoriResep) || filterItem(r.deskripsi))
      .slice(0, 6)
      .map((r) => ({ id: r.id, nama: r.judulResep, kategori: r.kategoriResep, fotoUtama: r.foto, waktuMasakMenit: r.waktuMasakMenit, porsi: r.porsi }));
  }

  if (category === 'all' || category === 'edukasi') {
    results.edukasi = mockArtikel
      .filter((a) => filterItem(a.judul) || filterItem(a.kategori) || filterItem(a.ringkasan))
      .slice(0, 6)
      .map((a) => ({ id: a.id, nama: a.judul, kategori: a.kategori, fotoUtama: a.foto, penulis: a.penulis, waktuBaca: a.waktuBaca }));
  }

  const totalResults = Object.values(results).reduce((acc, arr) => acc + (arr?.length || 0), 0);

  return res.json({
    success: true,
    message: totalResults > 0 ? 'Hasil pencarian berhasil ditemukan.' : 'Tidak ada hasil yang sesuai.',
    totalResults,
    query: q,
    data: results,
  });
};

module.exports = {
  getPublicWisata,
  getPublicWisataById,
  getPublicKuliner,
  getPublicKulinerById,
  getPublicResep,
  getPublicResepById,
  getPublicEdukasi,
  getPublicEdukasiById,
  getPublicMedia,
  searchAll,
};
