import mongoose from "mongoose";
import {
  createArticle,
  getArticles,
  getArticleById,
  getMyArticles,
  updateArticle,
  deleteArticle,
  publishArticle,
  searchArticles,
} from "../controllers/article.controller.js";
import Article from "../models/article.model.js";
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

describe("Article Routes", () => {
  let testEmployer;
  let testArticle;

  beforeAll(async () => {
    await mongoose.connect(config.TEST_URI);
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Article.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Article.deleteMany({});

    testEmployer = await User.create({
      name: "Test Employer",
      email: "employer@example.com",
      password: "password123",
      role: "employer",
    });

    testArticle = await Article.create({
      author: testEmployer._id,
      title: "Career Growth Tips",
      content: "Content about career growth",
      category: "career-advice",
      tags: ["career", "growth"],
      status: "published",
      publishedAt: new Date(),
    });
  });

  describe("POST /api/articles", () => {
    it("should create article successfully", async () => {
      const req = mockRequest(
        {
          title: "Interview Tips",
          content: "Tips for successful interviews",
          category: "interview-tips",
          tags: ["interview", "tips"],
        },
        {},
        { id: testEmployer._id.toString() }
      );
      const res = mockResponse();

      await createArticle(req, res);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("article created successfully");
      expect(res.body.data.title).toBe("Interview Tips");
      expect(res.body.data.status).toBe("draft");
    });
  });

  describe("GET /api/articles", () => {
    beforeEach(async () => {
      await Article.create({
        author: testEmployer._id,
        title: "Tech Trends 2024",
        content: "Latest technology trends",
        category: "technology",
        tags: ["tech", "trends"],
        status: "published",
        publishedAt: new Date(),
      });

      await Article.create({
        author: testEmployer._id,
        title: "Draft Article",
        content: "This is a draft",
        category: "other",
        status: "draft",
      });
    });

    it("should get all published articles", async () => {
      const req = mockRequest({}, {}, null, {});
      const res = mockResponse();

      await getArticles(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(2);
      expect(res.body.pagination).toBeDefined();
    });

    it("should filter articles by category", async () => {
      const req = mockRequest({}, {}, null, { category: "technology" });
      const res = mockResponse();

      await getArticles(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].category).toBe("technology");
    });

    it("should filter articles by tag", async () => {
      const req = mockRequest({}, {}, null, { tag: "career" });
      const res = mockResponse();

      await getArticles(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].tags).toContain("career");
    });

    it("should paginate articles correctly", async () => {
      const req = mockRequest({}, {}, null, { page: "1", limit: "1" });
      const res = mockResponse();

      await getArticles(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.pagination.page).toBe(1);
      expect(res.body.pagination.pages).toBe(2);
    });
  });

  describe("GET /api/articles/:id", () => {
    it("should get article by ID successfully", async () => {
      const req = mockRequest(
        {},
        { id: testArticle._id },
        { id: testEmployer._id.toString() }
      );
      const res = mockResponse();

      await getArticleById(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe("Career Growth Tips");
    });

    it("should return 404 when article does not exist", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const req = mockRequest(
        {},
        { id: fakeId },
        { id: testEmployer._id.toString() }
      );
      const res = mockResponse();

      await getArticleById(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("article not found");
    });

    it("should return 403 when accessing draft article as non-author", async () => {
      const draftArticle = await Article.create({
        author: testEmployer._id,
        title: "Draft Article",
        content: "Draft content",
        category: "other",
        status: "draft",
      });

      const otherUser = await User.create({
        name: "Other User",
        email: "other@example.com",
        password: "password123",
        role: "learner",
      });

      const req = mockRequest(
        {},
        { id: draftArticle._id },
        { id: otherUser._id.toString() }
      );
      const res = mockResponse();

      await getArticleById(req, res);

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("article not accessible");
    });
  });

  describe("GET /api/articles/my/articles", () => {
    beforeEach(async () => {
      await Article.create({
        author: testEmployer._id,
        title: "My Draft",
        content: "Draft content",
        category: "other",
        status: "draft",
      });
    });

    it("should get all articles by current employer", async () => {
      const req = mockRequest({}, {}, { id: testEmployer._id.toString() }, {});
      const res = mockResponse();

      await getMyArticles(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(2);
      expect(res.body.pagination).toBeDefined();
    });

    it("should filter articles by status", async () => {
      const req = mockRequest(
        {},
        {},
        { id: testEmployer._id.toString() },
        { status: "draft" }
      );
      const res = mockResponse();

      await getMyArticles(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].status).toBe("draft");
    });

    it("should paginate my articles correctly", async () => {
      const req = mockRequest(
        {},
        {},
        { id: testEmployer._id.toString() },
        { page: "1", limit: "1" }
      );
      const res = mockResponse();

      await getMyArticles(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.pagination.pages).toBe(2);
    });
  });

  describe("PATCH /api/articles/:id", () => {
    it("should update article successfully", async () => {
      const req = mockRequest(
        { title: "Updated Career Tips" },
        { id: testArticle._id.toString() },
        { id: testEmployer._id.toString() }
      );
      const res = mockResponse();

      await updateArticle(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("article updated successfully");
      expect(res.body.data.title).toBe("Updated Career Tips");
    });

    it("should return 404 when article does not exist", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const req = mockRequest(
        { title: "Updated" },
        { id: fakeId.toString() },
        { id: testEmployer._id.toString() }
      );
      const res = mockResponse();

      await updateArticle(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("article not found");
    });

    it("should return 403 when user is not article author", async () => {
      const otherEmployer = await User.create({
        name: "Other Employer",
        email: "other@example.com",
        password: "password123",
        role: "employer",
      });

      const req = mockRequest(
        { title: "Unauthorized Update" },
        { id: testArticle._id.toString() },
        { id: otherEmployer._id.toString() }
      );
      const res = mockResponse();

      await updateArticle(req, res);

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("not authorized to update this article");
    });
  });

  describe("DELETE /api/articles/:id", () => {
    it("should delete article successfully", async () => {
      const req = mockRequest(
        {},
        { id: testArticle._id.toString() },
        { id: testEmployer._id.toString() }
      );
      const res = mockResponse();

      await deleteArticle(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("article deleted successfully");

      const deleted = await Article.findById(testArticle._id);
      expect(deleted).toBeNull();
    });

    it("should return 404 when article does not exist", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const req = mockRequest(
        {},
        { id: fakeId.toString() },
        { id: testEmployer._id.toString() }
      );
      const res = mockResponse();

      await deleteArticle(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("article not found");
    });

    it("should return 403 when user is not article author", async () => {
      const otherEmployer = await User.create({
        name: "Other Employer",
        email: "other@example.com",
        password: "password123",
        role: "employer",
      });

      const req = mockRequest(
        {},
        { id: testArticle._id.toString() },
        { id: otherEmployer._id.toString() }
      );
      const res = mockResponse();

      await deleteArticle(req, res);

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("not authorized to delete this article");
    });
  });

  describe("PATCH /api/articles/:id/publish", () => {
    let draftArticle;

    beforeEach(async () => {
      draftArticle = await Article.create({
        author: testEmployer._id,
        title: "Draft to Publish",
        content: "Draft content to be published",
        category: "other",
        status: "draft",
      });
    });

    it("should publish article successfully", async () => {
      const req = mockRequest(
        {},
        { id: draftArticle._id.toString() },
        { id: testEmployer._id.toString() }
      );
      const res = mockResponse();

      await publishArticle(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("article published successfully");
      expect(res.body.data.status).toBe("published");
    });

    it("should return 404 when article does not exist", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const req = mockRequest(
        {},
        { id: fakeId.toString() },
        { id: testEmployer._id.toString() }
      );
      const res = mockResponse();

      await publishArticle(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("article not found");
    });

    it("should return 403 when user is not article author", async () => {
      const otherEmployer = await User.create({
        name: "Other Employer",
        email: "other@example.com",
        password: "password123",
        role: "employer",
      });

      const req = mockRequest(
        {},
        { id: draftArticle._id.toString() },
        { id: otherEmployer._id.toString() }
      );
      const res = mockResponse();

      await publishArticle(req, res);

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("not authorized to publish this article");
    });
  });

  describe("GET /api/articles/search", () => {
    beforeEach(async () => {
      await Article.create({
        author: testEmployer._id,
        title: "JavaScript Fundamentals",
        content: "Learn JavaScript basics",
        category: "skill-development",
        tags: ["javascript", "programming"],
        status: "published",
        publishedAt: new Date(),
      });

      await Article.create({
        author: testEmployer._id,
        title: "Python for Beginners",
        content: "Python programming guide",
        category: "skill-development",
        tags: ["python", "programming"],
        status: "published",
        publishedAt: new Date(),
      });
    });

    it("should search articles by text query", async () => {
      const req = mockRequest({}, {}, null, { q: "JavaScript" });
      const res = mockResponse();

      await searchArticles(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it("should filter by category", async () => {
      const req = mockRequest({}, {}, null, { category: "skill-development" });
      const res = mockResponse();

      await searchArticles(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(2);
    });

    it("should filter by tags", async () => {
      const req = mockRequest({}, {}, null, { tags: "javascript" });
      const res = mockResponse();

      await searchArticles(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].tags).toContain("javascript");
    });

    it("should paginate search results", async () => {
      const req = mockRequest({}, {}, null, { page: "1", limit: "1" });
      const res = mockResponse();

      await searchArticles(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.pagination.pages).toBeGreaterThan(1);
    });
  });
});
