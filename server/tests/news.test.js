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
  let adminUser;

  beforeAll(async () => {
    await mongoose.connect(config.TEST_URI);
  });

  afterAll(async () => {
    await User.deleteMany({});
    await News.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await News.deleteMany({});

    adminUser = await User.create({
      name: "Admin",
      email: "admin@example.com",
      password: "password123",
      role: "admin",
    });
  });

  describe("POST /api/news", () => {
    it("creates news successfully", async () => {
      const req = mockRequest(
        { title: "Title", content: "Content", category: "general" },
        {},
        { id: adminUser._id }
      );
      const res = mockResponse();

      await createNews(req, res);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("news created successfully");
      expect(res.body.data.title).toBe("Title");
    });
  });

  describe("GET /api/news", () => {
    beforeEach(async () => {
      await News.create({
        title: "A",
        content: "A",
        category: "general",
        isActive: true,
        publishedBy: adminUser._id,
      });
      await News.create({
        title: "B",
        content: "B",
        category: "announcement",
        isActive: true,
        publishedBy: adminUser._id,
      });
      await News.create({
        title: "C",
        content: "C",
        category: "general",
        isActive: false,
        publishedBy: adminUser._id,
      });
    });

    it("gets all active news", async () => {
      const req = mockRequest({}, {}, null, {});
      const res = mockResponse();

      await getAllNews(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.pagination).toBeDefined();
    });

    it("filters news by category", async () => {
      const req = mockRequest({}, {}, null, { category: "announcement" });
      const res = mockResponse();

      await getAllNews(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.every(item => item.category === "announcement")).toBe(true);
    });

    it("searches news by title and content", async () => {
      const req = mockRequest({}, {}, null, { search: "A" });
      const res = mockResponse();

      await getAllNews(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("includes inactive news for admin when includeInactive is true", async () => {
      const req = mockRequest({}, {}, { id: adminUser._id, role: ["admin"] }, { includeInactive: "true" });
      const res = mockResponse();

      await getAllNews(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("GET /api/news/:id", () => {
    it("gets news by id", async () => {
      const news = await News.create({
        title: "X",
        content: "X",
        category: "general",
        isActive: true,
        publishedBy: adminUser._id,
      });
      const req = mockRequest({}, { id: news._id });
      const res = mockResponse();

      await getNewsById(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe("X");
    });

    it("returns 404 for expired news", async () => {
      const expired = await News.create({
        title: "Old",
        content: "Old",
        category: "general",
        isActive: true,
        expiryDate: new Date(0),
        publishedBy: adminUser._id,
      });
      const req = mockRequest({}, { id: expired._id });
      const res = mockResponse();

      await getNewsById(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("news has expired");
    });
  });

  describe("PUT /api/news/:id", () => {
    it("updates news successfully", async () => {
      const news = await News.create({
        title: "Old",
        content: "Old",
        category: "general",
        isActive: true,
        publishedBy: adminUser._id,
      });
      const req = mockRequest({ title: "New" }, { id: news._id });
      const res = mockResponse();

      await updateNews(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("news updated successfully");
      expect(res.body.data.title).toBe("New");
    });
  });

  describe("DELETE /api/news/:id", () => {
    it("deletes news successfully", async () => {
      const news = await News.create({
        title: "ToDelete",
        content: "X",
        category: "general",
        isActive: true,
        publishedBy: adminUser._id,
      });
      const req = mockRequest({}, { id: news._id });
      const res = mockResponse();

      await deleteNews(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("news deleted successfully");

      const found = await News.findById(news._id);
      expect(found).toBeNull();
    });
  });

  describe("PATCH /api/news/:id/deactivate", () => {
    it("deactivates news successfully", async () => {
      const news = await News.create({
        title: "D",
        content: "D",
        category: "general",
        isActive: true,
        publishedBy: adminUser._id,
      });
      const req = mockRequest({}, { id: news._id });
      const res = mockResponse();

      await deactivateNews(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("news deactivated successfully");
      expect(res.body.data.isActive).toBe(false);
    });
  });
});
