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

describe("Notification Routes", () => {
  let sender;
  let recipient;

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
    await Notification.deleteMany({});
    await User.deleteMany({});

    sender = await User.create({
      name: "Sender",
      email: "sender@example.com",
      password: "password123",
      role: "employer",
    });

    recipient = await User.create({
      name: "Recipient",
      email: "recipient@example.com",
      password: "password123",
      role: "learner",
    });
  });

  describe("GET /api/notifications", () => {
    beforeEach(async () => {
      await Notification.create({
        recipient: recipient._id,
        sender: sender._id,
        content: "Message 1",
        type: "message",
      });

      await Notification.create({
        recipient: recipient._id,
        sender: sender._id,
        content: "Message 2",
        type: "message",
        isRead: true,
      });

      await Notification.create({
        recipient: recipient._id,
        sender: sender._id,
        content: "Expired",
        expiryDate: new Date(Date.now() - 1000 * 60 * 60 * 24),
      });
    });

    it("should return notifications and unread count", async () => {
      const req = mockRequest({}, {}, { id: recipient._id }, {});
      const res = mockResponse();

      await getNotifications(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.notifications.length).toBe(2);
      expect(res.body.data.unreadCount).toBe(1);
    });
  });

  describe("PUT /api/notifications/read", () => {
    it("should mark all notifications as read", async () => {
      await Notification.create({
        recipient: recipient._id,
        sender: sender._id,
        content: "Message 1",
        type: "message",
      });

      await Notification.create({
        recipient: recipient._id,
        sender: sender._id,
        content: "Message 2",
        type: "message",
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

  describe("PUT /api/notifications/:id/read", () => {
    it("should mark a single notification as read", async () => {
      const notification = await Notification.create({
        recipient: recipient._id,
        sender: sender._id,
        content: "Message 1",
        type: "message",
      });

      const req = mockRequest(
        {},
        { id: notification._id.toString() },
        { id: recipient._id },
      );
      const res = mockResponse();

      await markAsRead(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      const updated = await Notification.findById(notification._id);
      expect(updated.isRead).toBe(true);
    });
  });

  describe("POST /api/notifications/send", () => {
    it("should send a notification", async () => {
      const req = mockRequest(
        {
          recipientId: recipient._id.toString(),
          content: "New message",
          type: "message",
        },
        {},
        { id: sender._id },
      );
      const res = mockResponse();

      await sendNotification(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.content).toBe("New message");
      expect(res.body.data.recipient.toString()).toBe(recipient._id.toString());
    });
  });
});
