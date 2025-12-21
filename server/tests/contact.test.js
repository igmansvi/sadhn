import mongoose from "mongoose";
import { submitContactForm } from "../controllers/contact.controller.js";
import { config } from "../config/env.js";

const mockRequest = (body = {}) => {
  return { body };
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
  beforeAll(async () => {
    await mongoose.connect(config.TEST_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
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
});
