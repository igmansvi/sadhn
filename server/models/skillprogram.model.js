/**
 * SkillProgram Model
 *
 * Defines skill development program schema.
 * Aggregates programs from external platforms for recommendations.
 *
 * @module models/SkillProgram
 */

import mongoose from "mongoose";

const skillProgramSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      required: [true, "Platform name is required"],
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Program title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [3000, "Description cannot exceed 3000 characters"],
    },
    url: {
      type: String,
      required: [true, "Program URL is required"],
      match: [/^https?:\/\/.+/, "Please provide a valid URL"],
    },
    skillsCovered: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "expert", "all-levels"],
      required: true,
    },
    duration: {
      value: {
        type: Number,
        required: true,
      },
      unit: {
        type: String,
        enum: ["hours", "days", "weeks", "months"],
        required: true,
      },
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      amount: {
        type: Number,
        default: 0,
      },
      currency: {
        type: String,
        default: "INR",
      },
      isFree: {
        type: Boolean,
        default: false,
      },
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    enrollmentCount: {
      type: Number,
      default: 0,
    },
    language: {
      type: String,
      default: "English",
    },
    certificateOffered: {
      type: Boolean,
      default: false,
    },
    instructor: String,
    prerequisites: [String],
    learningOutcomes: [String],
    tags: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

skillProgramSchema.index({
  title: "text",
  description: "text",
  category: "text",
});
skillProgramSchema.index({ skillsCovered: 1 });
skillProgramSchema.index({ level: 1, category: 1 });
skillProgramSchema.index({ "price.isFree": 1 });

const SkillProgram = mongoose.model("SkillProgram", skillProgramSchema);
export default SkillProgram;
