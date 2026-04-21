/**
 * Real-Time Event Synchronization Engine - Server Entry Point
 * Sets up Express, Socket.IO, MongoDB, and all routes
 */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');

const app = express();
const server = http.createServer(app);

// ─── Socket.IO Setup ───────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// Make io accessible throughout the app via req.io
app.use((req, res, next) => {
  req.io = io;
  next();
});

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running', timestamp: new Date() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// ─── Socket.IO Events ─────────────────────────────────────────────────────────
let connectedUsers = 0;

io.on('connection', (socket) => {
  connectedUsers++;
  console.log(`✅ Client connected: ${socket.id} | Total: ${connectedUsers}`);

  // Broadcast updated user count to all clients
  io.emit('userCount', connectedUsers);

  // Handle joining a room (for future per-room features)
  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
  });

  // Handle client disconnect
  socket.on('disconnect', () => {
    connectedUsers--;
    console.log(`❌ Client disconnected: ${socket.id} | Total: ${connectedUsers}`);
    io.emit('userCount', connectedUsers);
  });
});

// ─── MongoDB Connection ────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`🔌 Socket.IO ready for connections`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
