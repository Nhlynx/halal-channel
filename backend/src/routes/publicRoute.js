const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/publicController');

// ── Rute Publik (tanpa autentikasi) ──────────────────────────────────────────

// Pencarian lintas konten
router.get('/search', searchAll);

// Wisata Halal
router.get('/public/wisata', getPublicWisata);
router.get('/public/wisata/:id', getPublicWisataById);

// Kuliner & Restoran Halal
router.get('/public/kuliner', getPublicKuliner);
router.get('/public/kuliner/:id', getPublicKulinerById);

// Resep Halal
router.get('/public/resep', getPublicResep);
router.get('/public/resep/:id', getPublicResepById);

// Edukasi / Artikel Sains Pangan
router.get('/public/edukasi', getPublicEdukasi);
router.get('/public/edukasi/:id', getPublicEdukasiById);

// Media Podcast & Video
router.get('/public/media', getPublicMedia);

module.exports = router;
