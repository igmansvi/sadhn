

import express from "express";
import { body } from "express-validator";
import { authenticate, requireRole } from "../middlewares/auth.middleware.js";
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs,
  searchJobs,
} from "../controllers/job.controller.js";

const router = express.Router();

const jobValidation = [
  body("company").trim().notEmpty().withMessage("company name is required"),
  body("title").trim().notEmpty().withMessage("job title is required"),
  body("description").trim().notEmpty().withMessage("description is required"),
  body("employmentType")
    .isIn(["full-time", "part-time", "contract", "internship", "freelance"])
    .withMessage("invalid employment type"),
];

router.get("/", getJobs);
router.get("/search", searchJobs);
router.get("/:id", getJobById);

router.post(
  "/",
  authenticate,
  requireRole(["employer"]),
  jobValidation,
  createJob
);

router.get("/my/jobs", authenticate, requireRole(["employer"]), getMyJobs);

router.put("/:id", authenticate, requireRole(["employer"]), updateJob);

router.delete("/:id", authenticate, requireRole(["employer"]), deleteJob);

export default router;
