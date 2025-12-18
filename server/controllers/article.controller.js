import Article from "../models/article.model.js";
import { validationResult } from "express-validator";

export const createArticle = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const articleData = {
      ...req.body,
      author: req.user.id,
    };

    const article = await Article.create(articleData);
    await article.populate("author", "name email");

    res.status(201).json({
      success: true,
      message: "article created successfully",
      data: article,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "failed to create article",
      error: error.message,
    });
  }
};

export const getArticles = async (req, res) => {
  try {
    const {
      category,
      tag,
      page = 1,
      limit = 20,
      sortBy = "publishedAt",
      sortOrder = "desc",
    } = req.query;

    const query = { status: "published" };

    if (category) query.category = category;
    if (tag) query.tags = tag;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    const articles = await Article.find(query)
      .populate("author", "name email")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Article.countDocuments(query);

    res.json({
      success: true,
      data: articles,
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
      message: "failed to fetch articles",
      error: error.message,
    });
  }
};

export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).populate(
      "author",
      "name email"
    );

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "article not found",
      });
    }

    if (
      article.status !== "published" &&
      article.author._id.toString() !== req.user?.id
    ) {
      return res.status(403).json({
        success: false,
        message: "article not accessible",
      });
    }

    res.json({
      success: true,
      data: article,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "failed to fetch article",
      error: error.message,
    });
  }
};

export const getMyArticles = async (req, res) => {
  try {
    const {
      status,
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = { author: req.user.id };
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    const articles = await Article.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Article.countDocuments(query);

    res.json({
      success: true,
      data: articles,
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
      message: "failed to fetch articles",
      error: error.message,
    });
  }
};

export const updateArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "article not found",
      });
    }

    if (article.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "not authorized to update this article",
      });
    }

    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("author", "name email");

    res.json({
      success: true,
      message: "article updated successfully",
      data: updatedArticle,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "failed to update article",
      error: error.message,
    });
  }
};

export const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "article not found",
      });
    }

    if (article.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "not authorized to delete this article",
      });
    }

    await Article.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "article deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "failed to delete article",
      error: error.message,
    });
  }
};

export const publishArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "article not found",
      });
    }

    if (article.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "not authorized to publish this article",
      });
    }

    article.status = "published";
    await article.save();

    res.json({
      success: true,
      message: "article published successfully",
      data: article,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "failed to publish article",
      error: error.message,
    });
  }
};

export const searchArticles = async (req, res) => {
  try {
    const { q, category, tags, page = 1, limit = 20 } = req.query;

    const query = { status: "published" };

    if (q) {
      query.$text = { $search: q };
    }

    if (category) {
      query.category = category;
    }

    if (tags) {
      const tagArray = tags.split(",").map((t) => t.trim());
      query.tags = { $in: tagArray };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const articles = await Article.find(query)
      .populate("author", "name email")
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Article.countDocuments(query);

    res.json({
      success: true,
      data: articles,
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
