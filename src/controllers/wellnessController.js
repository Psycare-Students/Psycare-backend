import WellnessArticle from "../models/WellnessArticle.js";
import WellnessVideo from "../models/WellnessVideo.js";

// Article Controllers
export const createArticle = async (req, res) => {
  try {
    const article = await WellnessArticle.create(req.body);
    res.status(201).json(article);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllArticles = async (req, res) => {
  try {
    const articles = await WellnessArticle.find();
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getArticleById = async (req, res) => {
  try {
    const article = await WellnessArticle.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateArticle = async (req, res) => {
  try {
    const article = await WellnessArticle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!article) return res.status(404).json({ message: "Article not found" });
    res.status(200).json(article);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteArticle = async (req, res) => {
  try {
    const article = await WellnessArticle.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Video Controllers
export const createVideo = async (req, res) => {
  try {
    const video = await WellnessVideo.create(req.body);
    res.status(201).json(video);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllVideos = async (req, res) => {
  try {
    const videos = await WellnessVideo.find();
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getVideoById = async (req, res) => {
  try {
    const video = await WellnessVideo.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });
    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateVideo = async (req, res) => {
  try {
    const video = await WellnessVideo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!video) return res.status(404).json({ message: "Video not found" });
    res.status(200).json(video);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteVideo = async (req, res) => {
  try {
    const video = await WellnessVideo.findByIdAndDelete(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};