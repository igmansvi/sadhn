import Job from "../models/job.model.js";
import Application from "../models/application.model.js";
import Article from "../models/article.model.js";
import News from "../models/news.model.js";
import SkillProgram from "../models/skillprogram.model.js";
import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

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
        hasProfile: !!profile,
        profileCompletion: profile?.profileCompletion || 0,
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
          engagement: articleEngagement[0] || { totalLikes: 0 },
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

export const getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({
      isActive: true,
      role: { $ne: "admin" },
    });
    const usersByRole = await User.aggregate([
      { $match: { isActive: true, role: { $ne: "admin" } } },
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]);

    const learnerCount =
      usersByRole.find((r) => r._id === "learner")?.count || 0;
    const employerCount =
      usersByRole.find((r) => r._id === "employer")?.count || 0;

    const activeJobs = await Job.countDocuments({ status: "active" });
    const draftJobs = await Job.countDocuments({ status: "draft" });

    const publishedArticles = await Article.countDocuments({
      status: "published",
    });

    const activeApplications = await Application.countDocuments({
      status: { $in: ["pending", "reviewing"] },
    });

    const skillPrograms = await SkillProgram.countDocuments({ isActive: true });

    const activeNews = await News.countDocuments({ isActive: true });

    res.json({
      success: true,
      data: {
        totalUsers,
        activeJobs,
        publishedArticles,
        skillPrograms,
        learnerCount,
        employerCount,
        activeApplications,
        draftJobs,
        activeNews,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "failed to fetch admin dashboard",
      error: error.message,
    });
  }
};

export const getDashboard = async (req, res) => {
  try {
    if (req.user.role === "learner") {
      const profile = await Profile.findOne({ user: req.user.id });
      if (!profile) {
        return res.status(403).json({
          success: false,
          message: "profile creation required",
          action: "create-profile",
        });
      }
      return getLearnerDashboard(req, res);
    } else if (req.user.role === "employer") {
      return getRecruiterDashboard(req, res);
    } else if (req.user.role === "admin") {
      return getAdminDashboard(req, res);
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
