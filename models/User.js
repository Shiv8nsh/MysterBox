const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 60
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: 120,
    index: true
  },
  passwordSalt: {
    type: String,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  createdAt: {
    type: String,
    default: () => new Date().toISOString()
  },
  lastLoginAt: {
    type: String,
    default: () => new Date().toISOString()
  },
  loginCount: {
    type: Number,
    default: 1
  }
}, {
  versionKey: false
});

module.exports = mongoose.model('User', userSchema);
