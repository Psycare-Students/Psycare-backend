// src/middlewares/authMiddleware.js
import jwt from "jsonwebtoken";

// Middleware to protect routes and normalize user info
const authMiddleware = (req, res, next) => {
  try {
    let user;

    // 1. Check for JWT token in Authorization header
    if (req.headers.authorization) {
      // Remove "Bearer " if it exists, works even if user doesn't include it
      const token = req.headers.authorization.replace(/^Bearer\s+/i, "").trim();

      // Verify JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Normalize user object
      user = {
        id: decoded.id,
        name: decoded.name || null,
        email: decoded.email || null,
      };

      req.user = user;
      return next();
    }

    // 2. Check for Google OAuth (req.user populated by Passport)
    if (req.user) {
      user = {
        id: req.user.id || req.user._id,
        name: req.user.name || null,
        email: req.user.email || null,
      };

      req.user = user;
      return next();
    }

    // 3. No auth found
    return res.status(401).json({ message: "Unauthorized: Login required" });
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

export default authMiddleware;
export const authenticateJWT = authMiddleware;
