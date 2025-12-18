import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "News title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    content: {
      type: String,
      required: [true, "News content is required"],
      maxlength: [10000, "Content cannot exceed 10000 characters"],
    },
    category: {
      type: String,
      required: true,
      enum: [
        "announcement",
        "update",
        "policy",
        "event",
        "achievement",
        "general",
      ],
      default: "general",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    publishedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiryDate: Date,
    featuredImage: String,
  },
  {
    timestamps: true,
  }
);

newsSchema.index({ title: "text", content: "text" });
newsSchema.index({ isActive: 1, priority: -1, createdAt: -1 });
newsSchema.index({ category: 1, isActive: 1 });

const News = mongoose.model("News", newsSchema);
export default News;
