import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { config } from "./config/env.js";
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.route.js";
import profileRouter from "./routes/profile.route.js";
import jobRouter from "./routes/job.route.js";
import skillProgramRouter from "./routes/skillprogram.route.js";
import articleRouter from "./routes/article.route.js";
import applicationRouter from "./routes/application.route.js";
import dashboardRouter from "./routes/dashboard.route.js";
import newsRouter from "./routes/news.route.js";
import matchingRouter from "./routes/matching.route.js";
import notificationRouter from "./routes/notification.route.js";
import { requestLogger } from "./utils/logger.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: config.CLIENT_URL,
    credentials: true,
  },
});

connectDB();

app.use(
  cors({
    origin: config.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.use((req, res, next) => {
  req.io = io;
  next();
});
io.on("connection", (socket) => {
  console.log("New client connected", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room ${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });
});

app.get("/", (req, res) => {
  res.json({ message: "Server is running", version: "1.0.0" });
});

app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/jobs", jobRouter);
app.use("/api/skill-programs", skillProgramRouter);
app.use("/api/articles", articleRouter);
app.use("/api/applications", applicationRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/news", newsRouter);
app.use("/api/matching", matchingRouter);
app.use("/api/notifications", notificationRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

server.listen(config.PORT, (error) => {
  if (error) {
    console.error("Server startup error:", error);
    process.exit(1);
  }
  console.log(`Server running on: http://localhost:${config.PORT}`);
});
