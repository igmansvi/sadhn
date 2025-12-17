/**
 * Article Routes
 *
 * Defines routes for article operations.
 *
 * @module routes/article
 */

import express from "express";
import { body } from "express-validator";
import {
  authenticate,
  requireRole,
  requireProfile,
} from "../middlewares/auth.middleware.js";
import {
  createArticle,
  getArticles,
  getArticleById,
  getMyArticles,
  updateArticle,
  deleteArticle,
  publishArticle,
  searchArticles,
} from "../controllers/article.controller.js";

const router = express.Router();

const articleValidation = [
  body("title").trim().notEmpty().withMessage("title is required"),
  body("content").trim().notEmpty().withMessage("content is required"),
  body("category")
    .isIn([
      "career-advice",
      "industry-trends",
      "skill-development",
      "interview-tips",
      "workplace-culture",
      "technology",
      "job-market",
      "other",
    ])
    .withMessage("invalid category"),
];

router.get("/", getArticles);
router.get("/search", searchArticles);
router.get("/:id", getArticleById);

router.post(
  "/",
  authenticate,
  requireRole(["employer"]),
  requireProfile,
  articleValidation,
  createArticle
);

router.get(
  "/my/articles",
  authenticate,
  requireRole(["employer"]),
  getMyArticles
);

router.put("/:id", authenticate, requireRole(["employer"]), updateArticle);

router.delete("/:id", authenticate, requireRole(["employer"]), deleteArticle);

router.patch(
  "/:id/publish",
  authenticate,
  requireRole(["employer"]),
  publishArticle
);

export default router;
