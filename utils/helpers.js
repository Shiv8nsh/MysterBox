const crypto = require('crypto');

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function clean(value, max) {
  return String(value == null ? '' : value)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .trim()
    .slice(0, max || 500);
}

function newId(prefix) {
  return prefix + '_' + crypto.randomBytes(6).toString('hex');
}

function sha256(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

function hashPassword(password, salt) {
  salt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { salt, hash };
}

function verifyPassword(password, salt, hash) {
  const test = crypto.scryptSync(password, salt, 64);
  const known = Buffer.from(hash, 'hex');
  return test.length === known.length && crypto.timingSafeEqual(test, known);
}

function publicUser(u) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    createdAt: u.createdAt,
    lastLoginAt: u.lastLoginAt,
    loginCount: u.loginCount
  };
}

function validateRegistration(b) {
  const errors = {};
  const name = clean(b.name, 60);
  const email = clean(b.email, 120).toLowerCase();
  const password = String(b.password == null ? '' : b.password);

  if (name.length < 2) errors.name = 'Enter your name (at least 2 characters).';
  if (!EMAIL_RE.test(email)) errors.email = 'Enter a valid email address.';
  if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    errors.password = 'Password needs 8+ characters with at least one letter and one number.';
  }
  return { errors, name, email, password };
}

// Basic brute-force protection: 5 failed logins per email per 5 minutes.
const failedLogins = new Map();

function tooManyFailures(email) {
  const rec = failedLogins.get(email);
  if (!rec) return false;
  if (Date.now() - rec.first > 5 * 60 * 1000) {
    failedLogins.delete(email);
    return false;
  }
  return rec.count >= 5;
}

function recordFailure(email) {
  const rec = failedLogins.get(email);
  if (!rec || Date.now() - rec.first > 5 * 60 * 1000) {
    failedLogins.set(email, { count: 1, first: Date.now() });
  } else {
    rec.count++;
  }
}

function clearFailure(email) {
  failedLogins.delete(email);
}

const Session = require('../models/Session');

async function createSession(userId) {
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = sha256(token);
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await Session.create({
    tokenHash,
    userId,
    createdAt: new Date().toISOString(),
    expiresAt
  });

  return token;
}

module.exports = {
  SESSION_TTL_MS,
  EMAIL_RE,
  clean,
  newId,
  sha256,
  hashPassword,
  verifyPassword,
  publicUser,
  validateRegistration,
  tooManyFailures,
  recordFailure,
  clearFailure,
  createSession
};
