import express from "express";
import Forum from "../models/Forum.js";
import PrivateMessage from "../models/PrivateMessage.js";
import authMiddleware from "../middlewares/authmiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/forum
 * @desc    Create a new forum post
 */
router.post("/", authMiddleware ,async (req, res) => {
  try {
    const { title, content, user } = req.body;

    if (!title || !content || !user) {
      return res.status(400).json({ message: "Title, content, and user required" });
    }

    const newPost = new Forum({ title, content, user });
    await newPost.save();

    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route   GET /api/forum
 * @desc    Get all forum posts
 */
router.get("/", async (req, res) => {
  try {
    const posts = await Forum.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route   POST /api/forum/:id/reply
 * @desc    Add a reply to a forum post
 */
router.post("/:id/reply", authMiddleware , async (req, res) => {
  try {
    const { id } = req.params;
    const { user, message } = req.body;

    if (!user || !message) {
      return res.status(400).json({ message: "User and message required" });
    }

    const forumPost = await Forum.findById(id);
    if (!forumPost) return res.status(404).json({ message: "Post not found" });

    forumPost.replies.push({ user, message });
    await forumPost.save();

    res.status(201).json(forumPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route   POST /api/forum/:id/like
 * @desc    Increment like count of a forum post
 */
router.post("/:id/like", authMiddleware , async (req, res) => {
  try {
    const { id } = req.params;
    const forumPost = await Forum.findById(id);

    if (!forumPost) return res.status(404).json({ message: "Post not found" });

    forumPost.likes += 1;
    await forumPost.save();

    res.json({ likes: forumPost.likes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route   POST /api/forum/message
 * @desc    Send a private message
 */
router.post("/message", authMiddleware , async (req, res) => {
  try {
    const { from, to, message } = req.body;

    if (!from || !to || !message) {
      return res.status(400).json({ message: "From, To, and Message required" });
    }

    const newMessage = new PrivateMessage({ from, to, message });
    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
