/**
 * Socket.IO Client Configuration
 * Creates and exports a singleton socket connection
 */

import { io } from 'socket.io-client';

// Connect to backend Socket.IO server
const socket = io('http://localhost:5000', {
  autoConnect: false, // We manually connect after login
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export default socket;
