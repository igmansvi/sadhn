import { config } from "./env.js";
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.MONGODB_URI, {});
    console.log(`MongoDB connected: ${conn.connection.id}`);
  } catch (error) {
    console.log(`Database connection error: ${error}`);
    process.exit(1);
  }
};

export default connectDB;
