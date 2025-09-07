import mongoose from "mongoose";

const privateMessageSchema = new mongoose.Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const PrivateMessage = mongoose.model("PrivateMessage", privateMessageSchema);
export default PrivateMessage;
