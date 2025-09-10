import express from "express";
import {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  createVideo,
  getAllVideos,
  getVideoById,
  updateVideo,
  deleteVideo
} from "../controllers/wellnessController.js";

import authMiddleware from "../middlewares/authmiddleware.js";

const router = express.Router();

// Article routes
router.post("/articles", authMiddleware, createArticle);
router.get("/articles", getAllArticles);
router.get("/articles/:id", getArticleById);
router.put("/articles/:id", authMiddleware, updateArticle);
router.delete("/articles/:id", authMiddleware, deleteArticle);

// Video routes
router.post("/videos", authMiddleware, createVideo);
router.get("/videos", getAllVideos);
router.get("/videos/:id", getVideoById);
router.put("/videos/:id", authMiddleware, updateVideo);
router.delete("/videos/:id", authMiddleware, deleteVideo);

export default router;