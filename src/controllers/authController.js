import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = "35391d39f508992e4432b3b8930003eb822978c0db2a1def436f283d72b621c4";

// ========================= SIGNUP =========================
export const signup = async (req, res) => {
  try {
    console.log('Signup request body:', req.body);
    const { name, email, password, role } = req.body;

    // Validate inputs
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password, and role are required.' });
    }

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'User already exists.' });
    }

    // Create new user
    const user = new User({ name, email, password, role });
    await user.save();

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ========================= LOGIN =========================
export const login = async (req, res) => {
  try {
    console.log('Login request body:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials.' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });

    // Sign JWT with user id + role (better than just email)
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send back user info (excluding password, already removed in schema toJSON)
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ========================= LOGOUT =========================
export const logout = (req, res) => {
  // Stateless JWT: client just deletes token
  res.json({ message: 'Logged out successfully.' });
};
