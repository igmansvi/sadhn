/**
 * User Model
 *
 * Defines the user schema and methods for authentication.
 * Includes password hashing, token generation, and email verification.
 *
 * @module models/User
 */

import { config } from "../config/env.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["learner", "employer", "admin"],
      default: "learner",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    verificationToken: {
      type: String,
      select: false,
    },
    verificationTokenExpire: {
      type: Date,
      select: false,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpire: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Compare provided password with hashed password
 *
 * @param {string} userPassword - Plain text password to compare
 * @returns {Promise<boolean>} True if passwords match, false otherwise
 */
userSchema.methods.comparePassword = async function (userPassword) {
  try {
    return await bcrypt.compare(userPassword, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Generate JWT authentication token
 *
 * @returns {string} JWT token containing user id, email, and role
 */
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role,
    },
    config.JWT_SECRET,
    {
      expiresIn: config.JWT_EXPIRE,
    }
  );
  return token;
};

/**
 * Generate email verification token
 *
 * @returns {string} JWT token for email verification (valid for 24 hours)
 */
userSchema.methods.generateVerificationToken = function () {
  const token = jwt.sign({ id: this._id }, config.JWT_SECRET, {
    expiresIn: "24h",
  });
  this.verificationToken = token;
  this.verificationTokenExpire = Date.now() + 24 * 60 * 60 * 1000;
  return token;
};

/**
 * Generate password reset token
 *
 * @returns {string} JWT token for password reset (valid for 1 hour)
 */
userSchema.methods.generateResetPasswordToken = function () {
  const token = jwt.sign({ id: this._id }, config.JWT_SECRET, {
    expiresIn: "1h",
  });
  this.resetPasswordToken = token;
  this.resetPasswordExpire = Date.now() + 60 * 60 * 1000;
  return token;
};

userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ isVerified: 1, isActive: 1 });
userSchema.index({ email: 1, isActive: 1 });

const User = mongoose.model("User", userSchema);

export default User;
