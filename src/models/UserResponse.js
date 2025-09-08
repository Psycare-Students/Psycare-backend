import mongoose from "mongoose";

const UserResponseSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  test_id: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
  answers: { type: Map, of: String, required: true }, // { questionId: option }
  score: { type: Number, required: true },
  created_at: { type: Date, default: Date.now }
});

const UserResponse = mongoose.model("UserResponse", UserResponseSchema);
export default UserResponse
