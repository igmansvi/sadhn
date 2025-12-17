/**
 * Article Model
 *
 * Defines article schema for recruiter-written content.
 * Supports drafts, publishing, and categorization.
 *
 * @module models/Article
 */

import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Article title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    content: {
      type: String,
      required: [true, "Article content is required"],
      maxlength: [50000, "Content cannot exceed 50000 characters"],
    },
    excerpt: {
      type: String,
      maxlength: [500, "Excerpt cannot exceed 500 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "career-advice",
        "industry-trends",
        "skill-development",
        "interview-tips",
        "workplace-culture",
        "technology",
        "job-market",
        "other",
      ],
      default: "other",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    publishedAt: Date,
    featuredImage: String,
    readTime: {
      type: Number,
      default: 5,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

articleSchema.index({ title: "text", content: "text", tags: "text" });
articleSchema.index({ author: 1, status: 1 });
articleSchema.index({ status: 1, publishedAt: -1 });
articleSchema.index({ category: 1, status: 1 });

articleSchema.pre("save", function (next) {
  if (
    this.isModified("status") &&
    this.status === "published" &&
    !this.publishedAt
  ) {
    this.publishedAt = new Date();
  }
  next();
});

const Article = mongoose.model("Article", articleSchema);
export default Article;
