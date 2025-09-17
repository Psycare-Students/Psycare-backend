import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  question_text: { type: String, required: true },
  answer_type: { type: String, required: true, enum: ["yes_no", "scale_0_3", "scale_0_4", "scale_1_4", "scale_1_5"] },
  options: { type: [String] },
  score_mapping: { type: Map, of: Number } 
});

const TestSchema = new mongoose.Schema({
  test_name: { type: String, required: true },
  description: String,
  questions: [QuestionSchema]
});


const Test = mongoose.model("Test", TestSchema);
export default Test;
