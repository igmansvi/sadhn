

import express from "express";
import { body } from "express-validator";
import { authenticate, requireRole } from "../middlewares/auth.middleware.js";
import {
  createSkillProgram,
  getSkillPrograms,
  getSkillProgramById,
  updateSkillProgram,
  deleteSkillProgram,
  searchSkillPrograms,
  getSkillProgramsBySkills,
} from "../controllers/skillprogram.controller.js";

const router = express.Router();

const skillProgramValidation = [
  body("platform").trim().notEmpty().withMessage("platform is required"),
  body("title").trim().notEmpty().withMessage("title is required"),
  body("description").trim().notEmpty().withMessage("description is required"),
  body("url").isURL().withMessage("valid URL is required"),
  body("skillsCovered")
    .isArray({ min: 1 })
    .withMessage("at least one skill is required"),
  body("level")
    .isIn(["beginner", "intermediate", "advanced", "expert", "all-levels"])
    .withMessage("invalid level"),
];

router.get("/", getSkillPrograms);
router.get("/search", searchSkillPrograms);
router.get("/:id", getSkillProgramById);
router.post("/by-skills", getSkillProgramsBySkills);

router.post(
  "/",
  authenticate,
  requireRole(["admin", "employer"]),
  skillProgramValidation,
  createSkillProgram
);

router.put(
  "/:id",
  authenticate,
  requireRole(["admin", "employer"]),
  updateSkillProgram
);

router.delete(
  "/:id",
  authenticate,
  requireRole(["admin", "employer"]),
  deleteSkillProgram
);

export default router;
