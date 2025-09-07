import express from 'express';
import { signup, login, logout } from '../controllers/authController.js';
import passport from '../auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/' }), (req, res) => {
	res.json({ message: 'Google login successful', user: req.user });
});

export default router;
