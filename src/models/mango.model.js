const mongoose = require('mongoose');

const MangoSchema = new mongoose.Schema({
  classify: {
    type: String,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  volume: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Mango', MangoSchema);
