import express from "express";
import { body } from "express-validator";
import { submitContactForm } from "../controllers/contact.controller.js";

const router = express.Router();

const contactValidation = [
  body("name").trim().notEmpty().withMessage("name is required"),
  body("email").isEmail().withMessage("valid email is required"),
  body("subject").trim().notEmpty().withMessage("subject is required"),
  body("message").trim().notEmpty().withMessage("message is required"),
];

router.post("/", contactValidation, submitContactForm);

export default router;
