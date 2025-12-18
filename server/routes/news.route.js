

import express from "express";
import { body } from "express-validator";
import { authenticate, requireRole } from "../middlewares/auth.middleware.js";
import {
  createNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews,
  deactivateNews,
} from "../controllers/news.controller.js";

const router = express.Router();

const newsValidation = [
  body("title").trim().notEmpty().withMessage("title is required"),
  body("content").trim().notEmpty().withMessage("content is required"),
  body("category")
    .isIn([
      "announcement",
      "update",
      "policy",
      "event",
      "achievement",
      "general",
    ])
    .withMessage("invalid category"),
];

router.get("/", getAllNews);
router.get("/:id", getNewsById);

router.post(
  "/",
  authenticate,
  requireRole(["admin"]),
  newsValidation,
  createNews
);

router.put("/:id", authenticate, requireRole(["admin"]), updateNews);

router.delete("/:id", authenticate, requireRole(["admin"]), deleteNews);

router.patch(
  "/:id/deactivate",
  authenticate,
  requireRole(["admin"]),
  deactivateNews
);

export default router;
