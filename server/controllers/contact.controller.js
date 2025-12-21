import { validationResult } from "express-validator";
import { sendEmail } from "../utils/email.js";
import Contact from "../models/contact.model.js";

export const submitContactForm = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, subject, message } = req.body;

    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
    });

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
      data: contact,
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

export const getAllContacts = async (req, res) => {
  try {
    const {
      status,
      search,
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = {};

    if (status) query.status = status;

    query.expiryDate = { $gt: new Date() };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    const contacts = await Contact.find(query)
      .populate("respondedBy", "name email")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Contact.countDocuments(query);

    res.json({
      success: true,
      data: contacts,
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
      message: "failed to fetch contacts",
      error: error.message,
    });
  }
};

export const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id).populate(
      "respondedBy",
      "name email"
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "contact not found",
      });
    }

    res.json({
      success: true,
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "failed to fetch contact",
      error: error.message,
    });
  }
};

export const updateContactStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        status,
        notes,
        respondedBy: req.user.id,
        respondedAt: status === "responded" ? new Date() : undefined,
      },
      { new: true, runValidators: true }
    ).populate("respondedBy", "name email");

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "contact not found",
      });
    }

    res.json({
      success: true,
      message: "contact status updated successfully",
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "failed to update contact",
      error: error.message,
    });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "contact not found",
      });
    }

    res.json({
      success: true,
      message: "contact deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "failed to delete contact",
      error: error.message,
    });
  }
};

export const replyToContact = async (req, res) => {
  try {
    const { reply } = req.body;

    if (!reply || !reply.trim()) {
      return res.status(400).json({
        success: false,
        message: "reply message is required",
      });
    }

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "contact not found",
      });
    }

    contact.reply = reply;
    contact.status = "responded";
    contact.respondedBy = req.user.id;
    contact.respondedAt = new Date();
    await contact.save();

    const User = (await import("../models/user.model.js")).default;
    const Notification = (await import("../models/notification.model.js")).default;

    const user = await User.findOne({ email: contact.email });

    if (user) {
      await Notification.create({
        recipient: user._id,
        title: "Reply to Your Contact Submission",
        message: `Admin replied to your message: "${contact.subject}"`,
        type: "message",
      });

      if (req.io) {
        req.io.to(user._id.toString()).emit("notification", {
          title: "Reply to Your Contact Submission",
          message: `Admin replied to your message: "${contact.subject}"`,
        });
      }
    }

    await sendEmail({
      to: contact.email,
      subject: `Re: ${contact.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Reply to Your Message</h2>
          <p>Dear ${contact.name},</p>
          <p>Thank you for contacting us. Here is our response:</p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="color: #666; white-space: pre-wrap;">${reply}</p>
          </div>
          <div style="background: #fff; padding: 15px; border: 1px solid #ddd; border-radius: 5px; margin: 20px 0;">
            <p><strong>Your original message:</strong></p>
            <p style="color: #666; white-space: pre-wrap;">${contact.message}</p>
          </div>
          <p>Best regards,<br>The SADHN Team</p>
        </div>
      `,
    });

    res.json({
      success: true,
      message: "reply sent successfully",
      data: contact,
    });
  } catch (error) {
    console.error("Reply error:", error);
    res.status(500).json({
      success: false,
      message: "failed to send reply",
      error: error.message,
    });
  }
};
