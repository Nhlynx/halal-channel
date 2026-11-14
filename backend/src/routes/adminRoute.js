const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');
const {
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
} = require('../controllers/adminController');

// Proteksi seluruh rute /api/admin/* khusus peran Admin
router.use(verifyToken);
router.use(checkRole(['Admin']));

// Summary & Logs
router.get('/dashboard/stats', getDashboardStats);
router.get('/logs', getLogs);

// Manajemen Admin
router.get('/users', getAdminUsers);
router.post('/users', createAdminUser);

// CRUD Kuliner & Resto Korea Halal
router.get('/kuliner', getKuliner);
router.post('/kuliner', createKuliner);
router.put('/kuliner/:id', updateKuliner);
router.delete('/kuliner/:id', deleteKuliner);
router.patch('/kuliner/:id/status', updateKulinerStatus);

// CRUD Edukasi (Artikel Sains Pangan & Syariat)
router.get('/edukasi', getEdukasi);
router.post('/edukasi', createEdukasi);
router.put('/edukasi/:id', updateEdukasi);
router.delete('/edukasi/:id', deleteEdukasi);

// CRUD Resep Halal
router.get('/resep', getResep);
router.post('/resep', createResep);
router.put('/resep/:id', updateResep);
router.delete('/resep/:id', deleteResep);

// CRUD Wisata Halal
router.get('/wisata', getWisata);
router.post('/wisata', createWisata);
router.put('/wisata/:id', updateWisata);
router.delete('/wisata/:id', deleteWisata);

// CRUD Media Podcast & Shorts
router.get('/media', getMedia);
router.post('/media', createMedia);
router.put('/media/:id', updateMedia);
router.delete('/media/:id', deleteMedia);

module.exports = router;

