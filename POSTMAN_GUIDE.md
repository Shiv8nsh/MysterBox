# MysteryBox Postman & Express API Guide

This guide walks you through connecting and testing the **MysteryBox Express API** with **MongoDB** and **Postman**.

---

## 🚀 Quick Start in 3 Steps

### Step 1: Start the Server
Make sure dependencies are installed and start the server:
```bash
npm start
```
The server will boot on `http://localhost:3000`.

### Step 2: Import into Postman
1. Open **Postman**.
2. Click the **Import** button (top left).
3. Drag & drop or select both files from your project root:
   - `MysteryBox.postman_collection.json` (the API endpoints)
   - `MysteryBox.postman_environment.json` (the environment variables)
4. In the top-right corner of Postman, select the environment: **MysteryBox Local**.

---

## 🔑 Automated Token Authentication

When you run **Register User** or **Login User**, the Postman test script automatically extracts the bearer token:
```javascript
var jsonData = pm.response.json();
if (jsonData.token) {
    pm.environment.set("token", jsonData.token);
}
```
All subsequent authenticated endpoints (`/api/me`, `/api/interrogations`, `/api/results`, `/api/feedback`, `/api/profile`) automatically use `Bearer {{token}}` from the environment without manual copy-pasting!

---

## 📋 API Endpoints Map

| Folder | Method | Endpoint | Description | Auth Required |
|---|---|---|---|---|
| **0. Health & Diagnostics** | `GET` | `/api/health` | Server uptime & MongoDB connection status | No |
| **1. Authentication** | `POST` | `/api/register` | Create detective account | No |
| | `POST` | `/api/login` | Sign in & receive session token | No |
| | `GET` | `/api/me` | Fetch currently logged-in user | Yes (`Bearer {{token}}`) |
| | `POST` | `/api/logout` | Terminate active session | Yes (`Bearer {{token}}`) |
| **2. Interrogations** | `GET` | `/api/interrogations?caseId=case1` | Get suspect Q&A logs | Yes |
| | `POST` | `/api/interrogations` | Ask 2 questions to a suspect | Yes |
| | `POST` | `/api/interrogations/reset` | Archive & reset interrogation logs | Yes |
| **3. Accusations & Results** | `POST` | `/api/results` | Submit verdict, clues, & theory | Yes |
| **4. Feedback** | `POST` | `/api/feedback` | Submit case rating & feedback | Yes |
| **5. Profile & Stats** | `GET` | `/api/profile` | View detective stats & history | Yes |

---

## 🧪 Recommended Postman Testing Sequence

1. **Health Check**:
   - Run `GET /api/health` to confirm the server is up and see MongoDB status.
2. **Register or Login**:
   - Run `POST /api/register` or `POST /api/login`.
   - Verify status `201` or `200`. The `{{token}}` variable is automatically saved.
3. **Get Current User**:
   - Run `GET /api/me`. You will see your user profile returned.
4. **Interrogate Suspect**:
   - Run `POST /api/interrogations` with 2 question IDs (`case1_victor_q1` and `case1_victor_q2`).
   - Run `GET /api/interrogations?caseId=case1` to view the stored transcripts.
5. **Submit Accusation**:
   - Run `POST /api/results` with your suspect, evidence IDs, and theory.
6. **Submit Feedback**:
   - Run `POST /api/feedback` to submit your review.
7. **Check Profile**:
   - Run `GET /api/profile` to see solved cases count, verdict records, and stats.

---

## 🗄️ MongoDB Configuration

The database connection is managed via `.env`:
```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/mysterybox
```

### Local MongoDB
If running locally:
```bash
# Windows service
net start MongoDB
# Or run standalone daemon
mongod
```

### MongoDB Atlas (Cloud)
To connect to a free MongoDB Atlas cloud cluster:
1. Copy your connection string from MongoDB Atlas.
2. In `.env`, set:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/mysterybox?retryWrites=true&w=majority
   ```
3. Restart the server (`npm start`).
