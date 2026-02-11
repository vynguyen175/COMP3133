const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');
const GroupMessage = require('./models/GroupMessage');
const PrivateMessage = require('./models/PrivateMessage');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'views')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Serve HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/chat', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'chat.html'));
});

// Socket.io connection handling
const users = {}; // { socketId: { username, room } }
const rooms = {}; // { roomName: [usernames] }

// Helper function to broadcast online users to all clients
const broadcastOnlineUsers = () => {
  const onlineUsers = Object.values(users).map((u) => u.username);
  const uniqueUsers = [...new Set(onlineUsers)];
  io.emit('online_users', uniqueUsers);
};

io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  // User registers their username when connecting
  socket.on('register_user', (data) => {
    const { username } = data;
    users[socket.id] = { username, room: null };
    broadcastOnlineUsers();
    console.log(`${username} registered`);
  });

  // User joins a room
  socket.on('join_room', (data) => {
    const { username, room } = data;
    socket.join(room);

    users[socket.id] = { username, room };

    if (!rooms[room]) {
      rooms[room] = [];
    }
    rooms[room].push(username);

    // Notify others in the room
    io.to(room).emit('user_joined', {
      message: `${username} joined the room`,
      users: rooms[room],
      username,
    });

    // Broadcast updated online users to all clients
    broadcastOnlineUsers();

    console.log(`${username} joined room: ${room}`);
  });

  // User sends a group message
  socket.on('send_group_message', async (data) => {
    try {
      const { message, room, username } = data;

      // Save message to MongoDB
      const groupMessage = new GroupMessage({
        from_user: username,
        room,
        message,
        date_sent: new Date(),
      });

      await groupMessage.save();

      // Broadcast to room
      io.to(room).emit('receive_group_message', {
        from_user: username,
        message,
        date_sent: new Date().toLocaleString(),
        room,
      });

      console.log(`Message from ${username} in ${room}: ${message}`);
    } catch (err) {
      console.error('Error sending group message:', err);
      socket.emit('error', 'Failed to send message');
    }
  });

  // User sends a private message
  socket.on('send_private_message', async (data) => {
    try {
      const { from_user, to_user, message } = data;

      console.log(`Attempting to save PM from ${from_user} to ${to_user}: ${message}`);

      // Save message to MongoDB
      const privateMessage = new PrivateMessage({
        from_user,
        to_user,
        message,
        date_sent: new Date(),
      });

      const savedMessage = await privateMessage.save();
      console.log('Private message saved:', savedMessage._id);

      // Find recipient socket and send message
      for (const [socketId, user] of Object.entries(users)) {
        if (user.username === to_user) {
          io.to(socketId).emit('receive_private_message', {
            from_user,
            to_user,
            message,
            date_sent: new Date().toLocaleString(),
          });
          break;
        }
      }

      // Also send to sender for UI update
      socket.emit('receive_private_message', {
        from_user,
        to_user,
        message,
        date_sent: new Date().toLocaleString(),
      });

      console.log(`Private message from ${from_user} to ${to_user}: ${message}`);
    } catch (err) {
      console.error('Error sending private message:', err.message);
      console.error('Full error:', err);
      socket.emit('error', 'Failed to send private message');
    }
  });

  // User is typing
  socket.on('typing', (data) => {
    const { username, room } = data;
    socket.to(room).emit('user_typing', { username });
  });

  // User stopped typing
  socket.on('stop_typing', (data) => {
    const { room } = data;
    socket.to(room).emit('user_stop_typing');
  });

  // User leaves a room
  socket.on('leave_room', (data) => {
    const { room, username } = data;
    socket.leave(room);

    if (rooms[room]) {
      rooms[room] = rooms[room].filter((u) => u !== username);
      if (rooms[room].length === 0) {
        delete rooms[room];
      }
    }

    io.to(room).emit('user_left', {
      message: `${username} left the room`,
      users: rooms[room] || [],
    });

    // Broadcast updated online users to all clients
    broadcastOnlineUsers();

    console.log(`${username} left room: ${room}`);
  });

  // Get online users
  socket.on('get_online_users', () => {
    broadcastOnlineUsers();
  });

  // User disconnects
  socket.on('disconnect', () => {
    const user = users[socket.id];
    if (user) {
      const { username, room } = user;

      if (rooms[room]) {
        rooms[room] = rooms[room].filter((u) => u !== username);
        if (rooms[room].length === 0) {
          delete rooms[room];
        } else {
          io.to(room).emit('user_left', {
            message: `${username} disconnected`,
            users: rooms[room],
          });
        }
      }

      delete users[socket.id];

      // Broadcast updated online users to all clients
      broadcastOnlineUsers();

      console.log(`${username} disconnected`);
    }
  });
});

const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
  console.log(`Chat server running on http://localhost:${PORT}`);
  console.log(`Connect to: http://localhost:${PORT}`);
});
