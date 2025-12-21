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
  return { body, params, user, query };
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
  let admin;
  let contact;

  beforeAll(async () => {
    await mongoose.connect(config.TEST_URI);
  });

  afterAll(async () => {
    await Contact.deleteMany({});
    await User.deleteMany({});
    await Notification.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Contact.deleteMany({});
    await User.deleteMany({});
    await Notification.deleteMany({});

    admin = await User.create({
      name: "Admin",
      email: "admin@example.com",
      password: "password123",
      role: "admin",
    });
  });

  describe("POST /api/contact", () => {
    it("submits contact form successfully", async () => {
      const req = mockRequest({
        name: "John Doe",
        email: "john@example.com",
        subject: "Test Subject",
        message: "Test message content",
      });
      const res = mockResponse();

      await submitContactForm(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("message sent successfully");
    });

    it("returns 400 when required fields are missing", async () => {
      const req = mockRequest({
        name: "John Doe",
      });
      const res = mockResponse();

      await submitContactForm(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("returns 400 when email is invalid", async () => {
      const req = mockRequest({
        name: "John Doe",
        email: "invalid-email",
        subject: "Test",
        message: "Test",
      });
      const res = mockResponse();

      await submitContactForm(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /api/contact/all", () => {
    it("fetches all contacts for admin", async () => {
      await Contact.create({
        name: "Test",
        email: "test@example.com",
        subject: "Subject",
        message: "Message",
      });

      const req = mockRequest({}, {}, { id: admin._id, role: "admin" });
      const res = mockResponse();

      await getAllContacts(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.contacts.length).toBeGreaterThan(0);
    });

    it("filters contacts by status", async () => {
      await Contact.create({
        name: "Test1",
        email: "test1@example.com",
        subject: "Subject1",
        message: "Message1",
        status: "pending",
      });
      await Contact.create({
        name: "Test2",
        email: "test2@example.com",
        subject: "Subject2",
        message: "Message2",
        status: "responded",
      });

      const req = mockRequest(
        {},
        {},
        { id: admin._id, role: "admin" },
        { status: "pending" }
      );
      const res = mockResponse();

      await getAllContacts(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.contacts.every((c) => c.status === "pending")).toBe(
        true
      );
    });
  });

  describe("GET /api/contact/:id", () => {
    it("fetches contact by id", async () => {
      contact = await Contact.create({
        name: "Test",
        email: "test@example.com",
        subject: "Subject",
        message: "Message",
      });

      const req = mockRequest(
        {},
        { id: contact._id },
        { id: admin._id, role: "admin" }
      );
      const res = mockResponse();

      await getContactById(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.contact._id.toString()).toBe(
        contact._id.toString()
      );
    });

    it("returns 404 for non-existent contact", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const req = mockRequest(
        {},
        { id: fakeId },
        { id: admin._id, role: "admin" }
      );
      const res = mockResponse();

      await getContactById(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe("PATCH /api/contact/:id", () => {
    it("updates contact status", async () => {
      contact = await Contact.create({
        name: "Test",
        email: "test@example.com",
        subject: "Subject",
        message: "Message",
        status: "pending",
      });

      const req = mockRequest(
        { status: "responded" },
        { id: contact._id },
        { id: admin._id, role: "admin" }
      );
      const res = mockResponse();

      await updateContactStatus(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.contact.status).toBe("responded");
    });
  });

  describe("DELETE /api/contact/:id", () => {
    it("deletes contact", async () => {
      contact = await Contact.create({
        name: "Test",
        email: "test@example.com",
        subject: "Subject",
        message: "Message",
      });

      const req = mockRequest(
        {},
        { id: contact._id },
        { id: admin._id, role: "admin" }
      );
      const res = mockResponse();

      await deleteContact(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      const deleted = await Contact.findById(contact._id);
      expect(deleted).toBeNull();
    });
  });

  describe("POST /api/contact/:id/reply", () => {
    it("replies to contact submission", async () => {
      contact = await Contact.create({
        name: "Test User",
        email: "test@example.com",
        subject: "Subject",
        message: "Message",
        status: "pending",
      });

      const req = mockRequest(
        { replyMessage: "Thank you for contacting us" },
        { id: contact._id },
        { id: admin._id, role: "admin" }
      );
      const res = mockResponse();

      await replyToContact(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      const updated = await Contact.findById(contact._id);
      expect(updated.status).toBe("responded");
      expect(updated.reply).toBe("Thank you for contacting us");
    });

    it("returns 400 when reply message is missing", async () => {
      contact = await Contact.create({
        name: "Test",
        email: "test@example.com",
        subject: "Subject",
        message: "Message",
      });

      const req = mockRequest(
        {},
        { id: contact._id },
        { id: admin._id, role: "admin" }
      );
      const res = mockResponse();

      await replyToContact(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});
