
import express from 'express';
import dotenv from 'dotenv';
import forumRoutes from "./src/routes/forum.js";

dotenv.config();
const app = express();

app.use(express.json());

// Import routes
// const userRoutes = require('./routes/userRoutes');
// app.use('/api/users', userRoutes);


app.use("/api/forum", forumRoutes);


app.get('/', (req, res) => {
  res.send('API is running...');
});

export default app;
