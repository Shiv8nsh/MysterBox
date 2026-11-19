const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  id: {
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
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  caseId: {
    type: String,
    default: null
  },
  category: {
    type: String,
    required: true,
    enum: ['Bug report', 'Suggestion', 'Case review', 'Other']
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  message: {
    type: String,
    required: true,
    minlength: 10
  },
  submittedAt: {
    type: String,
    default: () => new Date().toISOString()
  }
}, {
  versionKey: false
});

module.exports = mongoose.model('Feedback', feedbackSchema);
