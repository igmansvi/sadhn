import { validationResult } from "express-validator";
import { sendEmail } from "../utils/email.js";
import Contact from "../models/contact.model.js";
import { contactFormAdminTemplate } from "../templates/contactFormAdmin.js";
import { contactFormUserTemplate } from "../templates/contactFormUser.js";
import { contactReplyTemplate } from "../templates/contactReply.js";

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

    await sendEmail({
      to: process.env.EMAIL_USER || "support@sadhn.org",
      subject: `Contact Form: ${subject}`,
      html: contactFormAdminTemplate(name, email, subject, message),
    });

    await sendEmail({
      to: email,
      subject: "Thank you for contacting SADHN",
      html: contactFormUserTemplate(name, message),
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
      "name email",
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
      { new: true, runValidators: true },
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
    const Notification = (await import("../models/notification.model.js"))
      .default;

    const user = await User.findOne({ email: contact.email });

    if (user) {
      await Notification.create({
        recipient: user._id,
        title: "Reply to Your Contact Submission",
        content: `Admin replied to your message: "${contact.subject}"`,
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
      html: contactReplyTemplate(contact.name, reply, contact.message),
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
