import cors from "cors";
import bodyParser from "body-parser";
import testRoutes from "./routes/TestRoutes.js";
import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import passport from './auth.js';
import session from 'express-session';
import forumRoutes from "./routes/forum.js";
import appointment from './routes/appointmentroutes.js'
import chatRoutes from './routes/chatbotRoutes.js'
import wellnessRoutes from './routes/wellnessRoutes.js'
import userRoutes from './routes/user.js'

dotenv.config();
const app = express();

app.use(express.json());

// Import routes
// const userRoutes = require('./routes/userRoutes');
// app.use('/api/users', userRoutes);
app.use(cors({
  origin: "http://localhost:5000",  // frontend origin
  methods: ["GET", "POST","PATCH","DELETE"],
  credentials: true
}));
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);

app.use('/api', chatRoutes);

app.use('/api/users', userRoutes);


app.use('/api/appointments', appointment);

app.use('/api/wellness', wellnessRoutes);

app.use("/api/tests", testRoutes);

app.use("/api/forum", forumRoutes);


app.get('/', (req, res) => {
  res.send('API is running...');
});

// 404 handler - must be after all routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      'GET /',
      'POST /api/auth/*',
      'POST /api/chat',
      'POST /api/chat/book-appointment',
      'POST /api/appointment',
      'GET /api/appointment',
      'PATCH /api/appointment/:id',
      'DELETE /api/appointment/:id',
      'GET /api/tests/*',
      'GET /api/forum/*',
      'POST /api/forum/*'
    ]
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

export default app;
