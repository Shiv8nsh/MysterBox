const express = require('express');
const router = express.Router();
const Interrogation = require('../models/Interrogation');
const Result = require('../models/Result');
const Feedback = require('../models/Feedback');
const authMiddleware = require('../middleware/auth');
const { publicUser } = require('../utils/helpers');

// GET /api/profile
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const uid = req.auth.user.id;

    const [results, interrogations, feedbackList] = await Promise.all([
      Result.find({ userId: uid }).sort({ submittedAt: -1 }).lean(),
      Interrogation.find({ userId: uid }).sort({ askedAt: -1 }).lean(),
      Feedback.find({ userId: uid }).sort({ submittedAt: -1 }).lean()
    ]);

    const solvedCaseIds = new Set(
      results.filter(r => r.correct).map(r => r.caseId)
    );

    return res.json({
      user: publicUser(req.auth.user),
      stats: {
        accusations: results.length,
        casesSolved: solvedCaseIds.size,
        interrogations: interrogations.length,
        feedback: feedbackList.length
      },
      interrogations,
      results,
      feedback: feedbackList
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
