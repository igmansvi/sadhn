import mongoose from "mongoose";
import {
  submitContactForm,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
  replyToContact,
} from "../controllers/contact.controller.js";
import Contact from "../models/contact.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import { config } from "../config/env.js";

const mockRequest = (body = {}, params = {}, user = null, query = {}) => {
  const resolvedUser =
    user && user.id
      ? { ...user, id: user.id.toString(), role: user.role || "admin" }
      : user;
  return {
    body,
    params,
    user: resolvedUser,
    query,
  };
};

const mockResponse = () => {
  const res = { statusCode: 200 };
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data) => {
    res.body = data;
    return res;
  };
  return res;
};

describe("Contact Routes", () => {
  let adminUser;

  beforeAll(async () => {
    const mongoUri = config.TEST_URI || config.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("Missing MongoDB URI for tests");
    }
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Contact.deleteMany({});
    await User.deleteMany({});
    await Notification.deleteMany({});

    adminUser = await User.create({
      name: "Admin",
      email: "contact-admin@example.com",
      password: "password123",
      role: "admin",
    });
  });

  describe("POST /api/contact", () => {
    it("should submit contact form successfully", async () => {
      const req = mockRequest({
        name: "Test User",
        email: "contact@example.com",
        subject: "Help",
        message: "Need assistance",
      });
      const res = mockResponse();

      await submitContactForm(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("message sent successfully");
      expect(res.body.data.subject).toBe("Help");
    });
  });

  describe("GET /api/contact/all", () => {
    beforeEach(async () => {
      await Contact.create({
        name: "User 1",
        email: "user1@example.com",
        subject: "Question",
        message: "Question text",
      });

      await Contact.create({
        name: "User 2",
        email: "user2@example.com",
        subject: "Issue",
        message: "Issue text",
        status: "responded",
      });

      await Contact.create({
        name: "User 3",
        email: "user3@example.com",
        subject: "Expired",
        message: "Expired message",
        expiryDate: new Date(Date.now() - 1000 * 60 * 60 * 24),
      });
    });

    it("should get all non-expired contacts", async () => {
      const req = mockRequest({}, {}, { id: adminUser._id }, {});
      const res = mockResponse();

      await getAllContacts(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(2);
      expect(res.body.pagination).toBeDefined();
    });

    it("should filter contacts by status", async () => {
      const req = mockRequest(
        {},
        {},
        { id: adminUser._id },
        { status: "responded" },
      );
      const res = mockResponse();

      await getAllContacts(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].status).toBe("responded");
    });
  });

  describe("GET /api/contact/:id", () => {
    it("should get contact by id", async () => {
      const contact = await Contact.create({
        name: "User 4",
        email: "user4@example.com",
        subject: "Subject",
        message: "Message",
      });

      const req = mockRequest({}, { id: contact._id }, { id: adminUser._id });
      const res = mockResponse();

      await getContactById(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.subject).toBe("Subject");
    });

    it("should return 404 when contact does not exist", async () => {
      const req = mockRequest(
        {},
        { id: new mongoose.Types.ObjectId() },
        { id: adminUser._id },
      );
      const res = mockResponse();

      await getContactById(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("contact not found");
    });
  });

  describe("PATCH /api/contact/:id", () => {
    it("should update contact status", async () => {
      const contact = await Contact.create({
        name: "User 5",
        email: "user5@example.com",
        subject: "Support",
        message: "Need support",
      });

      const req = mockRequest(
        { status: "responded", notes: "Handled" },
        { id: contact._id },
        { id: adminUser._id },
      );
      const res = mockResponse();

      await updateContactStatus(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe("responded");
      expect(res.body.data.respondedBy).toBeDefined();
    });
  });

  describe("DELETE /api/contact/:id", () => {
    it("should delete contact", async () => {
      const contact = await Contact.create({
        name: "User 6",
        email: "user6@example.com",
        subject: "Delete",
        message: "Delete me",
      });

      const req = mockRequest({}, { id: contact._id }, { id: adminUser._id });
      const res = mockResponse();

      await deleteContact(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("contact deleted successfully");

      const deleted = await Contact.findById(contact._id);
      expect(deleted).toBeNull();
    });

    it("should return 404 when contact does not exist", async () => {
      const req = mockRequest(
        {},
        { id: new mongoose.Types.ObjectId() },
        { id: adminUser._id },
      );
      const res = mockResponse();

      await deleteContact(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("contact not found");
    });
  });

  describe("POST /api/contact/:id/reply", () => {
    it("should reply to contact and notify user", async () => {
      const contactEmail = "reply-user@example.com";
      const contact = await Contact.create({
        name: "User 7",
        email: contactEmail,
        subject: "Reply",
        message: "Please reply",
      });

      const recipient = await User.create({
        name: "Reply User",
        email: contactEmail,
        password: "password123",
        role: "learner",
      });

      const req = mockRequest(
        { reply: "Thanks for reaching out" },
        { id: contact._id },
        { id: adminUser._id },
      );
      const res = mockResponse();

      await replyToContact(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("reply sent successfully");
      expect(res.body.data.status).toBe("responded");

      const notifications = await Notification.find({
        recipient: recipient._id,
      });
      expect(notifications.length).toBe(1);
    });

    it("should return 400 when reply is missing", async () => {
      const contact = await Contact.create({
        name: "User 8",
        email: "user8@example.com",
        subject: "Reply missing",
        message: "No reply",
      });

      const req = mockRequest(
        { reply: "" },
        { id: contact._id },
        { id: adminUser._id },
      );
      const res = mockResponse();

      await replyToContact(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("reply message is required");
    });
  });
});
