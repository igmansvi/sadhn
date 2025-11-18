/**
 * Authentication Routes
 *
 * Defines API endpoints for user authentication operations:
 * - POST /register - Register new user
 * - POST /login - Login user
 * - GET /getUser - Get authenticated user (protected)
 * - POST /send-verification-email - Send email verification (protected)
 * - GET /verify-email/:token - Verify email with token
 * - POST /forgot-password - Request password reset
 * - POST /reset-password/:token - Reset password with token
 *
 * @module routes/auth
 */

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
