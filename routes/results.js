const express = require('express');
const router = express.Router();
const Result = require('../models/Result');
const authMiddleware = require('../middleware/auth');
const MysteryCases = require('../cases.js');
const { clean, newId } = require('../utils/helpers');

function getCase(caseId) {
  const c = MysteryCases.CASES[caseId];
  if (!c) {
    const err = new Error('Unknown case.');
    err.status = 400;
    err.details = { caseId: 'Unknown case.' };
    throw err;
  }
  return c;
}

// POST /api/results
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const body = req.body || {};
    const c = getCase(clean(body.caseId, 40));
    const accusedId = clean(body.accusedId, 40);
    const accused = c.suspects.find(s => s.id === accusedId);

    if (!accused) {
      return res.status(422).json({
        error: 'Choose a suspect to accuse.',
        fields: { accusedId: 'Choose a suspect.' }
      });
    }

    const proofIds = (Array.isArray(body.proofIds) ? body.proofIds : [])
      .map(p => clean(p, 60))
      .filter(id => c.evidence.some(e => e.id === id));

    const record = await Result.create({
      id: newId('res'),
      userId: req.auth.user.id,
      caseId: c.id,
      caseTitle: c.title,
      accusedId: accused.id,
      accusedName: accused.name,
      correct: accused.id === c.culpritId,
      proofIds,
      theory: clean(body.theory, 1000),
      timeTaken: clean(body.timeTaken, 10),
      accuracy: Math.max(0, Math.min(100, parseInt(body.accuracy, 10) || 0)),
      submittedAt: new Date().toISOString()
    });

    return res.status(201).json({ result: record });
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message, fields: err.details });
    }
    next(err);
  }
});

module.exports = router;
