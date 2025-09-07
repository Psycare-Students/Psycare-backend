
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
const app = express();

app.use(express.json());

// Import routes
// const userRoutes = require('./routes/userRoutes');
// app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

export default app;
