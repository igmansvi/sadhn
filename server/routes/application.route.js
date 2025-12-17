/**
 * Application Routes
 *
 * Defines routes for job application operations.
 *
 * @module routes/application
 */

import express from "express";
import { body } from "express-validator";
import {
  authenticate,
  requireRole,
  requireProfile,
} from "../middlewares/auth.middleware.js";
import {
  applyToJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  withdrawApplication,
  getApplicationById,
} from "../controllers/application.controller.js";

const router = express.Router();

const applyValidation = [
  body("jobId").notEmpty().withMessage("job ID is required"),
];

const statusUpdateValidation = [
  body("status")
    .optional()
    .isIn([
      "applied",
      "reviewing",
      "shortlisted",
      "interview-scheduled",
      "interviewed",
      "offered",
      "rejected",
      "withdrawn",
      "accepted",
    ])
    .withMessage("invalid status"),
];

router.post(
  "/",
  authenticate,
  requireRole(["learner"]),
  requireProfile,
  applyValidation,
  applyToJob
);

router.get(
  "/my/applications",
  authenticate,
  requireRole(["learner"]),
  getMyApplications
);

router.patch(
  "/:id/withdraw",
  authenticate,
  requireRole(["learner"]),
  withdrawApplication
);

router.get(
  "/job/:jobId",
  authenticate,
  requireRole(["employer"]),
  getJobApplications
);

router.patch(
  "/:id/status",
  authenticate,
  requireRole(["employer"]),
  statusUpdateValidation,
  updateApplicationStatus
);

router.get("/:id", authenticate, getApplicationById);

export default router;
