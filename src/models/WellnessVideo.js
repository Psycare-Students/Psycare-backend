import mongoose from "mongoose";

const WellnessVideoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    url: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const WellnessVideo = mongoose.model('WellnessVideo', WellnessVideoSchema);
export default WellnessVideo;