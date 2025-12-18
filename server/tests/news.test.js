import mongoose from "mongoose";
import {
  createNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews,
  deactivateNews,
} from "../controllers/news.controller.js";
import News from "../models/news.model.js";
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

describe("News Routes", () => {
  let testAdmin;
  let testNews;

  beforeAll(async () => {
    await mongoose.connect(config.MONGODB_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await News.deleteMany({});

    testAdmin = await User.create({
      name: "Test Admin",
      email: "admin@example.com",
      password: "password123",
      role: "admin",
    });

    testNews = await News.create({
      publishedBy: testAdmin._id,
      title: "Platform Update",
      content: "New features released",
      category: "update",
      priority: "high",
    });
  });

  describe("POST /api/news", () => {
    it("should create news successfully", async () => {
      const req = mockRequest(
        {
          title: "System Maintenance",
          content: "Scheduled maintenance on Sunday",
          category: "announcement",
          priority: "urgent",
        },
        {},
        { id: testAdmin._id.toString() }
      );
      const res = mockResponse();

      await createNews(req, res);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("news created successfully");
      expect(res.body.data.title).toBe("System Maintenance");
    });
  });

  describe("GET /api/news", () => {
    beforeEach(async () => {
      await News.create({
        publishedBy: testAdmin._id,
        title: "Policy Update",
        content: "New privacy policy",
        category: "policy",
        priority: "medium",
      });

      await News.create({
        publishedBy: testAdmin._id,
        title: "Expired News",
        content: "This news has expired",
        category: "general",
        priority: "low",
        expiryDate: new Date(Date.now() - 1000 * 60 * 60 * 24),
      });

      await News.create({
        publishedBy: testAdmin._id,
        title: "Inactive News",
        content: "This news is inactive",
        category: "general",
        priority: "low",
        isActive: false,
      });
    });

    it("should get all active non-expired news", async () => {
      const req = mockRequest({}, {}, null, {});
      const res = mockResponse();

      await getAllNews(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(2);
      expect(res.body.pagination).toBeDefined();
    });

    it("should filter news by category", async () => {
      const req = mockRequest({}, {}, null, { category: "policy" });
      const res = mockResponse();

      await getAllNews(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].category).toBe("policy");
    });

    it("should filter news by priority", async () => {
      const req = mockRequest({}, {}, null, { priority: "high" });
      const res = mockResponse();

      await getAllNews(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].priority).toBe("high");
    });

    it("should paginate news correctly", async () => {
      const req = mockRequest({}, {}, null, { page: "1", limit: "1" });
      const res = mockResponse();

      await getAllNews(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.pagination.page).toBe(1);
      expect(res.body.pagination.pages).toBe(2);
    });

    it("should sort by priority and createdAt", async () => {
      const req = mockRequest({}, {}, null, {});
      const res = mockResponse();

      await getAllNews(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(2);
      const priorities = res.body.data.map((n) => n.priority);
      expect(priorities).toContain("high");
      expect(priorities).toContain("medium");
    });
  });

  describe("GET /api/news/:id", () => {
    it("should get news by ID successfully", async () => {
      const req = mockRequest({}, { id: testNews._id });
      const res = mockResponse();

      await getNewsById(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe("Platform Update");
    });

    it("should return 404 when news does not exist", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const req = mockRequest({}, { id: fakeId });
      const res = mockResponse();

      await getNewsById(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("news not found");
    });

    it("should return 404 when news has expired", async () => {
      const expiredNews = await News.create({
        publishedBy: testAdmin._id,
        title: "Expired News",
        content: "This has expired",
        category: "general",
        expiryDate: new Date(Date.now() - 1000 * 60 * 60 * 24),
      });

      const req = mockRequest({}, { id: expiredNews._id });
      const res = mockResponse();

      await getNewsById(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("news has expired");
    });
  });

  describe("PATCH /api/news/:id", () => {
    it("should update news successfully", async () => {
      const req = mockRequest(
        { title: "Updated Platform Update" },
        { id: testNews._id.toString() },
        { id: testAdmin._id.toString() }
      );
      const res = mockResponse();

      await updateNews(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("news updated successfully");
      expect(res.body.data.title).toBe("Updated Platform Update");
    });

    it("should return 404 when news does not exist", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const req = mockRequest(
        { title: "Updated" },
        { id: fakeId.toString() },
        { id: testAdmin._id.toString() }
      );
      const res = mockResponse();

      await updateNews(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("news not found");
    });
  });

  describe("DELETE /api/news/:id", () => {
    it("should delete news successfully", async () => {
      const req = mockRequest(
        {},
        { id: testNews._id.toString() },
        { id: testAdmin._id.toString() }
      );
      const res = mockResponse();

      await deleteNews(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("news deleted successfully");

      const deleted = await News.findById(testNews._id);
      expect(deleted).toBeNull();
    });

    it("should return 404 when news does not exist", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const req = mockRequest(
        {},
        { id: fakeId.toString() },
        { id: testAdmin._id.toString() }
      );
      const res = mockResponse();

      await deleteNews(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("news not found");
    });
  });

  describe("PATCH /api/news/:id/deactivate", () => {
    it("should deactivate news successfully", async () => {
      const req = mockRequest(
        {},
        { id: testNews._id.toString() },
        { id: testAdmin._id.toString() }
      );
      const res = mockResponse();

      await deactivateNews(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("news deactivated successfully");
      expect(res.body.data.isActive).toBe(false);
    });

    it("should return 404 when news does not exist", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const req = mockRequest(
        {},
        { id: fakeId.toString() },
        { id: testAdmin._id.toString() }
      );
      const res = mockResponse();

      await deactivateNews(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("news not found");
    });
  });
});
