const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
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
  caseId: {
    type: String,
    required: true,
    index: true
  },
  caseTitle: {
    type: String,
    required: true
  },
  accusedId: {
    type: String,
    required: true
  },
  accusedName: {
    type: String,
    required: true
  },
  correct: {
    type: Boolean,
    required: true
  },
  proofIds: [{
    type: String
  }],
  theory: {
    type: String,
    default: ''
  },
  timeTaken: {
    type: String,
    default: ''
  },
  accuracy: {
    type: Number,
    default: 0
  },
  submittedAt: {
    type: String,
    default: () => new Date().toISOString()
  }
}, {
  versionKey: false
});

module.exports = mongoose.model('Result', resultSchema);
