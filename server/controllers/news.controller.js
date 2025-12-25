import News from "../models/news.model.js";
import { validationResult } from "express-validator";

export const createNews = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can create news",
      });
    }

    const newsData = {
      ...req.body,
      publishedBy: req.user.id,
    };

    const news = await News.create(newsData);
    await news.populate("publishedBy", "name email");

    res.status(201).json({
      success: true,
      message: "news created successfully",
      data: news,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "failed to create news",
      error: error.message,
    });
  }
};

export const getAllNews = async (req, res) => {
  try {
    const {
      category,
      priority,
      search,
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      sortOrder = "desc",
      includeInactive = false,
    } = req.query;

    const query = {};

    if (includeInactive !== "true" && !req.user?.role?.includes("admin")) {
      query.isActive = true;
      query.expiryDate = { $gt: new Date() };
    } else if (
      req.user?.role?.includes("admin") &&
      includeInactive !== "true"
    ) {
      query.expiryDate = { $gt: new Date() };
    }

    if (category) query.category = category;
    if (priority) query.priority = priority;

    if (search) {
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { title: { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } },
        ],
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { priority: -1, [sortBy]: sortOrder === "desc" ? -1 : 1 };

    const news = await News.find(query)
      .populate("publishedBy", "name email")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await News.countDocuments(query);

    res.json({
      success: true,
      data: news,
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
      message: "failed to fetch news",
      error: error.message,
    });
  }
};

export const getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id).populate(
      "publishedBy",
      "name email"
    );

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "news not found",
      });
    }

    if (news.expiryDate && news.expiryDate < new Date()) {
      return res.status(404).json({
        success: false,
        message: "news has expired",
      });
    }

    res.json({
      success: true,
      data: news,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "failed to fetch news",
      error: error.message,
    });
  }
};

export const updateNews = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can update news",
      });
    }

    const news = await News.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("publishedBy", "name email");

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "news not found",
      });
    }

    res.json({
      success: true,
      message: "news updated successfully",
      data: news,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "failed to update news",
      error: error.message,
    });
  }
};

export const deleteNews = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can delete news",
      });
    }

    const news = await News.findByIdAndDelete(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "news not found",
      });
    }

    res.json({
      success: true,
      message: "news deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "failed to delete news",
      error: error.message,
    });
  }
};

export const deactivateNews = async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "news not found",
      });
    }

    res.json({
      success: true,
      message: "news deactivated successfully",
      data: news,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "failed to deactivate news",
      error: error.message,
    });
  }
};
