const prisma = require('../config/db');
const bcrypt = require('bcryptjs');

// Mock data awal untuk menjamin fungsionalitas visual jika database MySQL lokal belum diaktifkan
let mockKuliner = [
  {
    id: 'k-1',
    namaRestoran: 'Chuseok Korean Halal BBQ',
    kategoriKuliner: 'Restoran Korea Halal',
    statusSertifikasi: 'Terverifikasi BPJPH',
    nomorSertifikatHalal: 'ID32110001234560124',
    alamat: 'Jl. Margonda Raya No. 120',
    kecamatan: 'Beji',
    latitude: -6.3688,
    longitude: 106.8332,
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
    latitude: -6.3982,
    longitude: 106.8123,
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
    latitude: -6.3812,
    longitude: 106.8456,
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
    latitude: -6.3701,
    longitude: 106.8300,
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
    latitude: -6.3990,
    longitude: 106.8120,
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
    latitude: -6.3750,
    longitude: 106.8500,
    kisaranHarga: '$$$',
    jamOperasional: '10:00 - 22:00 WIB',
    statusVerifikasi: 'VERIFIED',
    foto: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&q=80',
    createdAt: new Date().toISOString(),
  },
];

let mockArtikel = [
  {
    id: 'a-1',
    judul: 'Titik Kritis Bahan Baku Halal pada Makanan Olahan Modern',
    slug: 'titik-kritis-bahan-baku-halal-olahan-modern',
    kategori: 'Sains Pangan',
    penulis: 'Dr. Ir. Siti Halimah, M.Sc.',
    ringkasan: 'Mengenal enzim, emulsifier E471, dan gelatin dalam pangan olahan impor — mana yang aman, mana yang harus diwaspadai.',
    isiKonten: 'Pembahasan mendalam tentang proses identifikasi bahan turunan hewani pada produk pangan olahan modern...',
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
    ringkasan: 'Daftar lengkap restoran Korea yang bebas mirin, arak masak, dan berstatus halal resmi di area Jabodetabek.',
    isiKonten: 'Kajian substitusi bahan autentik Korea dengan bumbu halal bersertifikat...',
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
    ringkasan: 'Proses panjang di balik segel halal — mulai dari sampling produk, uji DNA babi, hingga audit rantai pasok.',
    isiKonten: 'Proses verifikasi kehalalan produk impor melibatkan serangkaian uji laboratorium yang ketat...',
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
    ringkasan: 'Panduan lengkap destinasi wisata halal di Jawa Barat yang cocok untuk liburan Ramadhan bersama keluarga.',
    isiKonten: 'Jawa Barat menyimpan banyak destinasi wisata ramah Muslim yang cocok untuk dikunjungi selama Ramadhan...',
    statusPublikasi: 'PUBLISHED',
    waktuBaca: '8 menit',
    foto: 'https://images.unsplash.com/photo-1537031503481-5a1f9b7f2bae?w=800&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'a-5',
    judul: 'Mengenal Koro Pedang: Superfood Lokal Depok Pengganti Kedelai Impor',
    slug: 'mengenal-koro-pedang-superfood-lokal-depok',
    kategori: 'Sains Pangan',
    penulis: 'Dr. Ahmad Fauzan, M.Gizi',
    ringkasan: 'Kacang koro pedang khas Depok mengandung protein tinggi dan berpotensi menggantikan kedelai impor dalam industri pangan halal.',
    isiKonten: 'Koro pedang (Canavalia ensiformis) adalah tanaman legum yang kaya protein dan tumbuh subur di Depok...',
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
    ringkasan: 'Panduan praktis membaca label produk bumbu Korea — kapan gochujang aman dikonsumsi dan kapan harus dihindari.',
    isiKonten: 'Gochujang adalah pasta cabai fermentasi Korea yang menjadi bumbu andalan...',
    statusPublikasi: 'PUBLISHED',
    waktuBaca: '4 menit',
    foto: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=800&q=80',
    createdAt: new Date().toISOString(),
  },
];

let mockResep = [
  {
    id: 'r-1',
    judulResep: 'Bulgogi Daging Sapi Saus Apel Halal Tanpa Mirin',
    slug: 'bulgogi-daging-sapi-halal-tanpa-mirin',
    kategoriResep: 'Olahan Sehat',
    porsi: 4,
    waktuMasakMenit: 30,
    tingkatKesulitan: 'Sedang',
    deskripsi: 'Resep bulgogi autentik Korea menggunakan perasan buah pir & apel sebagai pengganti arak beras. Halal, lezat, dan tersertifikasi.',
    bahanBahan: '500g Daging Sapi Has Luar\n1 Buah Pir Korea (parut)\n1 Buah Apel (parut)\n4 sdm Kecap Asin Halal\n2 sdm Minyak Wijen Halal\n3 siung Bawang Putih\n1 sdm Gula Merah\nBawang Bombay',
    instruksi: '1. Iris daging sapi tipis-tipis.\n2. Campurkan parutan pir, apel, kecap asin, minyak wijen, bawang putih, dan gula merah.\n3. Marinasi daging selama minimal 30 menit.\n4. Panaskan wajan anti lengket, masak daging hingga matang kecoklatan.',
    statusPublikasi: 'PUBLISHED',
    foto: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
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
    deskripsi: 'Inovasi olahan pangan lokal kacang koro pedang khas Depok yang bergizi tinggi dan cocok sebagai camilan sehat keluarga.',
    bahanBahan: '300g Tempe Koro Pedang\n2 siung Bawang Putih\n1 sdt Garam\n1/2 sdt Merica\nTepung Panir Halal\n2 Butir Telur',
    instruksi: '1. Kukus tempe hingga empuk.\n2. Haluskan bersama bumbu-bumbu.\n3. Bentuk adonan menjadi nugget.\n4. Celup ke telur, balur panir.\n5. Kukus 15 menit, lalu goreng hingga kuning keemasan.',
    statusPublikasi: 'PUBLISHED',
    foto: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
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
    deskripsi: 'Tteokbokki halal dengan gochujang bersertifikat BPJPH, tanpa arak masak, sempurna untuk makan siang.',
    bahanBahan: '400g Tteok (Kue Beras Korea)\n3 sdm Gochujang Halal Bersertifikat\n2 sdm Kecap Asin Halal\n1 sdm Gula\n2 siung Bawang Putih\nDaun Bawang',
    instruksi: '1. Rendam tteok dalam air hangat 10 menit.\n2. Tumis bawang putih, masukkan gochujang.\n3. Tambahkan air 300ml, masak hingga mendidih.\n4. Masukkan tteok, aduk rata hingga saus mengental.',
    statusPublikasi: 'PUBLISHED',
    foto: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&q=80',
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
    deskripsi: 'Bibimbap dengan sayuran segar, daging sapi halal, dan telur setengah matang. Sehat, bergizi, dan 100% halal.',
    bahanBahan: '2 porsi Nasi Putih\n200g Daging Sapi (iris)\n2 Butir Telur\nBayam, Wortel, Tauge\n2 sdm Gochujang Halal\n1 sdm Minyak Wijen Halal',
    instruksi: '1. Tumis masing-masing sayuran secara terpisah.\n2. Masak daging sapi dengan bumbu halal.\n3. Susun nasi di mangkuk, tata sayuran dan daging.\n4. Tambahkan telur ceplok setengah matang.\n5. Sajikan dengan gochujang halal.',
    statusPublikasi: 'PUBLISHED',
    foto: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&q=80',
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
    deskripsi: 'Rendang otentik Minangkabau dengan santan kelapa segar, cabai merah keriting, dan rempah pilihan. 100% halal.',
    bahanBahan: '1 kg Daging Sapi (potong dadu)\n1 liter Santan Kelapa Segar\n8 buah Cabai Merah Keriting\n4 siung Bawang Putih\n8 siung Bawang Merah\n2 batang Serai\nLengkuas, Jahe, Kunyit',
    instruksi: '1. Haluskan semua bumbu kecuali serai dan lengkuas.\n2. Tumis bumbu halus, masukkan serai dan lengkuas.\n3. Masukkan daging, aduk rata dengan bumbu.\n4. Tuang santan, masak api sedang sambil sesekali diaduk.\n5. Masak hingga santan surut dan daging berwarna kecoklatan (±2 jam).',
    statusPublikasi: 'PUBLISHED',
    foto: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80',
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
    deskripsi: 'Japchae dengan sayuran warna-warni dan daging sapi tipis, menggunakan kecap halal tanpa mirin.',
    bahanBahan: '200g Dangmyeon (Mie Kaca Korea)\n150g Daging Sapi (iris tipis)\nSpinach, Wortel, Jamur Shiitake, Paprika\n3 sdm Kecap Asin Halal\n1 sdm Minyak Wijen Halal\n1 sdm Gula',
    instruksi: '1. Rendam dan rebus mie kaca hingga al dente.\n2. Tumis setiap sayuran secara terpisah.\n3. Masak daging dengan kecap asin halal.\n4. Campur semua bahan, tambahkan minyak wijen dan gula.\n5. Aduk rata di api kecil hingga bumbu meresap.',
    statusPublikasi: 'PUBLISHED',
    foto: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80',
    createdAt: new Date().toISOString(),
  },
];

let mockWisata = [
  {
    id: 'w-1',
    namaDestinasi: 'Taman Hutan Raya Depok & Kawasan Religi Situ Pengasinan',
    kategoriWisata: 'Wisata Alam',
    lokasi: 'Jl. Pengasinan Raya, Sawangan',
    kecamatan: 'Sawangan',
    latitude: -6.4214,
    longitude: 106.7645,
    fasilitas: ['Musholla Bersih', 'Tempat Wudhu Terpisah', 'Kuliner Halal', 'Toilet Ramah Muslim'],
    jamBuka: '07:00 - 17:30 WIB',
    hargaTiket: 'Rp 5.000 / orang',
    deskripsi: 'Destinasi wisata hijau yang asri dengan kemudahan sarana ibadah di setiap titik utama kawasan.',
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
    deskripsi: 'Masjid megah berlapis kubah emas murni, landmark religi kebanggaan Kota Depok yang terbuka untuk umum.',
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
    deskripsi: 'Kawasan pelestarian budaya Betawi dengan pertunjukan seni, kuliner khas, dan nuansa kampung halaman autentik.',
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
    deskripsi: 'Danau buatan alami dengan suasana sejuk dan spot foto instagramable, cocok untuk keluarga Muslim.',
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
    deskripsi: 'Taman hiburan keluarga dengan kolam renang, wahana, dan fasilitas ibadah lengkap.',
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
    deskripsi: 'Resort eko-wisata di lereng pegunungan dengan konsep ramah Muslim dan pemandangan alam yang memukau.',
    statusVerifikasi: 'VERIFIED',
    foto: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    createdAt: new Date().toISOString(),
  },
];

let mockMedia = [
  {
    id: 'm-1',
    judul: 'Podcast Halal Insight Ep. 01: Mengupas Titik Kritis Daging Impor',
    tipeMedia: 'AUDIO_PODCAST',
    embedUrl: 'https://open.spotify.com/episode/sample',
    host: 'Ahmad Faiz',
    narasumber: 'Prof. Bambang (LPPOM Halal Auditor)',
    deskripsi: 'Dialog santai model Escape membahas seluk beluk audit rumah potong hewan luar negeri dan apa yang perlu konsumen tahu.',
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
    deskripsi: 'Tips cepat 60 detik membedakan gochujang halal bersertifikasi BPJPH dari produk yang belum tersertifikasi.',
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
    deskripsi: 'Inspirasi menu sahur dan buka puasa dengan masakan Korea halal yang praktis, bergizi, dan lezat.',
    statusPublikasi: 'PUBLISHED',
    foto: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=800&q=80',
    createdAt: new Date().toISOString(),
  },
];

let mockLogs = [
  {
    id: 'log-1',
    waktu: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    adminName: 'Admin Halal Channel',
    adminEmail: 'admin@rpnn.depok.go.id',
    aksi: 'CREATE',
    modulTarget: 'KULINER',
    deskripsi: "Menambahkan restoran baru 'Chuseok Korean Halal BBQ'",
  },
  {
    id: 'log-2',
    waktu: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    adminName: 'Admin Halal Channel',
    adminEmail: 'admin@rpnn.depok.go.id',
    aksi: 'VERIFY',
    modulTarget: 'KULINER',
    deskripsi: "Menyetujui verifikasi restoran Korea Halal 'Chuseok Korean Halal BBQ'",
  },
  {
    id: 'log-3',
    waktu: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    adminName: 'Admin Halal Channel',
    adminEmail: 'admin@rpnn.depok.go.id',
    aksi: 'CREATE',
    modulTarget: 'ARTIKEL_EDUKASI',
    deskripsi: "Mempublikasikan artikel 'Titik Kritis Bahan Baku Halal pada Makanan Olahan Modern'",
  },
  {
    id: 'log-4',
    waktu: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    adminName: 'Admin Halal Channel',
    adminEmail: 'admin@rpnn.depok.go.id',
    aksi: 'LOGIN',
    modulTarget: 'USER',
    deskripsi: 'Sesi masuk administrator berhasil via IP 127.0.0.1',
  },
];

let mockUsers = [
  {
    id: 'dec2eef8-8bc2-4d05-acff-24226feeecbe',
    namaLengkap: 'Admin Halal Channel',
    email: 'admin@rpnn.depok.go.id',
    role: 'Admin',
    createdAt: new Date().toISOString(),
  },
];

// Helper untuk mencatat log aktivitas
const recordAuditLog = async (adminUser, aksi, modulTarget, deskripsi) => {
  const newLog = {
    id: `log-${Date.now()}`,
    waktu: new Date().toISOString(),
    adminName: adminUser?.namaLengkap || 'Admin Halal Channel',
    adminEmail: adminUser?.email || 'admin@rpnn.depok.go.id',
    aksi,
    modulTarget,
    deskripsi,
  };
  mockLogs.unshift(newLog);

  try {
    if (adminUser?.id) {
      await prisma.logAktivitasAdmin.create({
        data: {
          adminId: adminUser.id,
          aksi: aksi === 'CREATE' ? 'Create' : aksi === 'UPDATE' ? 'Update' : 'Delete',
          modulTarget,
          keterangan: deskripsi,
        },
      });
    }
  } catch (err) {
    // Non-blocking log catch
  }
};

// 1. GET /api/admin/dashboard/stats
const getDashboardStats = async (req, res) => {
  try {
    let totalArtikel = mockArtikel.length;
    let totalResep = mockResep.length;
    let totalKuliner = mockKuliner.length;
    let totalWisata = mockWisata.length;
    let totalMedia = mockMedia.length;

    try {
      const [dbArtikel, dbResep, dbResto, dbWisata] = await Promise.all([
        prisma.edukasi.count(),
        prisma.resep.count(),
        prisma.restoran.count(),
        prisma.wisataHalal.count(),
      ]);
      if (dbArtikel > 0) totalArtikel = dbArtikel;
      if (dbResep > 0) totalResep = dbResep;
      if (dbResto > 0) totalKuliner = dbResto;
      if (dbWisata > 0) totalWisata = dbWisata;
    } catch {
      // Menggunakan mock data statistik
    }

    const verifiedCount = mockKuliner.filter((k) => k.statusVerifikasi === 'VERIFIED').length;
    const reviewCount = mockKuliner.filter((k) => k.statusVerifikasi === 'IN_REVIEW').length;
    const draftCount = mockKuliner.filter((k) => k.statusVerifikasi === 'DRAFT').length;

    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil statistik dashboard',
      data: {
        totalArtikel,
        totalResep,
        totalKuliner,
        totalWisata,
        totalMedia,
        statusVerifikasi: {
          draft: draftCount,
          inReview: reviewCount,
          verified: verifiedCount,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil data statistik dashboard.',
    });
  }
};

// 2. GET /api/admin/logs
const getLogs = async (req, res) => {
  try {
    try {
      const dbLogs = await prisma.logAktivitasAdmin.findMany({
        take: 30,
        orderBy: { createdAt: 'desc' },
        include: { admin: { select: { namaLengkap: true, email: true } } },
      });
      if (dbLogs.length > 0) {
        const formatted = dbLogs.map((l) => ({
          id: l.id,
          waktu: l.createdAt,
          adminName: l.admin?.namaLengkap || 'Admin',
          adminEmail: l.admin?.email || 'admin@rpnn.depok.go.id',
          aksi: l.aksi.toUpperCase(),
          modulTarget: l.modulTarget,
          deskripsi: l.keterangan,
        }));
        return res.status(200).json({
          success: true,
          message: 'Berhasil mengambil data log aktivitas',
          data: formatted,
        });
      }
    } catch {
      // Fallback ke mockLogs
    }

    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil data log aktivitas',
      data: mockLogs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil riwayat audit log.',
    });
  }
};

// 3. GET /api/admin/users & POST /api/admin/users
const getAdminUsers = async (req, res) => {
  try {
    try {
      const users = await prisma.user.findMany({
        include: { role: true },
        orderBy: { createdAt: 'desc' },
      });
      if (users.length > 0) {
        const formatted = users.map((u) => ({
          id: u.id,
          namaLengkap: u.namaLengkap,
          email: u.email,
          role: u.role?.namaRole || 'Admin',
          createdAt: u.createdAt,
        }));
        return res.status(200).json({
          success: true,
          data: formatted,
        });
      }
    } catch {
      // Fallback
    }

    return res.status(200).json({
      success: true,
      data: mockUsers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil daftar admin.',
    });
  }
};

const createAdminUser = async (req, res) => {
  try {
    const { namaLengkap, email, password } = req.body;

    if (!namaLengkap || namaLengkap.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Nama lengkap wajib diisi minimal 3 karakter.',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Format email tidak valid.',
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password minimal 6 karakter.',
      });
    }

    // Cek apakah email sudah ada di mock
    const existingMock = mockUsers.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (existingMock) {
      return res.status(400).json({
        success: false,
        message: 'Email sudah terdaftar. Gunakan alamat email lain.',
      });
    }

    let newUser = null;

    try {
      const roleAdmin = await prisma.role.findFirst({ where: { namaRole: 'Admin' } });
      const hashedPassword = await bcrypt.hash(password, 10);

      const dbUser = await prisma.user.create({
        data: {
          namaLengkap: namaLengkap.trim(),
          email: email.trim().toLowerCase(),
          password: hashedPassword,
          roleId: roleAdmin ? roleAdmin.id : 'admin-role-id',
        },
      });

      newUser = {
        id: dbUser.id,
        namaLengkap: dbUser.namaLengkap,
        email: dbUser.email,
        role: 'Admin',
        createdAt: dbUser.createdAt,
      };
    } catch {
      // Fallback in-memory
      newUser = {
        id: `usr-${Date.now()}`,
        namaLengkap: namaLengkap.trim(),
        email: email.trim().toLowerCase(),
        role: 'Admin',
        createdAt: new Date().toISOString(),
      };
    }

    mockUsers.unshift(newUser);

    await recordAuditLog(
      req.user,
      'CREATE',
      'USER',
      `Menambahkan akun admin baru: ${newUser.namaLengkap} (${newUser.email})`
    );

    return res.status(201).json({
      success: true,
      message: 'Akun Admin baru berhasil dibuat.',
      data: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat membuat akun admin.',
    });
  }
};

// ========================================================
// CRUD KULINER (Restoran Korea & Kuliner Halal)
// ========================================================
const getKuliner = (req, res) => {
  const { search, kategori, status } = req.query;
  let result = [...mockKuliner];

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (item) => item.namaRestoran.toLowerCase().includes(q) || item.alamat.toLowerCase().includes(q)
    );
  }
  if (kategori && kategori !== 'ALL') {
    result = result.filter((item) => item.kategoriKuliner === kategori);
  }
  if (status && status !== 'ALL') {
    result = result.filter((item) => item.statusVerifikasi === status);
  }

  return res.status(200).json({ success: true, data: result });
};

const createKuliner = async (req, res) => {
  try {
    const {
      namaRestoran,
      kategoriKuliner,
      statusSertifikasi,
      nomorSertifikatHalal,
      alamat,
      kecamatan,
      latitude,
      longitude,
      kisaranHarga,
      jamOperasional,
      statusVerifikasi = 'DRAFT',
      foto,
    } = req.body;

    if (!namaRestoran) {
      return res.status(400).json({ success: false, message: 'Nama tempat makan wajib diisi.' });
    }

    const newItem = {
      id: `k-${Date.now()}`,
      namaRestoran,
      kategoriKuliner: kategoriKuliner || 'Restoran Korea Halal',
      statusSertifikasi: statusSertifikasi || 'Proses',
      nomorSertifikatHalal: nomorSertifikatHalal || '-',
      alamat: alamat || 'Depok',
      kecamatan: kecamatan || 'Beji',
      latitude: parseFloat(latitude) || -6.3688,
      longitude: parseFloat(longitude) || 106.8332,
      kisaranHarga: kisaranHarga || '$$',
      jamOperasional: jamOperasional || '10:00 - 21:00 WIB',
      statusVerifikasi,
      foto: foto || '',
      createdAt: new Date().toISOString(),
    };

    mockKuliner.unshift(newItem);
    await recordAuditLog(req.user, 'CREATE', 'KULINER', `Menambahkan kuliner: ${namaRestoran}`);

    return res.status(201).json({ success: true, message: 'Data kuliner berhasil disimpan.', data: newItem });
  } catch (error) {
    console.error('createKuliner error:', error);
    return res.status(500).json({ success: false, message: 'Gagal menyimpan data kuliner.' });
  }
};

const updateKuliner = async (req, res) => {
  try {
    const { id } = req.params;
    const index = mockKuliner.findIndex((k) => k.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Data kuliner tidak ditemukan.' });
    }

    mockKuliner[index] = { ...mockKuliner[index], ...req.body };
    await recordAuditLog(req.user, 'UPDATE', 'KULINER', `Memperbarui data kuliner: ${mockKuliner[index].namaRestoran}`);

    return res.status(200).json({ success: true, message: 'Data berhasil diperbarui.', data: mockKuliner[index] });
  } catch (error) {
    console.error('updateKuliner error:', error);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui data kuliner.' });
  }
};

const deleteKuliner = async (req, res) => {
  try {
    const { id } = req.params;
    const item = mockKuliner.find((k) => k.id === id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Data kuliner tidak ditemukan.' });
    }

    mockKuliner = mockKuliner.filter((k) => k.id !== id);
    await recordAuditLog(req.user, 'DELETE', 'KULINER', `Menghapus tempat makan: ${item.namaRestoran}`);

    return res.status(200).json({ success: true, message: 'Data berhasil dihapus.' });
  } catch (error) {
    console.error('deleteKuliner error:', error);
    return res.status(500).json({ success: false, message: 'Gagal menghapus data kuliner.' });
  }
};

const updateKulinerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const item = mockKuliner.find((k) => k.id === id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Data tidak ditemukan.' });
    }

    item.statusVerifikasi = status;
    await recordAuditLog(req.user, 'VERIFY', 'KULINER', `Mengubah status verifikasi '${item.namaRestoran}' menjadi ${status}`);

    return res.status(200).json({ success: true, message: 'Status verifikasi berhasil diubah.', data: item });
  } catch (error) {
    console.error('updateKulinerStatus error:', error);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui status verifikasi.' });
  }
};

// ========================================================
// CRUD EDUKASI (Artikel Sains Pangan & Syariat)
// ========================================================
const getEdukasi = (req, res) => {
  return res.status(200).json({ success: true, data: mockArtikel });
};

const createEdukasi = async (req, res) => {
  try {
    const { judul, kategori, penulis, ringkasan, isiKonten, statusPublikasi, foto, waktuBaca } = req.body;
    if (!judul) {
      return res.status(400).json({ success: false, message: 'Judul artikel wajib diisi.' });
    }

    const newArticle = {
      id: `a-${Date.now()}`,
      judul,
      slug: judul.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      kategori: kategori || 'Sains Pangan',
      penulis: penulis || req.user?.namaLengkap || 'Admin Halal Channel',
      ringkasan: ringkasan || '',
      isiKonten: isiKonten || '',
      statusPublikasi: statusPublikasi || 'DRAFT',
      foto: foto || '',
      waktuBaca: waktuBaca || '5 menit',
      createdAt: new Date().toISOString(),
    };

    mockArtikel.unshift(newArticle);
    await recordAuditLog(req.user, 'CREATE', 'ARTIKEL_EDUKASI', `Membuat artikel edukasi: ${judul}`);

    return res.status(201).json({ success: true, message: 'Artikel edukasi berhasil dibuat.', data: newArticle });
  } catch (error) {
    console.error('createEdukasi error:', error);
    return res.status(500).json({ success: false, message: 'Gagal membuat artikel edukasi.' });
  }
};

const updateEdukasi = async (req, res) => {
  try {
    const { id } = req.params;
    const index = mockArtikel.findIndex((a) => a.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Artikel tidak ditemukan.' });
    }

    mockArtikel[index] = { ...mockArtikel[index], ...req.body };
    await recordAuditLog(req.user, 'UPDATE', 'ARTIKEL_EDUKASI', `Memperbarui artikel: ${mockArtikel[index].judul}`);

    return res.status(200).json({ success: true, message: 'Artikel berhasil diperbarui.', data: mockArtikel[index] });
  } catch (error) {
    console.error('updateEdukasi error:', error);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui artikel.' });
  }
};

const deleteEdukasi = async (req, res) => {
  try {
    const { id } = req.params;
    const item = mockArtikel.find((a) => a.id === id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Artikel tidak ditemukan.' });
    }

    mockArtikel = mockArtikel.filter((a) => a.id !== id);
    await recordAuditLog(req.user, 'DELETE', 'ARTIKEL_EDUKASI', `Menghapus artikel: ${item.judul}`);

    return res.status(200).json({ success: true, message: 'Artikel berhasil dihapus.' });
  } catch (error) {
    console.error('deleteEdukasi error:', error);
    return res.status(500).json({ success: false, message: 'Gagal menghapus artikel.' });
  }
};

// ========================================================
// CRUD RESEP
// ========================================================
const getResep = (req, res) => {
  return res.status(200).json({ success: true, data: mockResep });
};

const createResep = async (req, res) => {
  try {
    const { judulResep, kategoriResep, porsi, waktuMasakMenit, tingkatKesulitan, deskripsi, bahanBahan, instruksi, statusPublikasi, foto } = req.body;
    if (!judulResep) {
      return res.status(400).json({ success: false, message: 'Nama resep wajib diisi.' });
    }

    const newResep = {
      id: `r-${Date.now()}`,
      judulResep,
      slug: judulResep.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      kategoriResep: kategoriResep || 'Olahan Sehat',
      porsi: Number(porsi) || 2,
      waktuMasakMenit: Number(waktuMasakMenit) || 30,
      tingkatKesulitan: tingkatKesulitan || 'Mudah',
      deskripsi: deskripsi || '',
      bahanBahan: bahanBahan || '',
      instruksi: instruksi || '',
      statusPublikasi: statusPublikasi || 'DRAFT',
      foto: foto || '',
      createdAt: new Date().toISOString(),
    };

    mockResep.unshift(newResep);
    await recordAuditLog(req.user, 'CREATE', 'RESEP_HALAL', `Menambahkan resep halal: ${judulResep}`);

    return res.status(201).json({ success: true, message: 'Resep halal berhasil ditambahkan.', data: newResep });
  } catch (error) {
    console.error('createResep error:', error);
    return res.status(500).json({ success: false, message: 'Gagal menyimpan resep halal.' });
  }
};

const updateResep = async (req, res) => {
  try {
    const { id } = req.params;
    const index = mockResep.findIndex((r) => r.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Resep tidak ditemukan.' });
    }

    mockResep[index] = { ...mockResep[index], ...req.body };
    await recordAuditLog(req.user, 'UPDATE', 'RESEP_HALAL', `Memperbarui resep: ${mockResep[index].judulResep}`);

    return res.status(200).json({ success: true, message: 'Resep berhasil diperbarui.', data: mockResep[index] });
  } catch (error) {
    console.error('updateResep error:', error);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui resep.' });
  }
};

const deleteResep = async (req, res) => {
  try {
    const { id } = req.params;
    const item = mockResep.find((r) => r.id === id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Resep tidak ditemukan.' });
    }

    mockResep = mockResep.filter((r) => r.id !== id);
    await recordAuditLog(req.user, 'DELETE', 'RESEP_HALAL', `Menghapus resep: ${item.judulResep}`);

    return res.status(200).json({ success: true, message: 'Resep berhasil dihapus.' });
  } catch (error) {
    console.error('deleteResep error:', error);
    return res.status(500).json({ success: false, message: 'Gagal menghapus resep.' });
  }
};

// ========================================================
// CRUD WISATA HALAL
// ========================================================
const getWisata = (req, res) => {
  return res.status(200).json({ success: true, data: mockWisata });
};

const createWisata = async (req, res) => {
  try {
    const { namaDestinasi, kategoriWisata, lokasi, kecamatan, fasilitas, jamBuka, hargaTiket, deskripsi, statusVerifikasi, foto } = req.body;
    if (!namaDestinasi) {
      return res.status(400).json({ success: false, message: 'Nama destinasi wajib diisi.' });
    }

    const newWisata = {
      id: `w-${Date.now()}`,
      namaDestinasi,
      kategoriWisata: kategoriWisata || 'Wisata Alam',
      lokasi: lokasi || 'Depok',
      kecamatan: kecamatan || 'Sawangan',
      latitude: -6.4214,
      longitude: 106.7645,
      fasilitas: Array.isArray(fasilitas) ? fasilitas : ['Musholla Bersih', 'Kuliner Halal'],
      jamBuka: jamBuka || '08:00 - 17:00 WIB',
      hargaTiket: hargaTiket || 'Gratis',
      deskripsi: deskripsi || '',
      statusVerifikasi: statusVerifikasi || 'VERIFIED',
      foto: foto || '',
      createdAt: new Date().toISOString(),
    };

    mockWisata.unshift(newWisata);
    await recordAuditLog(req.user, 'CREATE', 'WISATA', `Menambahkan destinasi wisata: ${namaDestinasi}`);

    return res.status(201).json({ success: true, message: 'Destinasi wisata berhasil disimpan.', data: newWisata });
  } catch (error) {
    console.error('createWisata error:', error);
    return res.status(500).json({ success: false, message: 'Gagal menyimpan destinasi wisata.' });
  }
};

const updateWisata = async (req, res) => {
  try {
    const { id } = req.params;
    const index = mockWisata.findIndex((w) => w.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Wisata tidak ditemukan.' });
    }

    mockWisata[index] = { ...mockWisata[index], ...req.body };
    await recordAuditLog(req.user, 'UPDATE', 'WISATA', `Memperbarui destinasi: ${mockWisata[index].namaDestinasi}`);

    return res.status(200).json({ success: true, message: 'Destinasi berhasil diperbarui.', data: mockWisata[index] });
  } catch (error) {
    console.error('updateWisata error:', error);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui destinasi wisata.' });
  }
};

const deleteWisata = async (req, res) => {
  try {
    const { id } = req.params;
    const item = mockWisata.find((w) => w.id === id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Wisata tidak ditemukan.' });
    }

    mockWisata = mockWisata.filter((w) => w.id !== id);
    await recordAuditLog(req.user, 'DELETE', 'WISATA', `Menghapus destinasi wisata: ${item.namaDestinasi}`);

    return res.status(200).json({ success: true, message: 'Destinasi berhasil dihapus.' });
  } catch (error) {
    console.error('deleteWisata error:', error);
    return res.status(500).json({ success: false, message: 'Gagal menghapus destinasi wisata.' });
  }
};

// ========================================================
// CRUD MEDIA (Podcast & Video Shorts)
// ========================================================
const getMedia = (req, res) => {
  return res.status(200).json({ success: true, data: mockMedia });
};

const createMedia = async (req, res) => {
  try {
    const { judul, tipeMedia, embedUrl, host, narasumber, deskripsi, statusPublikasi } = req.body;
    if (!judul) {
      return res.status(400).json({ success: false, message: 'Judul program media wajib diisi.' });
    }

    const newMedia = {
      id: `m-${Date.now()}`,
      judul,
      tipeMedia: tipeMedia || 'AUDIO_PODCAST',
      embedUrl: embedUrl || '',
      host: host || 'Host Halal Channel',
      narasumber: narasumber || 'Pakar Halal',
      deskripsi: deskripsi || '',
      statusPublikasi: statusPublikasi || 'PUBLISHED',
      createdAt: new Date().toISOString(),
    };

    mockMedia.unshift(newMedia);
    await recordAuditLog(req.user, 'CREATE', 'MEDIA', `Menambahkan episode media: ${judul}`);

    return res.status(201).json({ success: true, message: 'Media podcast/shorts berhasil disimpan.', data: newMedia });
  } catch (error) {
    console.error('createMedia error:', error);
    return res.status(500).json({ success: false, message: 'Gagal menyimpan media.' });
  }
};

const updateMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const index = mockMedia.findIndex((m) => m.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Media tidak ditemukan.' });
    }

    mockMedia[index] = { ...mockMedia[index], ...req.body };
    await recordAuditLog(req.user, 'UPDATE', 'MEDIA', `Memperbarui media: ${mockMedia[index].judul}`);

    return res.status(200).json({ success: true, message: 'Media berhasil diperbarui.', data: mockMedia[index] });
  } catch (error) {
    console.error('updateMedia error:', error);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui media.' });
  }
};

const deleteMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const item = mockMedia.find((m) => m.id === id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Media tidak ditemukan.' });
    }

    mockMedia = mockMedia.filter((m) => m.id !== id);
    await recordAuditLog(req.user, 'DELETE', 'MEDIA', `Menghapus media: ${item.judul}`);

    return res.status(200).json({ success: true, message: 'Media berhasil dihapus.' });
  } catch (error) {
    console.error('deleteMedia error:', error);
    return res.status(500).json({ success: false, message: 'Gagal menghapus media.' });
  }
};

module.exports = {
  getDashboardStats,
  getLogs,
  getAdminUsers,
  createAdminUser,
  getKuliner,
  createKuliner,
  updateKuliner,
  deleteKuliner,
  updateKulinerStatus,
  getEdukasi,
  createEdukasi,
  updateEdukasi,
  deleteEdukasi,
  getResep,
  createResep,
  updateResep,
  deleteResep,
  getWisata,
  createWisata,
  updateWisata,
  deleteWisata,
  getMedia,
  createMedia,
  updateMedia,
  deleteMedia,
};

