/**
 * Dashboard Controller
 *
 * Handles dashboard data aggregation for learners and recruiters.
 * Provides personalized content and statistics.
 *
 * @module controllers/dashboard
 */

import Job from "../models/job.model.js";
import Application from "../models/application.model.js";
import Article from "../models/article.model.js";
import News from "../models/news.model.js";
import SkillProgram from "../models/skillprogram.model.js";
import Profile from "../models/profile.model.js";
import mongoose from "mongoose";

/**
 * Get learner dashboard data
 * Role: Learner only
 */
export const getLearnerDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await Profile.findOne({ user: userId });

    const applicationStats = await Application.aggregate([
      { $match: { applicant: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const totalApplications = await Application.countDocuments({
      applicant: userId,
    });

    const recentApplications = await Application.find({ applicant: userId })
      .populate("job", "title company location status")
      .sort({ appliedAt: -1 })
      .limit(5);

    const recentJobs = await Job.find({ status: "active" })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .limit(10);

    let recommendedPrograms = [];
    if (profile && profile.skills && profile.skills.length > 0) {
      const userSkills = profile.skills.map((s) => s.name.toLowerCase());

      recommendedPrograms = await SkillProgram.find({
        isActive: true,
        skillsCovered: { $nin: userSkills },
      })
        .sort({ rating: -1, enrollmentCount: -1 })
        .limit(8);
    } else {
      recommendedPrograms = await SkillProgram.find({ isActive: true })
        .sort({ rating: -1, enrollmentCount: -1 })
        .limit(8);
    }

    const recentArticles = await Article.find({ status: "published" })
      .populate("author", "name email")
      .sort({ publishedAt: -1 })
      .limit(10);

    const recentNews = await News.find({ isActive: true })
      .sort({ priority: -1, createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        applicationStats: {
          total: totalApplications,
          byStatus: applicationStats,
        },
        recentApplications,
        recentJobs,
        recommendedPrograms,
        recentArticles,
        recentNews,
        profileCompleteness: profile?.profileCompleteness || 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "failed to fetch dashboard data",
      error: error.message,
    });
  }
};

/**
 * Get recruiter dashboard data
 * Role: Employer only
 */
export const getRecruiterDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const jobStats = await Job.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const totalJobs = await Job.countDocuments({ createdBy: userId });

    const recentJobs = await Job.find({ createdBy: userId })
      .sort({ createdAt: -1 })
      .limit(10);

    const jobIds = await Job.find({ createdBy: userId }).distinct("_id");

    const applicationStats = await Application.aggregate([
      { $match: { job: { $in: jobIds } } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const totalApplications = await Application.countDocuments({
      job: { $in: jobIds },
    });

    const recentApplications = await Application.find({
      job: { $in: jobIds },
    })
      .populate("applicant", "name email")
      .populate("job", "title")
      .sort({ appliedAt: -1 })
      .limit(10);

    const articleStats = await Article.aggregate([
      { $match: { author: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const totalArticles = await Article.countDocuments({ author: userId });

    const recentArticles = await Article.find({ author: userId })
      .sort({ createdAt: -1 })
      .limit(10);

    const articleEngagement = await Article.aggregate([
      {
        $match: {
          author: new mongoose.Types.ObjectId(userId),
          status: "published",
        },
      },
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$viewCount" },
          totalLikes: { $sum: "$likeCount" },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        jobStats: {
          total: totalJobs,
          byStatus: jobStats,
        },
        recentJobs,
        applicationStats: {
          total: totalApplications,
          byStatus: applicationStats,
        },
        recentApplications,
        articleStats: {
          total: totalArticles,
          byStatus: articleStats,
          engagement: articleEngagement[0] || { totalViews: 0, totalLikes: 0 },
        },
        recentArticles,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "failed to fetch dashboard data",
      error: error.message,
    });
  }
};

/**
 * Get dashboard data based on user role
 * Automatically routes to correct dashboard
 */
export const getDashboard = async (req, res) => {
  try {
    if (req.user.role === "learner") {
      return getLearnerDashboard(req, res);
    } else if (req.user.role === "employer") {
      return getRecruiterDashboard(req, res);
    } else {
      return res.status(403).json({
        success: false,
        message: "dashboard not available for this role",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "failed to fetch dashboard",
      error: error.message,
    });
  }
};
