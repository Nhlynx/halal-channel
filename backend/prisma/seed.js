const { PrismaClient } = require('@prisma/client'); 
const bcrypt = require('bcryptjs'); 

const prisma = new PrismaClient(); 

async function main() { 
	console.log('Mulai mengisi data awal (seeding)...'); 

// 1. Cek atau Buat Role Admin 
let roleAdmin = await prisma.role.findFirst({ 
where: { namaRole: 'Admin' }, 
}); 

if (!roleAdmin) { 
roleAdmin = await prisma.role.create({ 
 data: { 
	namaRole: 'Admin', 
	deskripsi: 'Pengelola penuh sistem Halal Channel', 
	}, 
      }); 
}

// Cek atau Buat Role User 
let roleUser = await prisma.role.findFirst({ 
where: { namaRole: 'User' }, 
}); 

if (!roleUser) { 
roleUser = await prisma.role.create({ 
 data: { 
	namaRole: 'User', 
	deskripsi: 'Pengunjung umum platform', 
	}, 
      }); 
}

// 2. Buat Akun Admin Pertama (email bersifat @unique) 
const hashedPassword = await bcrypt.hash('admin123', 10); 
await prisma.user.upsert({ 
	where: { email: 'admin@rpnn.depok.go.id' }, 
	update: {}, 
	create: { 
	namaLengkap: 'Admin Halal Channel', 
	email: 'admin@rpnn.depok.go.id', 
	password: hashedPassword, 
	roleId: roleAdmin.id, 
	}, 
       }); 

// 3. Buat Akun User 
const hashedPasswordUser = await bcrypt.hash('user123', 10); 
await prisma.user.upsert({ 
	where: { email: 'user@halalchannel.id' }, 
	update: {}, 
	create: { 
	namaLengkap: 'User Halal Channel', 
	email: 'user@halalchannel.id', 
	password: hashedPasswordUser, 
	roleId: roleUser.id, 
	}, 
       }); 

console.log('Seeding selesai! Role, Akun Admin, dan Akun User berhasil dibuat.'); 
} 
main() 
.catch((e) => { 
	console.error(e); 
	process.exit(1); 
}) 
.finally(async () => { 
await prisma.$disconnect(); 
});