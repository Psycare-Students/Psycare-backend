// routes/chat.js
import express from "express";
import dotenv from "dotenv";
import dns from "dns";
import * as chrono from "chrono-node";
import { GoogleGenerativeAI } from "@google/generative-ai";
import translate from "google-translate-api-x";  // ✅ Translation API

import Appointment from "../models/Appointments.js";
import Conversation from "../models/Conversation.js";
import User from "../models/User.js";
import authMiddleware from "../middlewares/authmiddleware.js";

dns.setDefaultResultOrder("ipv4first");
dotenv.config();

const router = express.Router();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// ---------------- Emergency ----------------
const EMERGENCY_REPLY = `Your life matters, and I want you to get help immediately.  
I am an AI and cannot offer the support you need.  
**Please call emergency services or go to the nearest emergency room right now.**  
If you are in the US, dial 911.  
If you are elsewhere, search online for your local emergency number.  
There are people who want to help you. Please, please seek help immediately.`;

const HOTLINES = [
  { name: "Local Emergency", phone: "112" },
  { name: "KIRAN (24x7 Mental Health Helpline - India)", phone: "1800-599-0019" },
  { name: "iCALL (TISS)", phone: "9152987821" },
  { name: "AASRA (NGO)", website: "https://www.aasra.info/" },
];

// ---------------- Suicide Detector ----------------
function normalizeText(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[\u2018\u2019\u201C\u201D]/g, "'")
    .replace(/[^\w\s'"]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const SUICIDAL_PATTERNS = [
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

function containsSuicidalKeywords(rawText) {
  const text = normalizeText(rawText);
  if (!text) return false;
  return SUICIDAL_PATTERNS.some((re) => re.test(text));
}

async function confirmSuicidalWithModel(userMessage) {
  try {
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: `Classify as "suicidal" or "not suicidal": "${userMessage}"` }],
        },
      ],
    });
    const result = await chat.sendMessage("");
    const text = result.response.text().toLowerCase();
    return text.includes("suicidal") || text.includes("yes") || text.includes("suicide");
  } catch (err) {
    console.error("confirmSuicidalWithModel error:", err);
    return false; // fallback
  }
}

// ---------------- Booking Detector ----------------
async function detectBookingIntent(message) {
  if (!/book|appointment|schedule|slot|reserve/i.test(message)) return null;

  // Find therapist
  const therapists = await User.find({ role: "psychologist" }).select("_id name email").lean();
  let matchedTherapist = null;

  for (const t of therapists) {
    if (message.toLowerCase().includes(t.name.toLowerCase())) {
      matchedTherapist = t;
      break;
    }
  }

  // Parse natural language time
  const parsedTime = chrono.parseDate(message);
  return {
    therapist: matchedTherapist,
    time: parsedTime ? parsedTime.toISOString() : null,
  };
}

// ---------------- Translation Helper ----------------
async function translateTextIfNeeded(text, lang) {
  if (!lang || lang === "en") return text; // default English
  try {
    const res = await translate(text, { to: lang });
    return res.text;
  } catch (err) {
    console.error("Translation failed:", err);
    return text; // fallback
  }
}

// ---------------- Chat Endpoint ----------------
router.post("/chat", authMiddleware, async (req, res) => {
  const { message, lang } = req.body;
  const userId = req.user?.id || req.user?._id;

  if (!message) return res.status(400).json({ error: "Message is required" });

  try {
    // Step 1: Booking
    const booking = await detectBookingIntent(message);
    if (booking && booking.therapist) {
      let reply;
      if (!booking.time) {
        reply = `I recognized your request to book with ${booking.therapist.name}. Please provide the appointment time (e.g., "Sep 17 3pm").`;
        reply = await translateTextIfNeeded(reply, lang);
        return res.json({ bookingRequiredTime: true, message: reply });
      }

      const existing = await Appointment.findOne({
        psychologistId: booking.therapist._id,
        appointmentTime: booking.time,
      });

      if (existing) {
        reply = `❌ ${booking.therapist.name} is already booked at ${booking.time}. Please choose another time.`;
        reply = await translateTextIfNeeded(reply, lang);
        return res.json({ bookingSuccess: false, message: reply });
      }

      const appt = new Appointment({
        studentId: userId,
        psychologistId: booking.therapist._id,
        appointmentTime: booking.time,
      });
      await appt.save();

      reply = `✅ Appointment confirmed with ${booking.therapist.name} at ${booking.time}.`;
      reply = await translateTextIfNeeded(reply, lang);
      return res.json({ bookingSuccess: true, message: reply, appointment: appt });
    }

    // Step 2: Suicide detection
    let suicidalDetected = containsSuicidalKeywords(message);
    if (suicidalDetected && process.env.CONFIRM_WITH_MODEL === "true") {
      suicidalDetected = await confirmSuicidalWithModel(message);
    }

    if (suicidalDetected) {
      const escalationConvo = new Conversation({
        user_id: userId,
        message,
        response: EMERGENCY_REPLY,
        escalated: true,
        severityTag: "suicidal",
      });
      await escalationConvo.save();

      const therapists = await User.find({ role: "psychologist" }).select("_id name email").lean();

      let emergencyTranslated = await translateTextIfNeeded(EMERGENCY_REPLY, lang);

      return res.json({
        escalate: true,
        emergencyMessage: emergencyTranslated,
        hotlines: HOTLINES, // You can also translate names if you want
        therapists: therapists.map((t) => ({ id: t._id, name: t.name, email: t.email })),
      });
    }

    // Step 3: Normal chat
    const pastConvos = await Conversation.find({ user_id: userId }).sort({ createdAt: 1 }).lean();
    const history = pastConvos.flatMap((c) => [
      { role: "user", parts: [{ text: c.message }] },
      { role: "model", parts: [{ text: c.response }] },
    ]);

    const chat = model.startChat({
      history,
      context:
        "You are PsyCare, an empathetic mental health chatbot for students. Respond with compassion, suggest relaxation tips, and guide them to tests if needed. Escalate to human therapists if suicidal intent is detected.",
    });

    const result = await chat.sendMessage(message);
    let reply = result.response.text();

    // Translate reply if needed
    reply = await translateTextIfNeeded(reply, lang);

    const convo = new Conversation({ user_id: userId, message, response: reply });
    await convo.save();

    return res.json({ reply });
  } catch (err) {
    console.error("Chatbot Error:", err);
    return res.status(500).json({ error: "AI Chatbot error" });
  }
});

export default router;
