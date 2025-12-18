

import Job from "../models/job.model.js";
import mongoose from "mongoose";
import { validationResult } from "express-validator";


export const createJob = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const jobData = {
      ...req.body,
      createdBy: req.user.id,
    };

    const job = await Job.create(jobData);
    await job.populate("createdBy", "name email");

    res.status(201).json({
      success: true,
      message: "job created successfully",
      data: job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "failed to create job",
      error: error.message,
    });
  }
};


export const getJobs = async (req, res) => {
  try {
    const {
      status = "active",
      employmentType,
      workMode,
      location,
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = { status };

    if (employmentType) query.employmentType = employmentType;
    if (workMode) query.workMode = workMode;
    if (location) {
      query.$or = [
        { "location.city": new RegExp(location, "i") },
        { "location.state": new RegExp(location, "i") },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    const jobs = await Job.find(query)
      .populate("createdBy", "name email")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(query);

    res.json({
      success: true,
      data: jobs,
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
      message: "failed to fetch jobs",
      error: error.message,
    });
  }
};


export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "job not found",
      });
    }

    job.viewCount += 1;
    await job.save();

    res.json({
      success: true,
      data: job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "failed to fetch job",
      error: error.message,
    });
  }
};


export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "job not found",
      });
    }

    if (job.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "not authorized to update this job",
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("createdBy", "name email");

    res.json({
      success: true,
      message: "job updated successfully",
      data: updatedJob,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "failed to update job",
      error: error.message,
    });
  }
};


export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "job not found",
      });
    }

    if (job.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "not authorized to delete this job",
      });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "job deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "failed to delete job",
      error: error.message,
    });
  }
};


export const getMyJobs = async (req, res) => {
  try {
    const {
      status,
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = { createdBy: req.user.id };
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    const jobs = await Job.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(query);

    res.json({
      success: true,
      data: jobs,
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
      message: "failed to fetch jobs",
      error: error.message,
    });
  }
};


export const searchJobs = async (req, res) => {
  try {
    const {
      q,
      skills,
      minExperience,
      maxExperience,
      employmentType,
      workMode,
      location,
      minSalary,
      page = 1,
      limit = 20,
    } = req.query;

    const query = { status: "active" };

    if (q) {
      query.$text = { $search: q };
    }

    if (skills) {
      const skillArray = skills.split(",").map((s) => s.trim());
      query["requiredSkills.name"] = { $in: skillArray };
    }

    if (minExperience || maxExperience) {
      query["experienceRequired.min"] = {};
      if (minExperience)
        query["experienceRequired.min"].$lte = parseInt(minExperience);
      if (maxExperience)
        query["experienceRequired.max"].$gte = parseInt(maxExperience);
    }

    if (employmentType) {
      query.employmentType = employmentType;
    }

    if (workMode) {
      query.workMode = workMode;
    }

    if (location) {
      query.$or = [
        { "location.city": new RegExp(location, "i") },
        { "location.state": new RegExp(location, "i") },
      ];
    }

    if (minSalary) {
      query["salary.min"] = { $gte: parseInt(minSalary) };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const jobs = await Job.find(query)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(query);

    res.json({
      success: true,
      data: jobs,
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
      message: "search failed",
      error: error.message,
    });
  }
};
