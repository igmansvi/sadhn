

import express from "express";
import {
  authenticate,
  requireRole,
  requireProfile,
} from "../middlewares/auth.middleware.js";
import {
  getDashboard,
  getLearnerDashboard,
  getRecruiterDashboard,
  getAdminDashboard,
} from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/", authenticate, getDashboard);

router.get(
  "/learner",
  authenticate,
  requireRole(["learner"]),
  getLearnerDashboard
);

router.get(
  "/recruiter",
  authenticate,
  requireRole(["employer"]),
  getRecruiterDashboard
);

router.get("/admin", authenticate, requireRole(["admin"]), getAdminDashboard);

export default router;
