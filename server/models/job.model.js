/**
 * Job Model
 *
 * Defines job posting schema for recruiters.
 * Includes job details, requirements, and application tracking.
 *
 * @module models/Job
 */

import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
      maxlength: [5000, "Description cannot exceed 5000 characters"],
    },
    requiredSkills: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        level: {
          type: String,
          enum: ["beginner", "intermediate", "advanced", "expert"],
          default: "intermediate",
        },
      },
    ],
    optionalSkills: [
      {
        type: String,
        trim: true,
      },
    ],
    experienceRequired: {
      min: {
        type: Number,
        default: 0,
        min: 0,
      },
      max: {
        type: Number,
        min: 0,
      },
    },
    salary: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: "INR",
      },
      period: {
        type: String,
        enum: ["hourly", "monthly", "yearly"],
        default: "yearly",
      },
    },
    location: {
      city: String,
      state: String,
      country: {
        type: String,
        default: "India",
      },
    },
    employmentType: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship", "freelance"],
      required: true,
    },
    workMode: {
      type: String,
      enum: ["remote", "onsite", "hybrid"],
      default: "onsite",
    },
    status: {
      type: String,
      enum: ["draft", "active", "closed", "archived"],
      default: "active",
    },
    applicationCount: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    benefits: [String],
    responsibilities: [String],
    qualifications: [String],
    deadlineDate: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

jobSchema.index({ title: "text", description: "text", company: "text" });
jobSchema.index({ createdBy: 1, status: 1 });
jobSchema.index({ status: 1, createdAt: -1 });
jobSchema.index({ "location.city": 1, "location.state": 1 });

const Job = mongoose.model("Job", jobSchema);
export default Job;
