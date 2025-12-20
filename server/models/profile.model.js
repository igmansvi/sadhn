import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "expert"],
      required: true,
    },
    yearsOfExperience: {
      type: Number,
      min: 0,
      max: 50,
    },
    lastUsed: Date,
    certifications: [String],
  },
  { _id: false }
);

const experienceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    location: String,
    startDate: {
      type: Date,
      required: true,
    },
    endDate: Date,
    isCurrent: {
      type: Boolean,
      default: false,
    },
    description: String,
    skills: [String],
  },
  { _id: false }
);

const educationSchema = new mongoose.Schema(
  {
    degree: {
      type: String,
      required: true,
      trim: true,
    },
    institution: {
      type: String,
      required: true,
      trim: true,
    },
    field: String,
    startDate: Date,
    endDate: Date,
    grade: String,
  },
  { _id: false }
);

const certificationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    issuer: String,
    issueDate: Date,
    expiryDate: Date,
    credentialId: String,
    url: String,
  },
  { _id: false }
);

const profileSchema = new mongoose.Schema(
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
    headline: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    summary: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    location: {
      city: String,
      state: String,
      country: String,
    },
    phone: {
      type: String,
      trim: true,
    },
    skills: [skillSchema],
    experience: [experienceSchema],
    education: [educationSchema],
    certifications: [certificationSchema],
    languages: [
      {
        name: String,
        proficiency: {
          type: String,
          enum: ["basic", "conversational", "fluent", "native"],
        },
      },
    ],
    portfolio: {
      website: String,
      github: String,
      linkedin: String,
      other: [String],
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
      workMode: [
        {
          type: String,
          enum: ["remote", "onsite", "hybrid"],
        },
      ],
      expectedSalary: {
        min: Number,
        max: Number,
        currency: {
          type: String,
          default: "INR",
        },
      },
      availableFrom: Date,
      willingToRelocate: {
        type: Boolean,
        default: false,
      },
      preferredLocations: [String],
    },
    companyDetails: {
      name: String,
      industry: String,
      size: {
        type: String,
        enum: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"],
      },
      website: String,
      description: String,
    },
    resume: {
      url: String,
      uploadedAt: Date,
    },
    profileCompletion: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

profileSchema.methods.calculateCompletion = function () {
  let score = 0;
  const weights = {
    headline: 5,
    summary: 10,
    location: 5,
    phone: 5,
    skills: 20,
    experience: 20,
    education: 15,
    certifications: 5,
    portfolio: 10,
    preferences: 5,
  };

  if (this.headline) score += weights.headline;
  if (this.summary) score += weights.summary;
  if (this.location?.city) score += weights.location;
  if (this.phone) score += weights.phone;
  if (this.skills?.length > 0) score += weights.skills;
  if (this.experience?.length > 0) score += weights.experience;
  if (this.education?.length > 0) score += weights.education;
  if (this.certifications?.length > 0) score += weights.certifications;
  if (this.portfolio?.linkedin || this.portfolio?.github)
    score += weights.portfolio;
  if (this.preferences?.jobTypes?.length > 0) score += weights.preferences;

  return Math.round(score);
};

profileSchema.pre("save", function (next) {
  this.profileCompletion = this.calculateCompletion();
  next();
});

profileSchema.index({ profileType: 1, isPublic: 1 });
profileSchema.index({ "skills.name": 1 });
profileSchema.index({ "location.city": 1, "location.state": 1 });
profileSchema.index({ profileCompletion: -1 });
profileSchema.index({ user: 1, profileType: 1 });

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
