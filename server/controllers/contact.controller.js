import { validationResult } from "express-validator";
import { sendEmail } from "../utils/email.js";

export const submitContactForm = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, subject, message } = req.body;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Contact Form Submission</h2>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>From:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
        </div>
        <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
          <h3 style="color: #555; margin-top: 0;">Message:</h3>
          <p style="line-height: 1.6; color: #666;">${message}</p>
        </div>
      </div>
    `;

    await sendEmail({
      to: process.env.EMAIL_USER || "support@sadhn.org",
      subject: `Contact Form: ${subject}`,
      html: htmlContent,
    });

    await sendEmail({
      to: email,
      subject: "Thank you for contacting SADHN",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Thank You for Reaching Out</h2>
          <p>Dear ${name},</p>
          <p>We have received your message and will get back to you as soon as possible.</p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Your message:</strong></p>
            <p style="color: #666;">${message}</p>
          </div>
          <p>Best regards,<br>The SADHN Team</p>
        </div>
      `,
    });

    res.json({
      success: true,
      message: "message sent successfully",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({
      success: false,
      message: "failed to send message",
      error: error.message,
    });
  }
};
