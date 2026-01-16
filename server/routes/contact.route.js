import express from "express";
import { body } from "express-validator";
import { authenticate, requireRole } from "../middlewares/auth.middleware.js";
import {
  submitContactForm,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
  replyToContact,
} from "../controllers/contact.controller.js";

const router = express.Router();

const contactValidation = [
  body("name").trim().notEmpty().withMessage("name is required"),
  body("email").isEmail().withMessage("valid email is required"),
  body("subject").trim().notEmpty().withMessage("subject is required"),
  body("message").trim().notEmpty().withMessage("message is required"),
];

router.post("/", contactValidation, submitContactForm);

router.get(
  "/all",
  authenticate,
  requireRole(["admin"]),
  getAllContacts
);

router.get(
  "/:id",
  authenticate,
  requireRole(["admin"]),
  getContactById
);

router.patch(
  "/:id",
  authenticate,
  requireRole(["admin"]),
  updateContactStatus
);

router.delete(
  "/:id",
  authenticate,
  requireRole(["admin"]),
  deleteContact
);

router.post(
  "/:id/reply",
  authenticate,
  requireRole(["admin"]),
  replyToContact
);

export default router;
