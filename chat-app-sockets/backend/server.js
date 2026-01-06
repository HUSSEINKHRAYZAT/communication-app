const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Configure Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5174", // React dev server
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage
const connectedUsers = new Map(); // socketId -> {username, id}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    onlineUsers: connectedUsers.size,
    timestamp: new Date().toISOString()
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);

  // Handle user join
  socket.on('join', (data) => {
    const { username } = data;
    
    if (!username || username.trim() === '') {
      socket.emit('error', { message: 'Username is required' });
      return;
    }

    // Store user info
    connectedUsers.set(socket.id, {
      id: socket.id,
      username: username.trim(),
      joinedAt: new Date()
    });

    console.log(`User joined: ${username} (${socket.id})`);

    // Send welcome message to the user
    socket.emit('system', {
      text: `Welcome to the chat, ${username}! 🎉`,
      timestamp: new Date().toISOString()
    });

    // Broadcast to all other users that someone joined
    socket.broadcast.emit('system', {
      text: `${username} joined the chat`,
      timestamp: new Date().toISOString()
    });

    // Send updated user count to everyone
    io.emit('users', {
      count: connectedUsers.size,
      users: Array.from(connectedUsers.values()).map(u => ({
        id: u.id,
        username: u.username
      }))
    });
  });

  // Handle incoming messages
  socket.on('message', (data) => {
    const user = connectedUsers.get(socket.id);
    
    if (!user) {
      socket.emit('error', { message: 'Please join with a username first' });
      return;
    }

    const { text } = data;
    
    if (!text || text.trim() === '') {
      return;
    }

    const message = {
      id: Date.now() + Math.random(), // Simple unique ID
      username: user.username,
      text: text.trim(),
      timestamp: new Date().toISOString()
    };

    console.log(`Message from ${user.username}: ${text}`);

    // Broadcast message to all clients (including sender)
    io.emit('message', message);
  });

  // Handle typing indicator (optional feature)
  socket.on('typing', (data) => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      socket.broadcast.emit('typing', {
        username: user.username,
        isTyping: data.isTyping
      });
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    const user = connectedUsers.get(socket.id);
    
    if (user) {
      console.log(`User disconnected: ${user.username} (${socket.id})`);
      
      // Remove user from connected users
      connectedUsers.delete(socket.id);

      // Broadcast to all users that someone left
      io.emit('system', {
        text: `${user.username} left the chat`,
        timestamp: new Date().toISOString()
      });

      // Send updated user count to everyone
      io.emit('users', {
        count: connectedUsers.size,
        users: Array.from(connectedUsers.values()).map(u => ({
          id: u.id,
          username: u.username
        }))
      });
    } else {
      console.log(`Client disconnected: ${socket.id}`);
    }
  });

  // Handle errors
  socket.on('error', (error) => {
    console.error(`Socket error for ${socket.id}:`, error);
  });
});

const PORT = process.env.PORT || 3002;

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔌 WebSocket ready on ws://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
