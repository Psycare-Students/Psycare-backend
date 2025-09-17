import express from "express";
import Appointment from "../models/Appointments.js";
import authMiddleware from "../middlewares/authmiddleware.js";

const router = express.Router();


// ✅ 1. Student books appointment (with conflict check)
router.post("/", authMiddleware, async (req, res) => {
  if (req.user.role !== "student") return res.status(403).json({ error: "Only students can book" });

  const { psychologistId, appointmentTime, duration } = req.body;
  console.log("Logged-in user:", req.user);


  try {
    const startTime = new Date(appointmentTime);
    const endTime = new Date(startTime.getTime() + (duration || 30) * 60000);

    // Prevent double booking for psychologist
    const psychConflict = await Appointment.findOne({
      psychologistId,
      status: { $ne: "cancelled" },
      appointmentTime: { $lt: endTime },
      $expr: { $gt: [{ $add: ["$appointmentTime", { $multiply: ["$duration", 60000] }] }, startTime] }
    });
    if (psychConflict) return res.status(400).json({ error: "Psychologist already has an appointment in this slot" });

    // Prevent double booking for student
    const studentConflict = await Appointment.findOne({
      studentId: req.user.id,
      status: { $ne: "cancelled" },
      appointmentTime: { $lt: endTime },
      $expr: { $gt: [{ $add: ["$appointmentTime", { $multiply: ["$duration", 60000] }] }, startTime] }
    });
    if (studentConflict) return res.status(400).json({ error: "You already have an appointment in this slot" });

    const appointment = await Appointment.create({
      studentId: req.user.id,
      psychologistId,
      appointmentTime: startTime,
      duration: duration || 30,
      status: "pending"
    });

    // ✅ 2. Notification placeholder (e.g. email)
    console.log(`📩 Notification: Appointment booked by ${req.user.name}`);

    res.status(201).json(appointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// ✅ 3. Get appointments with filters & pagination
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { status, from, to, page = 1, limit = 10 } = req.query;
    const query = {};

    if (req.user.role === "student") {
      query.studentId = req.user.id;
    } else if (req.user.role === "psychologist") {
      query.psychologistId = req.user.id;
    }

    if (status) query.status = status;
    if (from || to) {
      query.appointmentTime = {};
      if (from) query.appointmentTime.$gte = new Date(from);
      if (to) query.appointmentTime.$lte = new Date(to);
    }

    const appointments = await Appointment.find(query)
      .populate("studentId", "name email")
      .populate("psychologistId", "name email")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ appointmentTime: 1 });

    const total = await Appointment.countDocuments(query);

    res.json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      data: appointments
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ 4. Psychologist updates appointment status
router.patch("/:id", authMiddleware, async (req, res) => {
  if (req.user.role !== "psychologist") return res.status(403).json({ error: "Only psychologists can update" });

  const { status } = req.body;
  if (!["pending", "confirmed", "cancelled"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    const updated = await Appointment.findOneAndUpdate(
      { _id: req.params.id, psychologistId: req.user.id },
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Appointment not found" });

    console.log(`📩 Notification: Appointment ${status} by psychologist ${req.user.name}`);

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ 5. Student cancels appointment
router.delete("/:id", authMiddleware, async (req, res) => {
  if (req.user.role !== "student") return res.status(403).json({ error: "Only students can cancel" });

  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, studentId: req.user.id },
      { status: "cancelled" },
      { new: true }
    );

    if (!appointment) return res.status(404).json({ error: "Appointment not found" });

    console.log(`📩 Notification: Appointment cancelled by student ${req.user.name}`);

    res.json({ message: "Appointment cancelled", appointment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
