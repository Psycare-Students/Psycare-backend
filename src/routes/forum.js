import express from "express";
import Forum from "../models/Forum.js";
import PrivateMessage from "../models/PrivateMessage.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import postMiddleware from "../middlewares/postMiddleware.js";

const router = express.Router();

// Helper to get a string identifier for user
const getUserIdentifier = (user) => user.name || user.email || user.id;

// -----------------------
// Create a new post
// -----------------------
router.post("/", authMiddleware, postMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;
    const user = getUserIdentifier(req.user);
    if (!user) return res.status(401).json({ message: "User info missing" });

    const newPost = new Forum({ title, content, user });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// -----------------------
// Get all posts
// -----------------------
router.get("/", async (req, res) => {
  try {
    const posts = await Forum.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------
// Reply to a post
// -----------------------
router.post("/:id/reply", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const user = getUserIdentifier(req.user);

    const forumPost = await Forum.findById(id);
    if (!forumPost) return res.status(404).json({ message: "Post not found" });

    forumPost.replies.push({ user, message });
    await forumPost.save();
    res.status(201).json(forumPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// -----------------------
// Like a post
// -----------------------
router.post("/:id/like", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const forumPost = await Forum.findById(id);
    if (!forumPost) return res.status(404).json({ message: "Post not found" });

    forumPost.likes += 1;
    await forumPost.save();
    res.json({ likes: forumPost.likes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// -----------------------
// Send a private message
// -----------------------
router.post("/message", authMiddleware, postMiddleware, async (req, res) => {
  try {
    const { message, to } = req.body;
    const from = getUserIdentifier(req.user);

    if (!from) return res.status(401).json({ message: "User info missing" });

    const newMessage = new PrivateMessage({ from, to, message });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
