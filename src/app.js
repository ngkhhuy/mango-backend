const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const axios = require('axios');


dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://khanhhuy.space'],
  credentials: true
}));
app.use(express.json());


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

  // Hàm ping website
async function pingWebsite() {
  try {
    const response = await axios.get('https://mango-backend-q7bx.onrender.com/api/mangoes');
    console.log('Ping successful:', response.status);
  } catch (error) {
    console.error('Ping failed:', error.message);
  }
}

// Chạy ping mỗi 10 giây
setInterval(pingWebsite, 9000);


app.use('/api/mangoes', require('./routes/mango.route'));
app.use('/api/auth', require('./routes/auth.route'));

// Route mặc định
app.get('/', (req, res) => {
  res.send('API is running');
});

module.exports = app;
