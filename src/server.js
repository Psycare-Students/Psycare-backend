import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import dns from "dns";
dns.setDefaultResultOrder("ipv4first");


dotenv.config();

// Connect to Database
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
