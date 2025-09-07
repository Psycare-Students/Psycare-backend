

import express from 'express';
import dotenv from 'dotenv';
import passport from './auth.js';
import session from 'express-session';
dotenv.config();

const app = express();
app.use(session({ secret: process.env.JWT_SECRET || 'secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

import authRoutes from './routes/authRoutes.js';
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

export default app;
