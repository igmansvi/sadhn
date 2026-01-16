import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import { syncProfileSummary } from "./matching.controller.js";
import { validationResult } from "express-validator";

const allowedUpdates = [
  "headline",
  "summary",
  "phone",
  "location",
  "portfolio",
  "skills",
  "experience",
  "education",
  "languages",
  "profileCompletion",
  "isPublic",
  "certifications",
  "preferences",
];

export const createProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const existingProfile = await Profile.findOne({ user: req.user.id });
    if (existingProfile) {
      return res
        .status(400)
        .json({ success: false, message: "Profile already exists" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!["learner", "employer"].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "Invalid user role for profile creation",
      });
    }

    const profile = await Profile.create({
      user: req.user.id,
      profileType: user.role,
      ...req.body,
    });

    await syncProfileSummary(req.user.id);

    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      profile,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const checkProfileExists = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.role !== "learner") {
      return res.status(200).json({
        success: true,
        exists: true,
        required: false,
      });
    }

    const profile = await Profile.findOne({ user: req.user.id });
    res.status(200).json({
      success: true,
      exists: !!profile,
      required: true,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      "name email role"
    );

    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.userId }).populate(
      "user",
      "name email role"
    );

    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    if (!profile.isPublic) {
      return res
        .status(403)
        .json({ success: false, message: "Profile is private" });
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.role === "employer") {
      const employerData = req.body;
      profile.companyDetails = {
        name: employerData.companyName || profile.companyDetails?.name,
        industry: employerData.industry || profile.companyDetails?.industry,
        size: employerData.companySize || profile.companyDetails?.size,
        website: employerData.website || profile.companyDetails?.website,
        description:
          employerData.companyDescription ||
          profile.companyDetails?.description,
      };
      profile.location = {
        city: employerData.locationCity || profile.location?.city,
        state: employerData.locationState || profile.location?.state,
        country: employerData.locationCountry || profile.location?.country,
      };
      profile.phone = employerData.contactPhone || profile.phone;
      profile.portfolio = {
        ...profile.portfolio,
        linkedin: employerData.linkedin || profile.portfolio?.linkedin,
      };
    } else {
      Object.keys(req.body).forEach((key) => {
        if (allowedUpdates.includes(key)) {
          profile[key] = req.body[key];
        }
      });
    }

    await profile.save();
    await syncProfileSummary(req.user.id);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findOneAndDelete({ user: req.user.id });

    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile deleted successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const searchProfiles = async (req, res) => {
  try {
    if (!["employer", "admin"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Only employers and admins can search profiles",
      });
    }

    const {
      skills,
      location,
      profileType,
      minExperience,
      page = 1,
      limit = 10,
    } = req.query;

    const query = { isPublic: true };

    if (profileType) {
      query.profileType = profileType;
    }

    if (skills) {
      const skillArray = skills.split(",").map((s) => s.trim());
      query["skills.name"] = { $in: skillArray };
    }

    if (location) {
      query.$or = [
        { "location.city": { $regex: location, $options: "i" } },
        { "location.state": { $regex: location, $options: "i" } },
        { "location.country": { $regex: location, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const profiles = await Profile.find(query)
      .populate("user", "name email role")
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ profileCompletion: -1, updatedAt: -1 });

    const total = await Profile.countDocuments(query);

    res.status(200).json({
      success: true,
      count: profiles.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      profiles,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const addSkill = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const user = await User.findById(req.user.id);
    if (!user || user.role !== "learner") {
      return res.status(403).json({
        success: false,
        message: "Only learners can manage skills",
      });
    }

    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    profile.skills.push(req.body);
    await profile.save();
    await syncProfileSummary(req.user.id);

    res.status(200).json({
      success: true,
      message: "Skill added successfully",
      profile,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const updateSkill = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    const index = parseInt(req.params.index);
    if (index < 0 || index >= profile.skills.length) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid skill index" });
    }

    Object.assign(profile.skills[index], req.body);
    await profile.save();
    await syncProfileSummary(req.user.id);

    res.status(200).json({
      success: true,
      message: "Skill updated successfully",
      profile,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const removeSkill = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    const index = parseInt(req.params.index);
    if (index < 0 || index >= profile.skills.length) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid skill index" });
    }

    profile.skills.splice(index, 1);
    await profile.save();
    await syncProfileSummary(req.user.id);

    res.status(200).json({
      success: true,
      message: "Skill removed successfully",
      profile,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const addExperience = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const user = await User.findById(req.user.id);
    if (!user || user.role !== "learner") {
      return res.status(403).json({
        success: false,
        message: "Only learners can manage experience",
      });
    }

    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    profile.experience.push(req.body);
    await profile.save();
    await syncProfileSummary(req.user.id);

    res.status(200).json({
      success: true,
      message: "Experience added successfully",
      profile,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const updateExperience = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    const index = parseInt(req.params.index);
    if (index < 0 || index >= profile.experience.length) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid experience index" });
    }

    Object.assign(profile.experience[index], req.body);
    await profile.save();
    await syncProfileSummary(req.user.id);

    res.status(200).json({
      success: true,
      message: "Experience updated successfully",
      profile,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const removeExperience = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    const index = parseInt(req.params.index);
    if (index < 0 || index >= profile.experience.length) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid experience index" });
    }

    profile.experience.splice(index, 1);
    await profile.save();
    await syncProfileSummary(req.user.id);

    res.status(200).json({
      success: true,
      message: "Experience removed successfully",
      profile,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const addEducation = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    profile.education.push(req.body);
    await profile.save();
    await syncProfileSummary(req.user.id);

    res.status(200).json({
      success: true,
      message: "Education added successfully",
      profile,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const updateEducation = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    const index = parseInt(req.params.index);
    if (index < 0 || index >= profile.education.length) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid education index" });
    }

    Object.assign(profile.education[index], req.body);
    await profile.save();
    await syncProfileSummary(req.user.id);

    res.status(200).json({
      success: true,
      message: "Education updated successfully",
      profile,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const removeEducation = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    const index = parseInt(req.params.index);
    if (index < 0 || index >= profile.education.length) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid education index" });
    }

    profile.education.splice(index, 1);
    await profile.save();
    await syncProfileSummary(req.user.id);

    res.status(200).json({
      success: true,
      message: "Education removed successfully",
      profile,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const addCertification = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    profile.certifications.push(req.body);
    await profile.save();

    res.status(200).json({
      success: true,
      message: "Certification added successfully",
      profile,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const updateCertification = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    const index = parseInt(req.params.index);
    if (index < 0 || index >= profile.certifications.length) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid certification index" });
    }

    profile.certifications[index] = {
      ...profile.certifications[index],
      ...req.body,
    };
    await profile.save();

    res.status(200).json({
      success: true,
      message: "Certification updated successfully",
      profile,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const removeCertification = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    const index = parseInt(req.params.index);
    if (index < 0 || index >= profile.certifications.length) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid certification index" });
    }

    profile.certifications.splice(index, 1);
    await profile.save();

    res.status(200).json({
      success: true,
      message: "Certification removed successfully",
      profile,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const getProfileCompletion = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    const completion = {
      overall: profile.profileCompletion,
      sections: {
        headline: !!profile.headline,
        summary: !!profile.summary,
        location: !!profile.location?.city,
        phone: !!profile.phone,
        skills: profile.skills?.length > 0,
        experience: profile.experience?.length > 0,
        education: profile.education?.length > 0,
        certifications: profile.certifications?.length > 0,
        portfolio: !!profile.portfolio?.linkedin || !!profile.portfolio?.github,
        preferences: profile.preferences?.jobTypes?.length > 0,
      },
    };

    res.status(200).json({
      success: true,
      completion,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
