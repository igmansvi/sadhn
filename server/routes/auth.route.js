

import express from "express";
import { body } from "express-validator";
import {
  register,
  login,
  getUser,
  sendVerificationEmail,
  verifyEmail,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
    body("role")
      .optional()
      .isIn(["learner", "employer"])
      .withMessage("Invalid role"),
  ],
  register
);

authRouter.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  login
);

authRouter.get("/getUser", authenticate, getUser);

authRouter.post(
  "/send-verification-email",
  authenticate,
  sendVerificationEmail
);

authRouter.get("/verify-email/:token", verifyEmail);

authRouter.post(
  "/forgot-password",
  [body("email").isEmail().withMessage("Please provide a valid email")],
  forgotPassword
);

authRouter.post(
  "/reset-password/:token",
  [
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
  ],
  resetPassword
);

export default authRouter;
