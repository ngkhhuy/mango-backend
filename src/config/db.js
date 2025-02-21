// src/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    
    const mongoURI = process.env.MONGO_URI;
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
