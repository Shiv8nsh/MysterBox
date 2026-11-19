const mongoose = require('mongoose');
const Session = require('../models/Session');
const User = require('../models/User');
const { sha256 } = require('../utils/helpers');

async function authMiddleware(req, res, next) {
  const header = req.headers['authorization'] || '';
  const m = /^Bearer\s+([a-f0-9]{64})$/i.exec(header);
  if (!m) {
    return res.status(401).json({ error: 'Please sign in to continue.' });
  }

  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      error: 'Database unavailable: MongoDB is not connected.',
      hint: 'Please start MongoDB locally or configure MONGODB_URI in .env.'
    });
  }

  const tokenHash = sha256(m[1]);
  try {
    const session = await Session.findOne({
      tokenHash,
      expiresAt: { $gt: new Date() }
    });

    if (!session) {
      return res.status(401).json({ error: 'Please sign in to continue.' });
    }

    const user = await User.findOne({ id: session.userId });
    if (!user) {
      return res.status(401).json({ error: 'Please sign in to continue.' });
    }

    req.auth = { user, tokenHash, session };
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = authMiddleware;
