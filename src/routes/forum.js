
import express from "express";
import Forum from "../models/Forum.js";
import PrivateMessage from "../models/PrivateMessage.js";
import authMiddleware from "../middlewares/authmiddleware.js";

const router = express.Router();

// Protected routes
router.post("/", authMiddleware, async (req, res) => {
  const { title, content } = req.body;
  const user = req.user.name || req.user.email; 
  const newPost = new Forum({ title, content, user });
  await newPost.save();
  res.status(201).json(newPost);
});

router.get("/", async (req, res) => {
  try {
    const posts = await Forum.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/:id/reply", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;
  const user = req.user.name || req.user.email;

  const forumPost = await Forum.findById(id);
  if (!forumPost) return res.status(404).json({ message: "Post not found" });

  forumPost.replies.push({ user, message });
  await forumPost.save();
  res.status(201).json(forumPost);
});

router.post("/:id/like", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const forumPost = await Forum.findById(id);
  if (!forumPost) return res.status(404).json({ message: "Post not found" });

  forumPost.likes += 1;
  await forumPost.save();
  res.json({ likes: forumPost.likes });
});

router.post("/message", authMiddleware, async (req, res) => {
  const { message, to } = req.body;
  const from = req.user.name || req.user.email;

  const newMessage = new PrivateMessage({ from, to, message });
  await newMessage.save();
  res.status(201).json(newMessage);
});

export default router;
