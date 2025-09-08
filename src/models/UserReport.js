import  mongoose from"mongoose";

const UserReportSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  progress: { type: Map, of: [Number], default: {} }, // { testId: [scores] }
  last_updated: { type: Date, default: Date.now }
});

const UserReport = mongoose.model("UserReport", UserReportSchema);
export default UserReport;
