const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('http');
const mongoose = require('mongoose');
const { app } = require('../server');

let server;
let baseUrl;

test.before(async () => {
  await new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

test.after(async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  await mongoose.disconnect();
});

test('GET /api/health returns 200 with server status', async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.status, 'ok');
  assert.ok(data.database);
  assert.ok(data.timestamp);
});

test('POST /api/register with invalid data returns 422 with fields', async () => {
  const res = await fetch(`${baseUrl}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'bad-email' })
  });
  assert.equal(res.status, 422);
  const data = await res.json();
  assert.ok(data.error);
  assert.ok(data.fields.email);
  assert.ok(data.fields.name);
  assert.ok(data.fields.password);
});

test('POST /api/login with empty credentials returns 422', async () => {
  const res = await fetch(`${baseUrl}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
  assert.equal(res.status, 422);
  const data = await res.json();
  assert.ok(data.error);
  assert.ok(data.fields.email);
  assert.ok(data.fields.password);
});

test('GET /api/me without Bearer token returns 401', async () => {
  const res = await fetch(`${baseUrl}/api/me`);
  assert.equal(res.status, 401);
  const data = await res.json();
  assert.equal(data.error, 'Please sign in to continue.');
});

test('GET /api/interrogations without auth returns 401', async () => {
  const res = await fetch(`${baseUrl}/api/interrogations`);
  assert.equal(res.status, 401);
  const data = await res.json();
  assert.equal(data.error, 'Please sign in to continue.');
});

test('GET /api/unknown-endpoint returns 404', async () => {
  const res = await fetch(`${baseUrl}/api/unknown-endpoint`);
  assert.equal(res.status, 404);
  const data = await res.json();
  assert.equal(data.error, 'Unknown API endpoint.');
});

test('Security: blocked files return 404', async () => {
  const resEnv = await fetch(`${baseUrl}/.env`);
  assert.equal(resEnv.status, 404);

  const resServer = await fetch(`${baseUrl}/server.js`);
  assert.equal(resServer.status, 404);

  const resPkg = await fetch(`${baseUrl}/package.json`);
  assert.equal(resPkg.status, 404);
});

test('Static file serving: GET /index.html returns 200 HTML', async () => {
  const res = await fetch(`${baseUrl}/index.html`);
  assert.equal(res.status, 200);
  assert.match(res.headers.get('content-type'), /text\/html/);
  const text = await res.text();
  assert.ok(text.includes('MysteryBox'));
});
