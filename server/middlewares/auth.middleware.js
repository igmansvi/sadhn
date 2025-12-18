

import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";


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


export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "authentication required" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "access forbidden: insufficient permissions",
      });
    }

    next();
  };
};


export const requireVerifiedEmail = async (req, res, next) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "authentication required" });
    }

    const user = await User.findById(req.user.id);
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "email verification required",
        action: "verify-email",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ success: false, message: "server error" });
  }
};


export const requireProfile = async (req, res, next) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "authentication required" });
    }

    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(403).json({
        success: false,
        message: "profile creation required",
        action: "create-profile",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ success: false, message: "server error" });
  }
};
