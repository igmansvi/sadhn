import express from "express";
import { body } from "express-validator";
import {
  createProfile,
  getMyProfile,
  getProfileById,
  updateProfile,
  deleteProfile,
  searchProfiles,
  addSkill,
  updateSkill,
  removeSkill,
  addExperience,
  updateExperience,
  removeExperience,
  addEducation,
  updateEducation,
  removeEducation,
  addCertification,
  updateCertification,
  removeCertification,
  getProfileCompletion,
  checkProfileExists,
} from "../controllers/profile.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const profileRouter = express.Router();

profileRouter.post(
  "/",
  authenticate,
  [
    body("headline")
      .optional()
      .trim()
      .isLength({ max: 120 })
      .withMessage("Headline must be less than 120 characters"),
    body("summary")
      .optional()
      .trim()
      .isLength({ max: 2000 })
      .withMessage("Summary must be less than 2000 characters"),
    body("phone").optional().trim(),
    body("companyName").optional().trim(),
    body("companyDescription").optional().trim().isLength({ max: 2000 }),
    body("industry").optional().trim(),
    body("companySize").optional().trim(),
    body("foundedYear")
      .optional()
      .isInt({ min: 1800, max: new Date().getFullYear() }),
    body("website").optional().isURL(),
    body("locationCity").optional().trim(),
    body("locationState").optional().trim(),
    body("locationCountry").optional().trim(),
    body("contactEmail").optional().isEmail(),
    body("contactPhone").optional().trim(),
    body("linkedin").optional().isURL(),
    body("twitter").optional().isURL(),
  ],
  createProfile
);

profileRouter.get("/me", authenticate, getMyProfile);

profileRouter.get("/exists", authenticate, checkProfileExists);

profileRouter.get("/search", searchProfiles);

profileRouter.get("/completion", authenticate, getProfileCompletion);

profileRouter.get("/:userId", getProfileById);

profileRouter.put(
  "/",
  authenticate,
  [
    body("headline")
      .optional()
      .trim()
      .isLength({ max: 120 })
      .withMessage("Headline must be less than 120 characters"),
    body("summary")
      .optional()
      .trim()
      .isLength({ max: 2000 })
      .withMessage("Summary must be less than 2000 characters"),
    body("companyName").optional().trim(),
    body("companyDescription").optional().trim().isLength({ max: 2000 }),
    body("industry").optional().trim(),
    body("companySize").optional().trim(),
    body("foundedYear")
      .optional()
      .isInt({ min: 1800, max: new Date().getFullYear() }),
    body("website").optional().isURL(),
    body("locationCity").optional().trim(),
    body("locationState").optional().trim(),
    body("locationCountry").optional().trim(),
    body("contactEmail").optional().isEmail(),
    body("contactPhone").optional().trim(),
    body("linkedin").optional().isURL(),
    body("twitter").optional().isURL(),
  ],
  updateProfile
);

profileRouter.delete("/", authenticate, deleteProfile);

profileRouter.post(
  "/skills",
  authenticate,
  [
    body("name").trim().notEmpty().withMessage("Skill name is required"),
    body("level")
      .isIn(["beginner", "intermediate", "advanced", "expert"])
      .withMessage("Invalid skill level"),
    body("yearsOfExperience")
      .optional()
      .isInt({ min: 0, max: 50 })
      .withMessage("Years of experience must be between 0 and 50"),
  ],
  addSkill
);

profileRouter.put(
  "/skills/:index",
  authenticate,
  [
    body("name")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Skill name is required"),
    body("level")
      .optional()
      .isIn(["beginner", "intermediate", "advanced", "expert"])
      .withMessage("Invalid skill level"),
    body("yearsOfExperience")
      .optional()
      .isInt({ min: 0, max: 50 })
      .withMessage("Years of experience must be between 0 and 50"),
  ],
  updateSkill
);

profileRouter.delete("/skills/:index", authenticate, removeSkill);

profileRouter.post(
  "/experience",
  authenticate,
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("company").trim().notEmpty().withMessage("Company is required"),
    body("startDate").isISO8601().withMessage("Valid start date is required"),
    body("endDate")
      .optional()
      .isISO8601()
      .withMessage("Valid end date is required"),
    body("isCurrent")
      .optional()
      .isBoolean()
      .withMessage("isCurrent must be boolean"),
  ],
  addExperience
);

profileRouter.put(
  "/experience/:index",
  authenticate,
  [
    body("title").optional().trim().notEmpty().withMessage("Title is required"),
    body("company")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Company is required"),
    body("startDate")
      .optional()
      .isISO8601()
      .withMessage("Valid start date is required"),
    body("endDate")
      .optional()
      .isISO8601()
      .withMessage("Valid end date is required"),
  ],
  updateExperience
);

profileRouter.delete("/experience/:index", authenticate, removeExperience);

profileRouter.post(
  "/education",
  authenticate,
  [
    body("degree").trim().notEmpty().withMessage("Degree is required"),
    body("institution")
      .trim()
      .notEmpty()
      .withMessage("Institution is required"),
    body("startDate")
      .optional()
      .isISO8601()
      .withMessage("Valid start date is required"),
    body("endDate")
      .optional()
      .isISO8601()
      .withMessage("Valid end date is required"),
  ],
  addEducation
);

profileRouter.put(
  "/education/:index",
  authenticate,
  [
    body("degree")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Degree is required"),
    body("institution")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Institution is required"),
    body("startDate")
      .optional()
      .isISO8601()
      .withMessage("Valid start date is required"),
    body("endDate")
      .optional()
      .isISO8601()
      .withMessage("Valid end date is required"),
  ],
  updateEducation
);

profileRouter.delete("/education/:index", authenticate, removeEducation);

profileRouter.post(
  "/certifications",
  authenticate,
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Certification name is required"),
    body("issueDate")
      .optional()
      .isISO8601()
      .withMessage("Valid issue date is required"),
    body("expiryDate")
      .optional()
      .isISO8601()
      .withMessage("Valid expiry date is required"),
  ],
  addCertification
);

profileRouter.put(
  "/certifications/:index",
  authenticate,
  [
    body("name")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Certification name is required"),
    body("issueDate")
      .optional()
      .isISO8601()
      .withMessage("Valid issue date is required"),
    body("expiryDate")
      .optional()
      .isISO8601()
      .withMessage("Valid expiry date is required"),
  ],
  updateCertification
);

profileRouter.delete(
  "/certifications/:index",
  authenticate,
  removeCertification
);

export default profileRouter;
