import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  getNotifications,
  markAsRead,
  sendNotification,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.use(authenticate);

router.get("/", getNotifications);
router.put("/read", markAsRead);
router.put("/:id/read", markAsRead);
router.post("/send", sendNotification);

export default router;
