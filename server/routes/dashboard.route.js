/**
 * Dashboard Routes
 *
 * Defines routes for dashboard data access.
 *
 * @module routes/dashboard
 */

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
} from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/", authenticate, requireProfile, getDashboard);

router.get(
  "/learner",
  authenticate,
  requireRole(["learner"]),
  requireProfile,
  getLearnerDashboard
);

router.get(
  "/recruiter",
  authenticate,
  requireRole(["employer"]),
  requireProfile,
  getRecruiterDashboard
);

export default router;
