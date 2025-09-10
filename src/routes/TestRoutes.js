import express from "express";
import {
  getAllTests,
  getTestQuestions,
  submitTest,
  getUserReport
} from "../controllers/TestControllers.js";

import authMiddleware from "../middlewares/authmiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getAllTests);
router.get("/:testId/questions", getTestQuestions);
router.post("/:testId/submit", submitTest);
router.get("/user/:userId/report", getUserReport);

export default router;
