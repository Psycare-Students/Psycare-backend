import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  question_text: { type: String, required: true },
  options: { type: [String], required: true },
  score_mapping: { type: Map, of: Number, required: true }
});

const TestSchema = new mongoose.Schema({
  test_name: { type: String, required: true },
  description: String,
  questions: [QuestionSchema]
});

const Test = mongoose.model("Test", TestSchema);
export default Test;
