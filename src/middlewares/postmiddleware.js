// src/middlewares/postMiddleware.js
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const postMiddleware = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "Post data missing" });
    }


    // 1. Check for explicit self-harm/suicide keywords
    const harmfulKeywords = [
      /\bkill(ing)?\s+my\s*self\b/,
      /\bkill\s+myself\b/,
      /\bi\s+feel\s+like\s+killing\s+my\s*self\b/,
      /\bi\s+want\s+to\s+die\b/,
      /\bi\s+want\s+to\s+kill\s+myself\b/,
      /\bi('?m| i am)\s+going\s+to\s+kill\s+myself\b/,
      /\bend\s+my\s+life\b/,
      /\bi\s+can('?t| not)\s+go\s+on\b/,
      /\bsuicidal\b/,
      /\bi\s+wish\s+i\s+was\s+dead\b/,
      /\bi\s+want\s+to\s+end\s+it\b/,
      /\bwant\s+to\s+die\b/,
    ];

    const textToCheck = `${title || ""} ${content || ""}`.toLowerCase();

    const harmful = harmfulKeywords.some((regex) => regex.test(textToCheck));

    if (harmful) {
      return res
        .status(403)
        .json({ message: "Post contains harmful or inappropriate content" });
    }

    // 2. Use Hugging Face suicidality detection model
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/sentinet/suicidality",
      { inputs: textToCheck },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
        },
      }
    );

    const result = response.data;
    if (result[0].label === "LABEL_1") {
      return res
        .status(403)
        .json({ message: "Post contains harmful or inappropriate content" });
    }

    next();
  } catch (err) {
    console.error("Post moderation error:", err.response?.data || err.message);
    res.status(500).json({ message: "Error checking post content" });
  }
};

export default postMiddleware;
