import Test from "../models/Test.js";
import UserResponse from "../models/UserResponse.js";
import UserReport from "../models/UserReport.js";

// Get all tests
export const getAllTests = async (req, res) => {
  try {
    const tests = await Test.find({}, "test_name description");
    res.json(tests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get questions for a test
export const getTestQuestions = async (req, res) => {
  try {
    const test = await Test.findById(req.params.testId);
    if (!test) return res.status(404).json({ message: "Test not found" });
    res.json(test.questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Submit test answers & calculate score
export const submitTest = async (req, res) => {
  const { userId, answers } = req.body;

  try {
    const test = await Test.findById(req.params.testId);
    if (!test) return res.status(404).json({ message: "Test not found" });

    let score = 0;
    test.questions.forEach(q => {
      const userAnswer = answers[q._id];
      if (userAnswer && q.score_mapping.has(userAnswer)) {
        score += q.score_mapping.get(userAnswer);
      }
    });

    // Save user response
    const response = await UserResponse.create({
      user_id: userId,
      test_id: test._id,
      answers,
      score
    });

    // Update user report
    let report = await UserReport.findOne({ user_id: userId });
    if (!report) {
      report = await UserReport.create({
        user_id: userId,
        progress: { [test._id]: [score] }
      });
    } else {
      const scores = report.progress.get(test._id.toString()) || [];
      scores.push(score);
      report.progress.set(test._id.toString(), scores);
      report.last_updated = new Date();
      await report.save();
    }

    res.json({ message: "Test submitted successfully", score });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user report
export const getUserReport = async (req, res) => {
  try {
    const report = await UserReport.findOne({ user_id: req.params.userId });
    if (!report) return res.json({ message: "No reports yet" });
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
