const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  tokenHash: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  createdAt: {
    type: String,
    default: () => new Date().toISOString()
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 } // MongoDB TTL index to auto-remove expired sessions
  }
}, {
  versionKey: false
});

module.exports = mongoose.model('Session', sessionSchema);
