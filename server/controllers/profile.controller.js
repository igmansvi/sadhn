/**
 * Profile Controller
 *
 * Handles profile operations including CRUD, skills, experience,
 * education, certifications, and resume management.
 *
 * @module controllers/profile
 */

import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import { validationResult } from "express-validator";

/**
 * Create new profile
 *
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user from middleware
 * @param {Object} req.body - Profile data
 * @param {Object} res - Express response object
 * @returns {Object} Created profile
 */
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

    const profile = await Profile.create({
      user: req.user.id,
      profileType: user.role,
      ...req.body,
    });

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

/**
 * Get authenticated user's profile
 *
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user from middleware
 * @param {Object} res - Express response object
 * @returns {Object} User profile
 */
export const getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
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

/**
 * Get profile by user ID
 *
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.userId - User ID
 * @param {Object} res - Express response object
 * @returns {Object} User profile (if public)
 */
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

/**
 * Update profile
 *
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user from middleware
 * @param {Object} req.body - Updated profile data
 * @param {Object} res - Express response object
 * @returns {Object} Updated profile
 */
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

    const allowedUpdates = [
      "headline",
      "summary",
      "location",
      "phone",
      "languages",
      "portfolio",
      "preferences",
      "companyDetails",
      "isPublic",
    ];

    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        profile[key] = req.body[key];
      }
    });

    await profile.save();

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

/**
 * Delete profile
 *
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user from middleware
 * @param {Object} res - Express response object
 * @returns {Object} Success message
 */
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

/**
 * Search profiles
 *
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {Object} res - Express response object
 * @returns {Object} Array of matching profiles
 */
export const searchProfiles = async (req, res) => {
  try {
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

/**
 * Add skill to profile
 *
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user from middleware
 * @param {Object} req.body - Skill data
 * @param {Object} res - Express response object
 * @returns {Object} Updated profile
 */
export const addSkill = async (req, res) => {
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

    profile.skills.push(req.body);
    await profile.save();

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

/**
 * Update skill in profile
 *
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user from middleware
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.index - Skill index
 * @param {Object} req.body - Updated skill data
 * @param {Object} res - Express response object
 * @returns {Object} Updated profile
 */
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

/**
 * Remove skill from profile
 *
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user from middleware
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.index - Skill index
 * @param {Object} res - Express response object
 * @returns {Object} Updated profile
 */
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

/**
 * Add experience to profile
 *
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user from middleware
 * @param {Object} req.body - Experience data
 * @param {Object} res - Express response object
 * @returns {Object} Updated profile
 */
export const addExperience = async (req, res) => {
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

    profile.experience.push(req.body);
    await profile.save();

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

/**
 * Update experience in profile
 *
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user from middleware
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.index - Experience index
 * @param {Object} req.body - Updated experience data
 * @param {Object} res - Express response object
 * @returns {Object} Updated profile
 */
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

/**
 * Remove experience from profile
 *
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user from middleware
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.index - Experience index
 * @param {Object} res - Express response object
 * @returns {Object} Updated profile
 */
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

/**
 * Add education to profile
 *
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user from middleware
 * @param {Object} req.body - Education data
 * @param {Object} res - Express response object
 * @returns {Object} Updated profile
 */
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

/**
 * Update education in profile
 *
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user from middleware
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.index - Education index
 * @param {Object} req.body - Updated education data
 * @param {Object} res - Express response object
 * @returns {Object} Updated profile
 */
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

/**
 * Remove education from profile
 *
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user from middleware
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.index - Education index
 * @param {Object} res - Express response object
 * @returns {Object} Updated profile
 */
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

/**
 * Add certification to profile
 *
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user from middleware
 * @param {Object} req.body - Certification data
 * @param {Object} res - Express response object
 * @returns {Object} Updated profile
 */
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

/**
 * Update certification in profile
 *
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user from middleware
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.index - Certification index
 * @param {Object} req.body - Updated certification data
 * @param {Object} res - Express response object
 * @returns {Object} Updated profile
 */
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

/**
 * Remove certification from profile
 *
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user from middleware
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.index - Certification index
 * @param {Object} res - Express response object
 * @returns {Object} Updated profile
 */
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

/**
 * Get profile completion status
 *
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user from middleware
 * @param {Object} res - Express response object
 * @returns {Object} Profile completion details
 */
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
