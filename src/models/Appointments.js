// models/Appointment.js
import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  psychologistId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  appointmentTime: { type: Date, required: true },
  duration: { type: Number, default: 30 }, // minutes
  status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Appointment", appointmentSchema);
