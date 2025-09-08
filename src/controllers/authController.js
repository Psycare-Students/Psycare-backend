import User from '../models/User.js';
import jwt from 'jsonwebtoken';


const JWT_SECRET = "35391d39f508992e4432b3b8930003eb822978c0db2a1def436f283d72b621c4";
console.log("JWT Secret in authController:", JWT_SECRET);

export const signup = async (req, res) => {
  try {
    console.log('Signup request body:', req.body);
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required.' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'User already exists.' });
    const user = new User({ email, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    console.log('Login request body:', req.body);
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials.' });
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });
    const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const logout = (req, res) => {
  // For stateless JWT, logout is handled on client by deleting token
  res.json({ message: 'Logged out successfully.' });
};
