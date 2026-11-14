const express = require('express'); 
const router = express.Router(); 
const { login, getMe } = require('../controllers/authController'); 
const { verifyToken } = require('../middlewares/authMiddleware'); 

// Endpoint Login 
router.post('/login', login); 

// Endpoint Cek Profil / Status Sesi Sesuai JWT Token 
router.get('/me', verifyToken, getMe); 

module.exports = router;