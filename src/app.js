const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const axios = require('axios');
const cors = require('cors');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Cấu hình CORS chi tiết hơn
app.use(cors({
  origin: ['https://www.khanhhuy.space', 'http://localhost:3000'], // Các domain được phép
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Hàm ping website
async function pingWebsite() {
  try {
    const response = await axios.get('https://mango-backend-ub33.onrender.com/api/mangoes');
    console.log('Ping successful:', response.status);
  } catch (error) {
    console.error('Ping failed:', error.message);
  }
}

// Chạy ping mỗi 10 giây
setInterval(pingWebsite, 60000);

// Routes
app.use('/api/mangoes', require('./routes/mango.route'));
app.use('/api/auth', require('./routes/auth.route'));

// Route mặc định
app.get('/', (req, res) => {
  res.send('API is running');
});

module.exports = app;
