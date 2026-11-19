const express = require('express');
const router = express.Router();
const Interrogation = require('../models/Interrogation');
const authMiddleware = require('../middleware/auth');
const MysteryCases = require('../cases.js');
const Interrogations = require('../interrogations.js');
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

// GET /api/interrogations
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const caseId = req.query.caseId ? clean(req.query.caseId, 40) : null;
    const filter = {
      userId: req.auth.user.id,
      archivedAt: null
    };
    if (caseId) {
      filter.caseId = caseId;
    }

    const sessions = await Interrogation.find(filter).lean();
    return res.json({
      limit: Interrogations.QUESTION_LIMIT,
      sessions
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/interrogations
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const body = req.body || {};
    const c = getCase(clean(body.caseId, 40));
    const suspect = c.suspects.find(s => s.id === clean(body.suspectId, 40));
    if (!suspect) {
      return res.status(400).json({ error: 'Unknown suspect.', fields: { suspectId: 'Unknown suspect.' } });
    }

    const bank = Interrogations.getQuestions(c.id, suspect.id);
    if (!bank) {
      return res.status(400).json({ error: 'This suspect cannot be questioned.' });
    }

    const ids = Array.isArray(body.questionIds) ? body.questionIds.map(q => clean(q, 80)) : [];
    const unique = ids.filter((id, i) => ids.indexOf(id) === i);

    if (unique.length !== Interrogations.QUESTION_LIMIT || unique.length !== ids.length) {
      return res.status(422).json({
        error: `Select exactly ${Interrogations.QUESTION_LIMIT} different questions.`,
        fields: { questionIds: `Select exactly ${Interrogations.QUESTION_LIMIT} questions.` }
      });
    }

    const chosen = unique.map(id => bank.find(q => q.id === id));
    if (chosen.some(q => !q)) {
      return res.status(422).json({
        error: 'One of the selected questions is not valid for this suspect.',
        fields: { questionIds: 'Invalid question.' }
      });
    }

    const already = await Interrogation.findOne({
      userId: req.auth.user.id,
      caseId: c.id,
      suspectId: suspect.id,
      archivedAt: null
    });

    if (already) {
      return res.status(409).json({
        error: `You have already interrogated ${suspect.name} for this case.`
      });
    }

    const session = await Interrogation.create({
      id: newId('int'),
      userId: req.auth.user.id,
      caseId: c.id,
      caseTitle: c.title,
      suspectId: suspect.id,
      suspectName: suspect.name,
      exchanges: chosen.map(q => ({
        questionId: q.id,
        question: q.question,
        answer: q.answer
      })),
      askedAt: new Date().toISOString()
    });

    return res.status(201).json({ session });
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message, fields: err.details });
    }
    next(err);
  }
});

// POST /api/interrogations/reset
router.post('/reset', authMiddleware, async (req, res, next) => {
  try {
    const body = req.body || {};
    const c = getCase(clean(body.caseId, 40));

    const result = await Interrogation.updateMany(
      {
        userId: req.auth.user.id,
        caseId: c.id,
        archivedAt: null
      },
      {
        $set: { archivedAt: new Date().toISOString() }
      }
    );

    return res.json({ archived: result.modifiedCount || 0 });
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message, fields: err.details });
    }
    next(err);
  }
});

module.exports = router;
