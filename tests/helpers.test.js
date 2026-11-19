const test = require('node:test');
const assert = require('node:assert/strict');
const {
  clean,
  newId,
  sha256,
  hashPassword,
  verifyPassword,
  publicUser,
  validateRegistration,
  tooManyFailures,
  recordFailure,
  clearFailure
} = require('../utils/helpers');

test('clean() sanitizes and limits string length', () => {
  assert.equal(clean('  hello world  ', 10), 'hello worl');
  assert.equal(clean(null), '');
  assert.equal(clean('test\u0000control'), 'testcontrol');
});

test('newId() generates unique id with prefix', () => {
  const id1 = newId('user');
  const id2 = newId('user');
  assert.match(id1, /^user_[0-9a-f]{12}$/);
  assert.notEqual(id1, id2);
});

test('hashPassword() and verifyPassword() work correctly', () => {
  const password = 'SuperSecret123';
  const { salt, hash } = hashPassword(password);
  assert.ok(salt);
  assert.ok(hash);

  assert.equal(verifyPassword(password, salt, hash), true);
  assert.equal(verifyPassword('WrongPassword', salt, hash), false);
});

test('validateRegistration() validates required fields correctly', () => {
  const invalid = validateRegistration({});
  assert.ok(invalid.errors.name);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.password);

  const valid = validateRegistration({
    name: 'Detective Holmes',
    email: 'holmes@bakerstreet.com',
    password: 'Password123'
  });
  assert.equal(Object.keys(valid.errors).length, 0);
  assert.equal(valid.name, 'Detective Holmes');
  assert.equal(valid.email, 'holmes@bakerstreet.com');
});

test('publicUser() strips sensitive password fields', () => {
  const u = {
    id: 'u_123',
    name: 'Sherlock',
    email: 'sherlock@example.com',
    passwordSalt: 'salt123',
    passwordHash: 'hash123',
    createdAt: '2026-01-01T00:00:00.000Z',
    lastLoginAt: '2026-01-01T00:00:00.000Z',
    loginCount: 5
  };

  const pub = publicUser(u);
  assert.equal(pub.id, 'u_123');
  assert.equal(pub.name, 'Sherlock');
  assert.equal(pub.email, 'sherlock@example.com');
  assert.equal(pub.passwordSalt, undefined);
  assert.equal(pub.passwordHash, undefined);
});

test('tooManyFailures() limits brute force attempts', () => {
  const email = 'brute@example.com';
  clearFailure(email);
  assert.equal(tooManyFailures(email), false);

  for (let i = 0; i < 5; i++) {
    recordFailure(email);
  }
  assert.equal(tooManyFailures(email), true);

  clearFailure(email);
  assert.equal(tooManyFailures(email), false);
});
