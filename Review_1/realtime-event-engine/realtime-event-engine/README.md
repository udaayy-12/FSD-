# ⚡ Real-Time Event Synchronization Engine

A full-stack real-time event system where multiple clients connect and instantly receive updates using **Socket.IO**, **React**, **Node.js**, and **MongoDB**.

---

## 🚀 Features

- **User Authentication** — Register & login with JWT tokens
- **Real-time Broadcasting** — Socket.IO pushes event changes to all connected clients instantly
- **Full CRUD Events** — Create, update, delete events with type, priority, and status
- **Live Dashboard** — Auto-updating event list with live user count
- **Toast Notifications** — Real-time in-app notifications for all actions
- **Filter & Stats** — Filter events by type; live stats bar

---

## 🗂️ Project Structure

```
realtime-event-engine/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # Auth & Notification context
│   │   ├── hooks/           # useEvents custom hook
│   │   ├── pages/           # Login, Register, Dashboard
│   │   └── utils/           # Axios + Socket.IO setup
│   └── ...
├── server/                  # Node.js + Express backend
│   ├── controllers/         # Route handlers
│   ├── middleware/          # JWT auth middleware
│   ├── models/              # Mongoose schemas
│   ├── routes/              # Express routes
│   └── index.js             # Entry point
└── README.md
```

---

## ⚙️ Prerequisites

- **Node.js** v18+ and npm
- **MongoDB** running locally on port `27017`
  - Install: https://www.mongodb.com/try/download/community
  - Or use MongoDB Atlas (cloud) — update `MONGO_URI` in `.env`

---

## 🛠️ Setup Instructions

### 1. Clone or extract the project

```bash
cd realtime-event-engine
```

---

### 2. Backend Setup

```bash
cd server
npm install
```

**Configure environment variables** — edit `server/.env`:

```env
MONGO_URI=mongodb://localhost:27017/realtime-event-engine
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
CLIENT_URL=http://localhost:5173
```

**Start the server:**

```bash
npm start
# or for development with auto-reload:
npm run dev
```

Server runs at: `http://localhost:5000`

---

### 3. Frontend Setup

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

Client runs at: `http://localhost:5173`

---

## 🔌 API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login, get JWT |
| GET | `/api/auth/me` | ✅ | Get current user |
| GET | `/api/events` | ✅ | Get all events |
| POST | `/api/events` | ✅ | Create event |
| GET | `/api/events/:id` | ✅ | Get single event |
| PUT | `/api/events/:id` | ✅ | Update event |
| DELETE | `/api/events/:id` | ✅ | Delete event |

---

## 🔴 Socket.IO Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `eventCreated` | Server → Client | New event broadcast |
| `eventUpdated` | Server → Client | Updated event broadcast |
| `eventDeleted` | Server → Client | Deleted event ID broadcast |
| `notification` | Server → Client | Toast notification broadcast |
| `userCount` | Server → Client | Current connected user count |

---

## 🧪 Testing Real-Time

1. Open `http://localhost:5173` in **two different browser windows**
2. Register/login in both
3. Create or delete an event in one — the other updates **instantly**

---

## 🔧 MongoDB Atlas (Cloud)

To use MongoDB Atlas instead of local MongoDB:

1. Create a free cluster at https://cloud.mongodb.com
2. Get your connection string
3. Update `server/.env`:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/realtime-event-engine
   ```

---

## 🛡️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, Tailwind CSS |
| State | React Context + Hooks |
| HTTP Client | Axios |
| Real-time | Socket.IO Client |
| Backend | Node.js, Express |
| Real-time Server | Socket.IO |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Database | MongoDB + Mongoose |
