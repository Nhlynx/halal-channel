const express = require('express'); 
const cors = require('cors'); 
const dotenv = require('dotenv'); 
const authRoute = require('./src/routes/authRoute'); 
const adminRoute = require('./src/routes/adminRoute');
const publicRoute = require('./src/routes/publicRoute');

dotenv.config(); 

const app = express(); 
const PORT = process.env.PORT || 5000; 

// Middleware Global 
app.use(cors()); 
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Registrasi Route API
app.use('/api/auth', authRoute);
app.use('/api/admin', adminRoute);
app.use('/api', publicRoute);  // publik: /api/search, /api/public/*

// Test Endpoint Root 
app.get('/', (req, res) => { 
  res.json({ 
    message: 'API Halal Channel siap digunakan.' 
  }); 
}); 

// Jalankan Server 
app.listen(PORT, () => { 
  console.log(`Server Backend berjalan di http://localhost:${PORT}`); 
});
