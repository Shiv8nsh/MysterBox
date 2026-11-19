const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const Session = require('../models/Session');
const authMiddleware = require('../middleware/auth');
const {
  clean,
  newId,
  EMAIL_RE,
  validateRegistration,
  hashPassword,
  verifyPassword,
  publicUser,
  tooManyFailures,
  recordFailure,
  clearFailure,
  createSession
} = require('../utils/helpers');

// POST /api/register
router.post('/register', async (req, res, next) => {
  try {
    const v = validateRegistration(req.body || {});
    if (Object.keys(v.errors).length > 0) {
      return res.status(422).json({
        error: 'Please fix the highlighted fields.',
        fields: v.errors
      });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        error: 'Database unavailable: MongoDB is not connected.',
        hint: 'Please start MongoDB locally or configure MONGODB_URI in .env.'
      });
    }

    const existing = await User.findOne({ email: v.email });
    if (existing) {
      return res.status(409).json({
        error: 'An account with this email already exists. Try signing in.',
        fields: { email: 'This email is already registered.' }
      });
    }

    const pw = hashPassword(v.password);
    const now = new Date().toISOString();
    const user = await User.create({
      id: newId('u'),
      name: v.name,
      email: v.email,
      passwordSalt: pw.salt,
      passwordHash: pw.hash,
      createdAt: now,
      lastLoginAt: now,
      loginCount: 1
    });

    const token = await createSession(user.id);
    return res.status(201).json({
      token,
      user: publicUser(user)
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/login
router.post('/login', async (req, res, next) => {
  try {
    const body = req.body || {};
    const email = clean(body.email, 120).toLowerCase();
    const password = String(body.password == null ? '' : body.password);
    const errors = {};

    if (!EMAIL_RE.test(email)) errors.email = 'Enter a valid email address.';
    if (!password) errors.password = 'Enter your password.';

    if (Object.keys(errors).length > 0) {
      return res.status(422).json({
        error: 'Please fix the highlighted fields.',
        fields: errors
      });
    }

    if (tooManyFailures(email)) {
      return res.status(429).json({
        error: 'Too many failed attempts. Please wait a few minutes and try again.'
      });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        error: 'Database unavailable: MongoDB is not connected.',
        hint: 'Please start MongoDB locally or configure MONGODB_URI in .env.'
      });
    }

    const user = await User.findOne({ email });
    const ok = user
      ? verifyPassword(password, user.passwordSalt, user.passwordHash)
      : (hashPassword(password), false);

    if (!ok) {
      recordFailure(email);
      return res.status(401).json({
        error: 'Incorrect email or password.',
        fields: { password: 'Incorrect email or password.' }
      });
    }

    clearFailure(email);
    user.lastLoginAt = new Date().toISOString();
    user.loginCount = (user.loginCount || 0) + 1;
    await user.save();

    const token = await createSession(user.id);
    return res.json({
      token,
      user: publicUser(user)
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/logout
router.post('/logout', authMiddleware, async (req, res, next) => {
  try {
    await Session.deleteOne({ tokenHash: req.auth.tokenHash });
    return res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// GET /api/me
router.get('/me', authMiddleware, async (req, res) => {
  return res.json({ user: publicUser(req.auth.user) });
});

module.exports = router;
