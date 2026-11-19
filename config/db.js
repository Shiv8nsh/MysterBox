const dns = require('dns');
const mongoose = require('mongoose');

// Configure reliable DNS servers (Google + Cloudflare) to prevent querySrv ECONNREFUSED on restricted Wi-Fi/ISPs
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mysterybox';

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000 // fail fast if server isn't running so helpful guide is shown
    });
    isConnected = true;
    console.log(`\n  MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (err) {
    isConnected = false;
    console.error('\n  [MongoDB Connection Warning]');
    console.error(`  Could not connect to MongoDB at: ${MONGODB_URI}`);
    console.error(`  Error: ${err.message}`);
    console.error('\n  To connect MongoDB:');
    console.error('  1. If using local MongoDB: ensure the MongoDB service is running (`net start MongoDB` or `mongod`)');
    console.error('  2. If using MongoDB Atlas: add your connection string to `.env`:');
    console.error('     MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/mysterybox?retryWrites=true&w=majority\n');
  }
}

function getDBStatus() {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  return {
    state: states[mongoose.connection.readyState] || 'unknown',
    host: mongoose.connection.host || null,
    name: mongoose.connection.name || null,
    uri: MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@') // mask password in logs
  };
}

function isDBConnected() {
  return mongoose.connection.readyState === 1;
}

module.exports = {
  connectDB,
  getDBStatus,
  isDBConnected
};
