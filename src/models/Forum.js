import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
  {
    user: { type: String, required: true }, // could be userId in real app
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const forumSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    user: { type: String, required: true }, // could be userId
    likes: { type: Number, default: 0 },
    replies: [replySchema],
  },
  { timestamps: true }
);

const Forum = mongoose.model("Forum", forumSchema);
export default Forum;
