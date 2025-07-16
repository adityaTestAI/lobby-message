import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import { initializeFirebase } from './config/firebase.js';
import { authMiddleware } from './middleware/auth.js';
import { setupSocketHandlers } from './socket/handlers.js';

// Import routes
import authRoutes from './routes/auth.js';
import lobbyRoutes from './routes/lobby.js';
import messageRoutes from './routes/message.js';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Initialize services
await connectDB();
initializeFirebase();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', authMiddleware, lobbyRoutes);
app.use('/api', authMiddleware, messageRoutes);

// Socket.io handlers
setupSocketHandlers(io);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});