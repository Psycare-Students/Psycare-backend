import mongoose from "mongoose";
import fs from "fs";
import Test from "../models/Test.js";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function seedData() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const data = JSON.parse(
      fs.readFileSync("./src/utils/test.json", "utf-8")
    );
    // Clear old data if needed
    await Test.deleteMany({});
    console.log("Old data cleared!");

    // Insert new test data
    await Test.insertMany(data);
    console.log("✅ Data inserted successfully!");

    mongoose.connection.close();
  } catch (error) {
    console
    .error("Error seeding data:", error);
  }
}

seedData();
