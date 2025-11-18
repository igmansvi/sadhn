/**
 * Email Utility
 *
 * Handles email sending functionality using Nodemailer.
 * Configured for SMTP transport with credentials from environment variables.
 *
 * @module utils/email
 */

import nodemailer from "nodemailer";
import { config } from "../config/env.js";

const transporter = nodemailer.createTransport({
  host: config.EMAIL_HOST,
  port: config.EMAIL_PORT,
  secure: false,
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASS,
  },
});

/**
 * Send email via SMTP
 *
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML email content
 * @returns {Promise<Object>} Email send info
 * @throws {Error} If email sending fails
 */
export const sendEmail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: config.EMAIL_FROM,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error("Failed to send email");
  }
};
