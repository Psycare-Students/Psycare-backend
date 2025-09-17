import cors from "cors";
import bodyParser from "body-parser";
import testRoutes from "./routes/TestRoutes.js";
import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import passport from './auth.js';
import session from 'express-session';
import forumRoutes from "./routes/forum.js";
import userRoutes from './routes/user.js';

dotenv.config();
const app = express();

app.use(express.json());

// Import routes
// const userRoutes = require('./routes/userRoutes');
// app.use('/api/users', userRoutes);
app.use(cors({
  origin: 'http://localhost:5001', // Change to your frontend URL/port
  credentials: true
}));
app.use(bodyParser.json());


app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

app.use("/api/tests", testRoutes);

app.use("/api/forum", forumRoutes);


app.get('/', (req, res) => {
  res.send('API is running...');
});

export default app;
