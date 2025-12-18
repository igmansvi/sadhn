import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    resume: {
      url: String,
      filename: String,
    },
    coverLetter: {
      type: String,
      maxlength: [2000, "Cover letter cannot exceed 2000 characters"],
    },
    status: {
      type: String,
      enum: [
        "applied",
        "reviewing",
        "shortlisted",
        "interview-scheduled",
        "interviewed",
        "offered",
        "rejected",
        "withdrawn",
        "accepted",
      ],
      default: "applied",
    },
    statusHistory: [
      {
        status: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
        notes: String,
      },
    ],
    recruiterNotes: {
      type: String,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    reviewedAt: Date,
    interviewDate: Date,
    responseDeadline: Date,
  },
  {
    timestamps: true,
  }
);

applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });
applicationSchema.index({ applicant: 1, status: 1 });
applicationSchema.index({ job: 1, status: 1 });
applicationSchema.index({ appliedAt: -1 });

applicationSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
    });

    if (this.status === "reviewing" && !this.reviewedAt) {
      this.reviewedAt = new Date();
    }
  }
  next();
});

const Application = mongoose.model("Application", applicationSchema);
export default Application;
