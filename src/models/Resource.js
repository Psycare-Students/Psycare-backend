import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ["meditation", "breathing", "article", "video"], required: true },
  tags: [String], // ["anxiety", "sleep"]
  language: { type: String, default: "en" },
  url: String
});

export const Resource = mongoose.model("Resource", resourceSchema);
