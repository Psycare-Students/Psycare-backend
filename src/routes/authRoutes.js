import express from 'express';
import { signup, login, logout } from '../controllers/authController.js';
import passport from '../auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || '35391d39f508992e4432b3b8930003eb822978c0db2a1def436f283d72b621c4';

router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/' }), (req, res) => {
	// Generate JWT for Google user
	const user = req.user;
	const token = jwt.sign(
		{ id: user._id, role: user.role },
		JWT_SECRET,
		{ expiresIn: '1h' }
	);
	// Redirect to frontend with user info in query params
	const redirectUrl = `http://localhost:5001/?token=${token}` +
		`&avatar=${encodeURIComponent(user.avatar)}` +
		`&funnyName=${encodeURIComponent(user.funnyName)}` +
		`&name=${encodeURIComponent(user.name)}` +
		`&email=${encodeURIComponent(user.email)}` +
		`&role=${encodeURIComponent(user.role)}`;
	res.redirect(redirectUrl);
});

export default router;