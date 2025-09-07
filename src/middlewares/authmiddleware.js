// src/middlewares/authMiddleware.js
import jwt from "jsonwebtoken";

// This middleware will protect routes
const authMiddleware = (req, res, next) => {
  try {
    let token;

    // 1. Check for JWT token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // attach user info to request
      return next();
    }

    // 2. Check for Google OAuth (assuming req.user is populated by passport)
    if (req.user) {
      return next();
    }

    // 3. No auth found
    return res.status(401).json({ message: "Unauthorized: Login required" });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

export default authMiddleware;
