// models/Conversation.js
import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    message: { type: String, required: true },
    response: { type: String, required: true },
    escalated: { type: Boolean, default: false },        // whether this turn required escalation
    severityTag: { type: String, enum: ["low","medium","high","suicidal"], default: "low" }, 
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", conversationSchema);
