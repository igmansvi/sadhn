/**
 * Main Server File
 *
 * Initializes Express application with middleware, routes, and database connection.
 * Handles server startup and configuration.
 *
 * @module server/index
 */

import express from "express";
import cors from "cors";
import { config } from "./config/env.js";
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.route.js";
import profileRouter from "./routes/profile.route.js";
import { requestLogger } from "./utils/logger.js";

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.get("/", (req, res) => {
  res.json({ message: "Server is running", version: "1.0.0" });
});

app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

app.listen(config.PORT, (error) => {
  if (error) {
    console.error("Server startup error:", error);
    process.exit(1);
  }
  console.log(`Server running on: http://localhost:${config.PORT}`);
});
