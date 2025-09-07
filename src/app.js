

import express from 'express';
import dotenv from 'dotenv';
import forumRoutes from "./routes/forum.js";

import passport from './auth.js';
import session from 'express-session';
dotenv.config();

const app = express();
app.use(session({ secret: process.env.JWT_SECRET || 'secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

// Import routes
// const userRoutes = require('./routes/userRoutes');
// app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

export default app;
