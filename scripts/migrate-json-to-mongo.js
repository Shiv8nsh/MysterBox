/**
 * JSON to MongoDB Migration Script
 * Imports any existing data from ./data/*.json into MongoDB collections.
 * Run with: node scripts/migrate-json-to-mongo.js
 */
'use strict';

require('dotenv').config();
const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch (e) {}

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const User = require('../models/User');
const Session = require('../models/Session');
const Interrogation = require('../models/Interrogation');
const Result = require('../models/Result');
const Feedback = require('../models/Feedback');

const DATA_DIR = process.env.MB_DATA_DIR ? path.resolve(process.env.MB_DATA_DIR) : path.join(__dirname, '..', 'data');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mysterybox';

function loadJson(filename) {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) return [];
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8') || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn(`Could not parse ${filename}: ${e.message}`);
    return [];
  }
}

async function migrate() {
  console.log(`\nConnecting to MongoDB: ${MONGODB_URI}`);
  await mongoose.connect(MONGODB_URI);
  console.log('Connected! Starting migration from local JSON...\n');

  // 1. Users
  const users = loadJson('users.json');
  let userCount = 0;
  for (const u of users) {
    if (u.id && u.email) {
      await User.updateOne({ id: u.id }, { $set: u }, { upsert: true });
      userCount++;
    }
  }
  console.log(`✓ Migrated users: ${userCount}`);

  // 2. Sessions
  const sessions = loadJson('sessions.json');
  let sessionCount = 0;
  for (const s of sessions) {
    if (s.tokenHash && s.expiresAt && s.expiresAt > Date.now()) {
      await Session.updateOne(
        { tokenHash: s.tokenHash },
        {
          $set: {
            tokenHash: s.tokenHash,
            userId: s.userId,
            createdAt: s.createdAt || new Date().toISOString(),
            expiresAt: new Date(s.expiresAt)
          }
        },
        { upsert: true }
      );
      sessionCount++;
    }
  }
  console.log(`✓ Migrated active sessions: ${sessionCount}`);

  // 3. Interrogations
  const interrogations = loadJson('interrogations.json');
  let intCount = 0;
  for (const i of interrogations) {
    if (i.id) {
      await Interrogation.updateOne({ id: i.id }, { $set: i }, { upsert: true });
      intCount++;
    }
  }
  console.log(`✓ Migrated interrogations: ${intCount}`);

  // 4. Results
  const results = loadJson('results.json');
  let resCount = 0;
  for (const r of results) {
    if (r.id) {
      await Result.updateOne({ id: r.id }, { $set: r }, { upsert: true });
      resCount++;
    }
  }
  console.log(`✓ Migrated results: ${resCount}`);

  // 5. Feedback
  const feedback = loadJson('feedback.json');
  let fbCount = 0;
  for (const f of feedback) {
    if (f.id) {
      await Feedback.updateOne({ id: f.id }, { $set: f }, { upsert: true });
      fbCount++;
    }
  }
  console.log(`✓ Migrated feedback: ${fbCount}`);

  console.log('\nMigration completed successfully!');
  await mongoose.disconnect();
}

migrate().catch(err => {
  console.error('\nMigration failed:', err.message);
  process.exit(1);
});
