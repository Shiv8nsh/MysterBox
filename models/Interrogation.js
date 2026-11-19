const mongoose = require('mongoose');

const interrogationExchangeSchema = new mongoose.Schema({
  questionId: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true }
}, { _id: false });

const interrogationSchema = new mongoose.Schema({
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
  suspectId: {
    type: String,
    required: true
  },
  suspectName: {
    type: String,
    required: true
  },
  exchanges: [interrogationExchangeSchema],
  askedAt: {
    type: String,
    default: () => new Date().toISOString()
  },
  archivedAt: {
    type: String,
    default: null
  }
}, {
  versionKey: false
});

module.exports = mongoose.model('Interrogation', interrogationSchema);
