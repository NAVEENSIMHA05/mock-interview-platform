const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['candidate', 'hr', 'admin'],
    required: true
  },
  company: {
    type: String,
    default: null // Only filled if role equals 'hr'
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);