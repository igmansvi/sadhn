import SkillProgram from "../models/skillprogram.model.js";
import { validationResult } from "express-validator";

export const createSkillProgram = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can create skill programs",
      });
    }

    const program = await SkillProgram.create(req.body);

    res.status(201).json({
      success: true,
      message: "skill program created successfully",
      data: program,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "failed to create skill program",
      error: error.message,
    });
  }
};

export const getSkillPrograms = async (req, res) => {
  try {
    const {
      level,
      category,
      isFree,
      platform,
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = { isActive: true };

    if (level) query.level = level;
    if (category) query.category = new RegExp(category, "i");
    if (isFree !== undefined) query["price.isFree"] = isFree === "true";
    if (platform) query.platform = new RegExp(platform, "i");

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    const programs = await SkillProgram.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await SkillProgram.countDocuments(query);

    res.json({
      success: true,
      data: programs,
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
      message: "failed to fetch skill programs",
      error: error.message,
    });
  }
};

export const getSkillProgramById = async (req, res) => {
  try {
    const program = await SkillProgram.findById(req.params.id);

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "skill program not found",
      });
    }

    res.json({
      success: true,
      data: program,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "failed to fetch skill program",
      error: error.message,
    });
  }
};

export const updateSkillProgram = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can update skill programs",
      });
    }

    const program = await SkillProgram.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "skill program not found",
      });
    }

    res.json({
      success: true,
      message: "skill program updated successfully",
      data: program,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "failed to update skill program",
      error: error.message,
    });
  }
};

export const deleteSkillProgram = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can delete skill programs",
      });
    }

    const program = await SkillProgram.findByIdAndDelete(req.params.id);

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "skill program not found",
      });
    }

    res.json({
      success: true,
      message: "skill program deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "failed to delete skill program",
      error: error.message,
    });
  }
};

export const searchSkillPrograms = async (req, res) => {
  try {
    const {
      q,
      skills,
      level,
      category,
      isFree,
      maxPrice,
      platform,
      page = 1,
      limit = 20,
    } = req.query;

    const query = { isActive: true };

    if (q) {
      query.$text = { $search: q };
    }

    if (skills) {
      const skillArray = skills.split(",").map((s) => s.trim());
      query.skillsCovered = { $in: skillArray };
    }

    if (level) {
      query.level = level;
    }

    if (category) {
      query.category = new RegExp(category, "i");
    }

    if (isFree !== undefined) {
      query["price.isFree"] = isFree === "true";
    }
    if (maxPrice) {
      query["price.amount"] = { $lte: parseInt(maxPrice) };
    }

    if (platform) {
      query.platform = new RegExp(platform, "i");
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const programs = await SkillProgram.find(query)
      .sort({ rating: -1, enrollmentCount: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await SkillProgram.countDocuments(query);

    res.json({
      success: true,
      data: programs,
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

export const getSkillProgramsBySkills = async (req, res) => {
  try {
    const { skills } = req.body;

    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({
        success: false,
        message: "skills array is required",
      });
    }

    const programs = await SkillProgram.find({
      isActive: true,
      skillsCovered: { $in: skills },
    })
      .sort({ rating: -1, enrollmentCount: -1 })
      .limit(10);

    res.json({
      success: true,
      data: programs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "failed to fetch programs",
      error: error.message,
    });
  }
};
