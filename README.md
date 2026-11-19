# MysteryBox - Detective Puzzle Workstation

Detective puzzle workstation running on **Express.js** with **MongoDB** persistence and full **Postman** collection support.

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (`.env`)
Create or edit `.env` in the root directory:
```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/mysterybox
```
*(For MongoDB Atlas cloud database, paste your `mongodb+srv://...` connection string).*

### 3. Start the Server
```bash
npm start
```
Open **http://localhost:3000** in your browser.

---

## 📬 Postman Testing

A ready-to-use Postman Collection and Environment are included in the repository:
- `MysteryBox.postman_collection.json`
- `MysteryBox.postman_environment.json`

### How to use:
1. Open **Postman** and click **Import** (top left).
2. Select both `MysteryBox.postman_collection.json` and `MysteryBox.postman_environment.json`.
3. In the environment dropdown (top right), select **MysteryBox Local**.
4. Run `POST /api/register` or `POST /api/login`.
   - The test script **automatically saves the authentication token** to the environment.
   - All subsequent requests (`/api/me`, `/api/interrogations`, `/api/results`, `/api/feedback`, `/api/profile`) automatically use `Bearer {{token}}`.

See [POSTMAN_GUIDE.md](file:///c:/Users/Lenovo/Downloads/MysterBox-main/POSTMAN_GUIDE.md) for detailed step-by-step instructions.

---

## 🗄️ Database & Models (MongoDB)

All application data is modeled with **Mongoose**:
- **User** (`models/User.js`): User accounts, hashed passwords (scrypt), salt, login counts.
- **Session** (`models/Session.js`): Active sessions with SHA-256 token hashes and automatic MongoDB TTL expiration.
- **Interrogation** (`models/Interrogation.js`): Suspect questioning transcripts and archives.
- **Result** (`models/Result.js`): Detective accusations, proof IDs, theories, and accuracy scoring.
- **Feedback** (`models/Feedback.js`): Detective feedback, ratings, and categories.

### Migrating Legacy JSON Data to MongoDB
If you have data from previous runs stored in `./data/*.json`, you can import it into MongoDB:
```bash
npm run migrate
```

---

## 🧪 Testing

Run the automated test suite (uses Node's native test runner):
```bash
npm test
```

---

## 📁 Project Architecture

- `server.js` - Express application entrypoint, middleware, and static asset protection
- `config/db.js` - MongoDB connection management with Mongoose
- `models/` - Mongoose schemas for User, Session, Interrogation, Result, and Feedback
- `routes/` - Express modular routers for auth, interrogations, results, feedback, and profile
- `middleware/auth.js` - Bearer token authentication middleware
- `utils/helpers.js` - Password hashing (scrypt), ID generation, input validation
- `scripts/migrate-json-to-mongo.js` - JSON to MongoDB migration tool
- `MysteryBox.postman_collection.json` - Complete Postman API collection
- `MysteryBox.postman_environment.json` - Postman environment variables
