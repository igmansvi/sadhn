import Application from "../models/application.model.js";
import Job from "../models/job.model.js";
import mongoose from "mongoose";
import { validationResult } from "express-validator";

export const applyToJob = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    if (!["learner", "admin"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Only learners and admins can apply to jobs",
      });
    }

    const { jobId, coverLetter, resume } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "job not found",
      });
    }

    if (job.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "job is not accepting applications",
      });
    }

    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user.id,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "already applied to this job",
      });
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user.id,
      coverLetter,
      resume,
    });

    job.applicationCount += 1;
    await job.save();

    await application.populate([
      { path: "job", select: "title company location" },
      { path: "applicant", select: "name email" },
    ]);

    res.status(201).json({
      success: true,
      message: "application submitted successfully",
      data: application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "failed to submit application",
      error: error.message,
    });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    if (!["learner", "admin"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Only learners and admins can view their applications",
      });
    }

    const {
      status,
      page = 1,
      limit = 20,
      sortBy = "appliedAt",
      sortOrder = "desc",
    } = req.query;

    const query = { applicant: req.user.id };
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    const applications = await Application.find(query)
      .populate(
        "job",
        "title company location employmentType workMode salary status"
      )
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Application.countDocuments(query);

    res.json({
      success: true,
      data: applications,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "failed to fetch applications",
      error: error.message,
    });
  }
};

export const getEmployerApplications = async (req, res) => {
  try {
    const {
      status,
      page = 1,
      limit = 20,
      sortBy = "appliedAt",
      sortOrder = "desc",
    } = req.query;

    const employerJobs = await Job.find({ createdBy: req.user.id }).select(
      "_id"
    );
    const jobIds = employerJobs.map((job) => job._id);

    const query = { job: { $in: jobIds } };
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    const applications = await Application.find(query)
      .populate("job", "title company location employmentType")
      .populate("applicant", "name email")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const Profile = (await import("../models/profile.model.js")).default;
    const applicantIds = applications.map((app) => app.applicant._id);
    const profiles = await Profile.find({ user: { $in: applicantIds } }).select(
      "user headline summary location phone skills experience education portfolio"
    );
    const profileMap = {};
    profiles.forEach((p) => {
      profileMap[p.user.toString()] = p;
    });

    const applicationsWithProfiles = applications.map((app) => {
      const appObj = app.toObject();
      appObj.profile = profileMap[app.applicant._id.toString()] || null;
      return appObj;
    });

    const total = await Application.countDocuments(query);

    const statusCounts = await Application.aggregate([
      { $match: query },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      data: applicationsWithProfiles,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
      statusCounts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "failed to fetch applications",
      error: error.message,
    });
  }
};

export const getJobApplications = async (req, res) => {
  try {
    if (!["employer", "admin"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Only employers and admins can view job applications",
      });
    }

    const { jobId } = req.params;
    const {
      status,
      page = 1,
      limit = 20,
      sortBy = "appliedAt",
      sortOrder = "desc",
    } = req.query;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "job not found",
      });
    }

    if (job.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "not authorized to view applications for this job",
      });
    }

    const query = { job: jobId };
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    const applications = await Application.find(query)
      .populate("job", "title company location employmentType")
      .populate("applicant", "name email")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const Profile = (await import("../models/profile.model.js")).default;
    const applicantIds = applications.map((app) => app.applicant._id);
    const profiles = await Profile.find({ user: { $in: applicantIds } }).select(
      "user headline summary location phone skills experience education portfolio"
    );
    const profileMap = {};
    profiles.forEach((p) => {
      profileMap[p.user.toString()] = p;
    });

    const applicationsWithProfiles = applications.map((app) => {
      const appObj = app.toObject();
      appObj.profile = profileMap[app.applicant._id.toString()] || null;
      return appObj;
    });

    const total = await Application.countDocuments(query);

    const statusCounts = await Application.aggregate([
      { $match: { job: job._id } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      data: applicationsWithProfiles,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
      statusCounts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "failed to fetch applications",
      error: error.message,
    });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    if (!["employer", "admin"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Only employers and admins can update application status",
      });
    }

    const { id } = req.params;
    const { status, recruiterNotes, interviewDate } = req.body;

    const application = await Application.findById(id).populate("job");
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "application not found",
      });
    }

    if (application.job.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "not authorized to update this application",
      });
    }

    if (status) application.status = status;
    if (recruiterNotes) application.recruiterNotes = recruiterNotes;
    if (interviewDate) application.interviewDate = interviewDate;

    await application.save();

    await application.populate("applicant", "name email");

    res.json({
      success: true,
      message: "application updated successfully",
      data: application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "failed to update application",
      error: error.message,
    });
  }
};

export const withdrawApplication = async (req, res) => {
  try {
    if (!["learner", "admin"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Only learners and admins can withdraw applications",
      });
    }

    const { id } = req.params;

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "application not found",
      });
    }

    if (application.applicant.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "not authorized to withdraw this application",
      });
    }

    if (application.status === "withdrawn") {
      return res.status(400).json({
        success: false,
        message: "application already withdrawn",
      });
    }

    application.status = "withdrawn";
    await application.save();

    res.json({
      success: true,
      message: "application withdrawn successfully",
      data: application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "failed to withdraw application",
      error: error.message,
    });
  }
};

export const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Application.findById(id)
      .populate("job", "title company location employmentType workMode salary")
      .populate("applicant", "name email");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "application not found",
      });
    }

    const job = await Job.findById(application.job._id);
    const isApplicant = application.applicant._id.toString() === req.user.id;
    const isJobOwner = job.createdBy.toString() === req.user.id;

    if (!isApplicant && !isJobOwner) {
      return res.status(403).json({
        success: false,
        message: "not authorized to view this application",
      });
    }

    res.json({
      success: true,
      data: application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "failed to fetch application",
      error: error.message,
    });
  }
};
