import mongoose from "mongoose";

const profileSummarySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    profileType: {
      type: String,
      enum: ["learner"],
      required: true,
    },
    skills: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
          lowercase: true,
        },
        level: {
          type: String,
          enum: ["beginner", "intermediate", "advanced", "expert"],
        },
        yearsOfExperience: Number,
      },
    ],
    totalExperienceYears: {
      type: Number,
      default: 0,
    },
    location: {
      city: String,
      state: String,
      country: String,
    },
    preferences: {
      jobTypes: [
        {
          type: String,
          enum: [
            "full-time",
            "part-time",
            "contract",
            "internship",
            "freelance",
          ],
        },
      ],
      workModes: [
        {
          type: String,
          enum: ["remote", "onsite", "hybrid"],
        },
      ],
      salaryExpectation: {
        min: Number,
        max: Number,
        currency: String,
      },
      willingToRelocate: Boolean,
      preferredLocations: [String],
    },
    headline: String,
    isAvailableForWork: {
      type: Boolean,
      default: true,
    },
    profileCompleteness: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    companyName: String,
    industryType: String,
    lastSyncedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

profileSummarySchema.index({ "skills.name": 1 });
profileSummarySchema.index({ totalExperienceYears: 1 });
profileSummarySchema.index({ "location.city": 1, "location.state": 1 });
profileSummarySchema.index({ profileType: 1, isAvailableForWork: 1 });
profileSummarySchema.index({ profileCompleteness: -1 });

const ProfileSummary = mongoose.model("ProfileSummary", profileSummarySchema);
export default ProfileSummary;
