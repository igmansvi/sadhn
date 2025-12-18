import express from "express";
import {
  getMatchedJobs,
  getMatchedPrograms,
  getJobMatchScore,
  getRecommendations,
} from "../controllers/matching.controller.js";
import {
  authenticate,
  requireProfile,
} from "../middlewares/auth.middleware.js";

const matchingRouter = express.Router();

matchingRouter.get("/jobs", authenticate, requireProfile, getMatchedJobs);
matchingRouter.get(
  "/programs",
  authenticate,
  requireProfile,
  getMatchedPrograms
);
matchingRouter.get(
  "/jobs/:jobId/score",
  authenticate,
  requireProfile,
  getJobMatchScore
);
matchingRouter.get(
  "/recommendations",
  authenticate,
  requireProfile,
  getRecommendations
);

export default matchingRouter;
