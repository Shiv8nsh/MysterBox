const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const authMiddleware = require('../middleware/auth');
const MysteryCases = require('../cases.js');
const { clean, newId, EMAIL_RE } = require('../utils/helpers');

const FEEDBACK_CATEGORIES = ['Bug report', 'Suggestion', 'Case review', 'Other'];

// POST /api/feedback
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const b = req.body || {};
    const errors = {};
    const name = clean(b.name, 60);
    const email = clean(b.email, 120).toLowerCase();
    const category = clean(b.category, 30);
    const message = clean(b.message, 600);
    const rating = parseInt(b.rating, 10);
    const caseId = clean(b.caseId, 40);

    if (name.length < 2) errors.name = 'Enter your name.';
    if (!EMAIL_RE.test(email)) errors.email = 'Enter a valid email address.';
    if (FEEDBACK_CATEGORIES.indexOf(category) === -1) errors.category = 'Choose a category.';
    if (!(rating >= 1 && rating <= 5)) errors.rating = 'Pick a rating from 1 to 5.';
    if (message.length < 10) errors.message = 'Message must be at least 10 characters.';
    if (caseId && !MysteryCases.CASES[caseId]) errors.caseId = 'Unknown case.';
    if (b.consent !== true) errors.consent = 'Please confirm you are happy for us to store this.';

    if (Object.keys(errors).length > 0) {
      return res.status(422).json({
        error: 'Please fix the highlighted fields.',
        fields: errors
      });
    }

    const record = await Feedback.create({
      id: newId('fb'),
      userId: req.auth.user.id,
      name,
      email,
      caseId: caseId || null,
      category,
      rating,
      message,
      submittedAt: new Date().toISOString()
    });

    return res.status(201).json({ feedback: record });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
