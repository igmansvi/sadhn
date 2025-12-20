import mongoose from "mongoose";
import {
  getNotifications,
  markAsRead,
  sendNotification,
} from "../controllers/notification.controller.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import { config } from "../config/env.js";

const mockRequest = (body = {}, params = {}, user = null, query = {}) => {
  return {
    body,
    params,
    user,
    query,
  };
};

const mockResponse = () => {
  const res = {
    statusCode: 200,
  };
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

describe("Notification Routes", () => {
  let recipient;
  let sender;

  beforeAll(async () => {
    await mongoose.connect(config.TEST_URI);
  });

  afterAll(async () => {
    await Notification.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Notification.deleteMany({});

    recipient = await User.create({
      name: "Recipient",
      email: "r@example.com",
      password: "password123",
    });
    sender = await User.create({
      name: "Sender",
      email: "s@example.com",
      password: "password123",
    });
  });

  describe("GET /api/notifications", () => {
    it("fetches notifications and unread count", async () => {
      await Notification.create({
        recipient: recipient._id,
        sender: sender._id,
        content: "One",
        isRead: false,
      });
      await Notification.create({
        recipient: recipient._id,
        sender: sender._id,
        content: "Two",
        isRead: true,
      });

      const req = mockRequest({}, {}, { id: recipient._id });
      const res = mockResponse();

      await getNotifications(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.notifications.length).toBeGreaterThan(0);
      expect(res.body.data.unreadCount).toBeGreaterThanOrEqual(0);
    });
  });

  describe("PUT /api/notifications/:id/read and bulk read", () => {
    it("marks single notification as read", async () => {
      const note = await Notification.create({
        recipient: recipient._id,
        sender: sender._id,
        content: "Unread",
        isRead: false,
      });
      const req = mockRequest({}, { id: note._id }, { id: recipient._id });
      const res = mockResponse();

      await markAsRead(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      const updated = await Notification.findById(note._id);
      expect(updated.isRead).toBe(true);
    });

    it("marks all notifications for user as read", async () => {
      await Notification.create({
        recipient: recipient._id,
        sender: sender._id,
        content: "A",
        isRead: false,
      });
      await Notification.create({
        recipient: recipient._id,
        sender: sender._id,
        content: "B",
        isRead: false,
      });

      const req = mockRequest({}, {}, { id: recipient._id });
      const res = mockResponse();

      await markAsRead(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      const unread = await Notification.countDocuments({
        recipient: recipient._id,
        isRead: false,
      });
      expect(unread).toBe(0);
    });
  });

  describe("POST /api/notifications/send", () => {
    it("sends notification and emits when io is present", async () => {
      let ioEmit = (...args) => {
        ioEmit.calls = ioEmit.calls || [];
        ioEmit.calls.push(args);
      };
      const io = { to: () => ({ emit: ioEmit }) };

      const req = mockRequest(
        { recipientId: recipient._id, content: "Hello", type: "message" },
        {},
        { id: sender._id }
      );
      req.io = io;
      const res = mockResponse();

      await sendNotification(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.recipient.toString()).toBe(recipient._id.toString());
      expect(ioEmit.calls.length).toBeGreaterThan(0);
    });
  });
});
