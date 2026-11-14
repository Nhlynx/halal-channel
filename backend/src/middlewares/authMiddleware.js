const jwt = require('jsonwebtoken'); 
// Middleware untuk memverifikasi JWT Token dari Request Header 
const verifyToken = (req, res, next) => { 
const authHeader = req.headers['authorization']; const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

if (!token) { 
 return res.status(401).json({ 
	success: false, 
	message: 'Akses ditolak. Token autentikasi tidak ditemukan.', 
 }); 
}

try { 
 const secretKey = process.env.JWT_SECRET || 'secret_key_rpnn_halal_2026'; 
 const decoded = jwt.verify(token, secretKey); 
 req.user = decoded; 
 next(); 
 } catch (error) { 
  return res.status(401).json({ 
   success: false, 
   message: 'Token tidak valid atau telah kedaluwarsa.', 
  }); 
 } 
};

// Middleware untuk membatasi akses berdasarkan Role (misal: Admin saja) 
const checkRole = (allowedRoles) => { 
 return (req, res, next) => { 
  if (!req.user || !allowedRoles.includes(req.user.roleName)) { 
   return res.status(403).json({ 
    success: false, 
    message: 'Akses ditolak. Anda tidak memiliki izin untuk mengakses resource ini.', 
   }); 
  } next(); 
 }; 
};

module.exports = { verifyToken, checkRole };