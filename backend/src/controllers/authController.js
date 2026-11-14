const prisma = require('../config/db'); 
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 

// POST /api/auth/login 
const login = async (req, res) => { 
 try { 
 const { email, password } = req.body; 

// 1. Validasi Kelengkapan Body Input (400 Bad Request) 
if (!email || !password) { 
 return res.status(400).json({ 
  success: false, 
  message: 'Email dan password wajib diisi.', 
 }); 
}

// 2. Cari User di Database beserta Relasi Role (Prisma ORM) 
const user = await prisma.user.findUnique({ 
 where: { email: email.trim() }, 
 include: { 
  role: true, 
 }, 
});

// 3. Jika Email Tidak Ditemukan (401 Unauthorized) 
if (!user) { 
 return res.status(401).json({ 
  success: false, 
  message: 'Kredensial tidak valid. Cek email atau password Anda.', 
 }); 
}

// 4. Verifikasi Hashing Password dengan bcrypt (401 Unauthorized) 
const isPasswordValid = await bcrypt.compare(password, user.password); 
if (!isPasswordValid) { 
 return res.status(401).json({ 
  success: false, 
  message: 'Kredensial tidak valid. Cek email atau password Anda.', 
 }); 
}

// 5. Terbitkan Token JWT (Masa berlaku 1 hari) 
const secretKey = process.env.JWT_SECRET || 'secret_key_rpnn_halal_2026'; 
const token = jwt.sign( 
 { 
  id: user.id, 
  email: user.email, 
  roleId: user.roleId, 
  roleName: user.role.namaRole, 
 }, 
 secretKey, 
 { expiresIn: '1d' } 
);

// 6. Respon Berhasil 200 OK (Sesuai Kontrak API SOT) 
return res.status(200).json({ 
 success: true, 
 message: 'Login berhasil', 
 data: { 
  token, 
  user: { 
   id: user.id, 
   namaLengkap: user.namaLengkap, 
   email: user.email, 
   fotoProfil: user.fotoProfil, 
   role: { 
    id: user.role.id, 
    namaRole: user.role.namaRole, 
   }, 
  }, 
 }, 
}); 
} catch (error) { 
 console.error('Error pada authController.login:', error); 
 return res.status(500).json({ 
  success: false, 
  message: 'Terjadi kesalahan pada server saat memproses login.', 
 }); 
} 
};

// GET /api/auth/me (Mendapatkan Data Profil Pengguna Aktif) 
const getMe = async (req, res) => { 
 try { 
  const userId = req.user.id; 
  const user = await prisma.user.findUnique({ 
   where: { id: userId }, 
   select: { 
    id: true, 
    namaLengkap: true, 
    email: true, 
    fotoProfil: true, 
    role: { 
     select: { 
      id: true, 
      namaRole: true, 
      }, 
    }, 
   }, 
 });

 if (!user) { 
  return res.status(404).json({ 
   success: false, 
   message: 'Pengguna tidak ditemukan.', 
  }); 
 } 

 return res.status(200).json({ 
  success: true, 
  message: 'Data profil berhasil diambil.', 
  data: user, 
 }); 
 
 } catch (error) { 
  console.error('Error pada authController.getMe:', error); 
  return res.status(500).json({ 
   success: false, 
   message: 'Terjadi kesalahan server saat mengambil data profil.', 
  }); 
 } 
};

module.exports = { 
 login, 
 getMe, 
};