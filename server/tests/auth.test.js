import mongoose from "mongoose";
import {
  register,
  login,
  getUser,
  sendVerificationEmail,
  verifyEmail,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import User from "../models/user.model.js";
import { config } from "../config/env.js";

const mockRequest = (body = {}, params = {}, user = null, headers = {}) => {
  return {
    body,
    params,
    user,
    headers,
    protocol: "http",
    get: (key) => headers[key] || "localhost",
  };
};

const mockResponse = () => {
  const res = {};
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

describe("Auth Routes", () => {
  let testUser;
  let authToken;

  beforeAll(async () => {
    await mongoose.connect(config.MONGODB_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      const req = mockRequest({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        role: "learner",
      });
      const res = mockResponse();

      await register(req, res);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toMatch(/User registered successfully/);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe("test@example.com");
      expect(res.body.user.name).toBe("Test User");
      expect(res.body.user.role).toBe("learner");
    });

    it("should return 400 when email already exists", async () => {
      await User.create({
        name: "Existing User",
        email: "test@example.com",
        password: "password123",
      });

      const req = mockRequest({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });
      const res = mockResponse();

      await register(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Email already exists");
    });

    it("should register with default role when role is not provided", async () => {
      const req = mockRequest({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });
      const res = mockResponse();

      await register(req, res);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.user.role).toBe("learner");
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      testUser = await User.create({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        role: "learner",
      });
    });

    it("should login successfully with valid credentials", async () => {
      const req = mockRequest({
        email: "test@example.com",
        password: "password123",
      });
      const res = mockResponse();

      await login(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Login successful");
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe("test@example.com");
    });

    it("should return 401 when user does not exist", async () => {
      const req = mockRequest({
        email: "nonexistent@example.com",
        password: "password123",
      });
      const res = mockResponse();

      await login(req, res);

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Invalid credentials");
    });

    it("should return 401 when password is incorrect", async () => {
      const req = mockRequest({
        email: "test@example.com",
        password: "wrongpassword",
      });
      const res = mockResponse();

      await login(req, res);

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Invalid credentials");
    });

    it("should return 403 when account is deactivated", async () => {
      testUser.isActive = false;
      await testUser.save();

      const req = mockRequest({
        email: "test@example.com",
        password: "password123",
      });
      const res = mockResponse();

      await login(req, res);

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Account is deactivated");
    });
  });

  describe("GET /api/auth/getUser", () => {
    beforeEach(async () => {
      testUser = await User.create({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        role: "learner",
      });
      authToken = testUser.generateAuthToken();
    });

    it("should get user details with valid token", async () => {
      const req = mockRequest({}, {}, { id: testUser._id });
      const res = mockResponse();

      await getUser(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.email).toBe("test@example.com");
      expect(res.body.user.name).toBe("Test User");
      expect(res.body.user.role).toBe("learner");
      expect(res.body.user.isEmailVerified).toBeDefined();
      expect(res.body.user.isActive).toBeDefined();
    });

    it("should return 404 when user does not exist", async () => {
      await User.deleteMany({});

      const req = mockRequest({}, {}, { id: testUser._id });
      const res = mockResponse();

      await getUser(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("User not found");
    });
  });

  describe("POST /api/auth/send-verification-email", () => {
    beforeEach(async () => {
      testUser = await User.create({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        role: "learner",
        isVerified: false,
      });
      authToken = testUser.generateAuthToken();
    });

    it("should send verification email successfully", async () => {
      const req = mockRequest({}, {}, { id: testUser._id });
      const res = mockResponse();

      await sendVerificationEmail(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Verification email sent");

      const updatedUser = await User.findById(testUser._id).select(
        "+verificationToken"
      );
      expect(updatedUser.verificationToken).toBeDefined();
    });

    it("should return 400 when email is already verified", async () => {
      testUser.isVerified = true;
      await testUser.save();

      const req = mockRequest({}, {}, { id: testUser._id });
      const res = mockResponse();

      await sendVerificationEmail(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Email already verified");
    });

    it("should return 404 when user does not exist", async () => {
      await User.deleteMany({});

      const req = mockRequest({}, {}, { id: testUser._id });
      const res = mockResponse();

      await sendVerificationEmail(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("User not found");
    });
  });

  describe("GET /api/auth/verify-email/:token", () => {
    let verificationToken;

    beforeEach(async () => {
      testUser = await User.create({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        role: "learner",
        isVerified: false,
      });
      verificationToken = testUser.generateVerificationToken();
      await testUser.save();
    });

    it("should verify email with valid token", async () => {
      const req = mockRequest({}, { token: verificationToken });
      const res = mockResponse();

      await verifyEmail(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Email verified successfully");

      const updatedUser = await User.findById(testUser._id);
      expect(updatedUser.isVerified).toBe(true);
    });

    it("should return 400 when token is invalid", async () => {
      const req = mockRequest({}, { token: "invalidtoken" });
      const res = mockResponse();

      await verifyEmail(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Invalid or expired token");
    });

    it("should return 400 when token is expired", async () => {
      testUser.verificationTokenExpire = Date.now() - 1000;
      await testUser.save();

      const req = mockRequest({}, { token: verificationToken });
      const res = mockResponse();

      await verifyEmail(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Invalid or expired token");
    });
  });

  describe("POST /api/auth/forgot-password", () => {
    beforeEach(async () => {
      testUser = await User.create({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        role: "learner",
      });
    });

    it("should send password reset email successfully", async () => {
      const req = mockRequest({ email: "test@example.com" });
      const res = mockResponse();

      await forgotPassword(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Password reset email sent");

      const updatedUser = await User.findById(testUser._id).select(
        "+resetPasswordToken"
      );
      expect(updatedUser.resetPasswordToken).toBeDefined();
    });

    it("should return 404 when user does not exist", async () => {
      const req = mockRequest({ email: "nonexistent@example.com" });
      const res = mockResponse();

      await forgotPassword(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("User not found");
    });
  });

  describe("POST /api/auth/reset-password/:token", () => {
    let resetToken;

    beforeEach(async () => {
      testUser = await User.create({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        role: "learner",
      });
      resetToken = testUser.generateResetPasswordToken();
      await testUser.save();
    });

    it("should reset password with valid token", async () => {
      const req = mockRequest(
        { password: "newpassword123" },
        { token: resetToken }
      );
      const res = mockResponse();

      await resetPassword(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Password reset successfully");

      const updatedUser = await User.findById(testUser._id).select("+password");
      const isPasswordValid = await updatedUser.comparePassword(
        "newpassword123"
      );
      expect(isPasswordValid).toBe(true);
    });

    it("should return 400 when token is invalid", async () => {
      const req = mockRequest(
        { password: "newpassword123" },
        { token: "invalidtoken" }
      );
      const res = mockResponse();

      await resetPassword(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Invalid or expired token");
    });

    it("should return 400 when token is expired", async () => {
      testUser.resetPasswordExpire = Date.now() - 1000;
      await testUser.save();

      const req = mockRequest(
        { password: "newpassword123" },
        { token: resetToken }
      );
      const res = mockResponse();

      await resetPassword(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Invalid or expired token");
    });
  });
});
