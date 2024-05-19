const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({ path: './config/config.env' });

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Chat message model
const Message = require('./models/Message');

// Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('message', async (msg) => {
    const message = new Message({ text: msg });
    await message.save();
    io.emit('message', msg);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Routes
const chatRouter = require('./routes/chat');
app.use('/api/chat', chatRouter);

const PORT = process.env.PORT || 5001; // Changed from 5000 to 5001
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});