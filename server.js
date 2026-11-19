/**
 * ============================================================================
 * MYSTERBOX EXPRESS SERVER + MONGODB & POSTMAN READY
 * ============================================================================
 *  - Express.js API + Static File Server on http://localhost:3000
 *  - MongoDB integration via Mongoose (Users, Sessions, Interrogations, Results, Feedback)
 *  - Full Postman Collection & Environment support
 *  - Backward compatible with existing detective workstation frontend
 *
 *  Run:  node server.js     (or: npm start)
 */
'use strict';

require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');

const { connectDB, getDBStatus } = require('./config/db');

// Route modules
const authRoutes = require('./routes/auth');
const interrogationRoutes = require('./routes/interrogations');
const resultRoutes = require('./routes/results');
const feedbackRoutes = require('./routes/feedback');
const profileRoutes = require('./routes/profile');

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 3000;
const ROOT = __dirname;

// ---------------------------------------------------------------------------
// Database Connection
// ---------------------------------------------------------------------------
connectDB();

// ---------------------------------------------------------------------------
// Core Middleware
// ---------------------------------------------------------------------------
app.use(cors());
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true }));

// ---------------------------------------------------------------------------
// API Routes
// ---------------------------------------------------------------------------

// Health check endpoint for Postman & monitoring
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    database: getDBStatus(),
    timestamp: new Date().toISOString()
  });
});

// Mounted API sub-routers
app.use('/api', authRoutes);
app.use('/api/interrogations', interrogationRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/profile', profileRoutes);

// Catch-all for undefined API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Unknown API endpoint.' });
});

// ---------------------------------------------------------------------------
// Static File Protection & Serving
// ---------------------------------------------------------------------------
const BLOCKED_NAMES = new Set([
  'server.js',
  'package.json',
  'package-lock.json',
  '.env',
  '.env.example',
  '.gitignore',
  'readme.md'
]);

const BLOCKED_DIRS = new Set([
  'config',
  'middleware',
  'models',
  'routes',
  'utils',
  'scripts',
  'data',
  'node_modules'
]);

// Block direct access to server-side code and data directories
app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return next();
  }

  let pathname;
  try {
    pathname = decodeURIComponent(req.path);
  } catch (e) {
    return res.status(400).json({ error: 'Bad request.' });
  }

  const parts = pathname.replace(/^\/+/, '').split('/');
  const baseName = parts[parts.length - 1].toLowerCase();
  const topDir = parts[0].toLowerCase();

  if (BLOCKED_NAMES.has(baseName) || BLOCKED_DIRS.has(topDir) || baseName.startsWith('.')) {
    return res.status(404).json({ error: 'Not found.' });
  }

  next();
});

// Serve frontend static assets
app.use(express.static(ROOT, {
  index: 'index.html',
  dotfiles: 'ignore',
  setHeaders: (res, filePath) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'no-cache');
  }
}));

// Fallback for missing static pages
app.use((req, res) => {
  res.status(404).sendFile(path.join(ROOT, 'index.html'));
});

// ---------------------------------------------------------------------------
// Global Error Handler
// ---------------------------------------------------------------------------
app.use((err, req, res, next) => {
  // Handle JSON parse errors from express.json()
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Request body must be a JSON object.' });
  }

  // Handle custom status errors
  if (err.status) {
    return res.status(err.status).json({
      error: err.message,
      fields: err.details || undefined
    });
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    return res.status(422).json({
      error: err.message,
      fields: err.errors
    });
  }

  console.error('Unhandled Server Error:', err);
  return res.status(500).json({ error: 'Something went wrong on the server.' });
});

// ---------------------------------------------------------------------------
// Start Server
// ---------------------------------------------------------------------------
let server = null;
if (require.main === module) {
  server = app.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('  =======================================================');
    console.log('  🔍 MysteryBox Detective Workstation (Express + MongoDB)');
    console.log('  =======================================================');
    console.log(`  Local Website & API :  http://localhost:${PORT}`);
    console.log(`  API Health Check    :  http://localhost:${PORT}/api/health`);
    console.log(`  Postman Ready       :  MysteryBox.postman_collection.json`);
    console.log('  =======================================================');
    console.log('  (Press Ctrl+C to stop)\n');
  });
}

module.exports = { app, server };
