import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const signup = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required.' });
  const existing = await User.findByEmail(email);
  if (existing) return res.status(409).json({ message: 'User already exists.' });
  const user = await User.create({ email, password });
  res.status(201).json({ message: 'User registered successfully.' });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findByEmail(email);
  if (!user) return res.status(401).json({ message: 'Invalid credentials.' });
  const isMatch = await user.comparePassword(password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });
  const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
};

export const logout = (req, res) => {
  // For stateless JWT, logout is handled on client by deleting token
  res.json({ message: 'Logged out successfully.' });
};
