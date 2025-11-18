/**
 * Database Configuration
 *
 * Handles MongoDB connection using Mongoose.
 * Terminates process on connection failure.
 *
 * @module config/db
 */

import { config } from "./env.js";
import mongoose from "mongoose";

/**
 * Connect to MongoDB database
 *
 * @returns {Promise<void>}
 * @throws {Error} Exits process with code 1 on connection failure
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.MONGODB_URI, {});
    console.log(`MongoDD connected: ${conn.connection.id}`);
  } catch (error) {
    console.log(`Database connection error: ${error}`);
    process.exit(1);
  }
};

export default connectDB;
