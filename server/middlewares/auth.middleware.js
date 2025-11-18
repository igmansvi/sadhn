/**
 * Authentication Middleware
 *
 * Verifies JWT tokens and protects routes requiring authentication.
 * Attaches decoded user information to request object.
 *
 * @module middlewares/auth
 */

import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
import User from "../models/User.model.js";

/**
 * Authenticate user via JWT token
 *
 * @param {Object} req - Express request object
 * @param {Object} req.headers - Request headers
 * @param {string} req.headers.authorization - Bearer token
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
export const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ success: false, message: "access denied" });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "user not found" });
    }

    if (!user.isActive) {
      return res
        .status(403)
        .json({ success: false, message: "account not active" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "token expired" });
    }
    res.status(401).json({ success: false, message: "token not valid" });
  }
};
