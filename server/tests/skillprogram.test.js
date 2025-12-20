import mongoose from "mongoose";
import {
  createSkillProgram,
  getSkillPrograms,
  getSkillProgramById,
  updateSkillProgram,
  deleteSkillProgram,
  searchSkillPrograms,
  getSkillProgramsBySkills,
} from "../controllers/skillprogram.controller.js";
import SkillProgram from "../models/skillprogram.model.js";
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

describe("SkillProgram Routes", () => {
  let testProgram;

  beforeAll(async () => {
    await mongoose.connect(config.TEST_URI);
  });

  afterAll(async () => {
    await SkillProgram.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await SkillProgram.deleteMany({});

    testProgram = await SkillProgram.create({
      platform: "Coursera",
      title: "Web Development Bootcamp",
      description: "Learn full-stack web development",
      url: "https://example.com/course",
      skillsCovered: ["JavaScript", "React", "Node.js"],
      level: "intermediate",
      duration: {
        value: 12,
        unit: "weeks",
      },
      category: "Web Development",
      price: {
        amount: 5000,
        currency: "INR",
        isFree: false,
      },
      rating: 4.5,
      enrollmentCount: 1000,
      certificateOffered: true,
    });
  });

  describe("POST /api/skillprograms", () => {
    it("should create skill program successfully", async () => {
      const req = mockRequest({
        platform: "Udemy",
        title: "Python for Data Science",
        description: "Learn Python programming",
        url: "https://example.com/python",
        skillsCovered: ["Python", "Data Science"],
        level: "beginner",
        duration: {
          value: 8,
          unit: "weeks",
        },
        category: "Data Science",
        price: {
          amount: 0,
          currency: "INR",
          isFree: true,
        },
      });
      const res = mockResponse();

      await createSkillProgram(req, res);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("skill program created successfully");
      expect(res.body.data.title).toBe("Python for Data Science");
    });
  });

  describe("GET /api/skillprograms", () => {
    beforeEach(async () => {
      await SkillProgram.create({
        platform: "edX",
        title: "Machine Learning Basics",
        description: "Introduction to ML",
        url: "https://example.com/ml",
        skillsCovered: ["Machine Learning", "Python"],
        level: "beginner",
        duration: {
          value: 6,
          unit: "weeks",
        },
        category: "Data Science",
        price: {
          amount: 0,
          currency: "INR",
          isFree: true,
        },
      });
    });

    it("should get all skill programs", async () => {
      const req = mockRequest({}, {}, null, {});
      const res = mockResponse();

      await getSkillPrograms(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(2);
      expect(res.body.pagination).toBeDefined();
    });

    it("should filter programs by level", async () => {
      const req = mockRequest({}, {}, null, { level: "beginner" });
      const res = mockResponse();

      await getSkillPrograms(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].level).toBe("beginner");
    });

    it("should filter programs by category", async () => {
      const req = mockRequest({}, {}, null, { category: "Data Science" });
      const res = mockResponse();

      await getSkillPrograms(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].category).toBe("Data Science");
    });

    it("should filter programs by isFree", async () => {
      const req = mockRequest({}, {}, null, { isFree: "true" });
      const res = mockResponse();

      await getSkillPrograms(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].price.isFree).toBe(true);
    });

    it("should filter programs by platform", async () => {
      const req = mockRequest({}, {}, null, { platform: "Coursera" });
      const res = mockResponse();

      await getSkillPrograms(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].platform).toBe("Coursera");
    });

    it("should paginate programs correctly", async () => {
      const req = mockRequest({}, {}, null, { page: "1", limit: "1" });
      const res = mockResponse();

      await getSkillPrograms(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.pagination.page).toBe(1);
      expect(res.body.pagination.limit).toBe(1);
      expect(res.body.pagination.pages).toBe(2);
    });
  });

  describe("GET /api/skillprograms/:id", () => {
    it("should get skill program by ID successfully", async () => {
      const req = mockRequest({}, { id: testProgram._id });
      const res = mockResponse();

      await getSkillProgramById(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe("Web Development Bootcamp");
    });

    it("should return 404 when program does not exist", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const req = mockRequest({}, { id: fakeId });
      const res = mockResponse();

      await getSkillProgramById(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("skill program not found");
    });
  });

  describe("PATCH /api/skillprograms/:id", () => {
    it("should update skill program successfully", async () => {
      const req = mockRequest(
        { title: "Updated Web Development" },
        { id: testProgram._id.toString() }
      );
      const res = mockResponse();

      await updateSkillProgram(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("skill program updated successfully");
      expect(res.body.data.title).toBe("Updated Web Development");
    });

    it("should return 404 when program does not exist", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const req = mockRequest({ title: "Updated" }, { id: fakeId.toString() });
      const res = mockResponse();

      await updateSkillProgram(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("skill program not found");
    });
  });

  describe("DELETE /api/skillprograms/:id", () => {
    it("should delete skill program successfully", async () => {
      const req = mockRequest({}, { id: testProgram._id.toString() });
      const res = mockResponse();

      await deleteSkillProgram(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("skill program deleted successfully");

      const deleted = await SkillProgram.findById(testProgram._id);
      expect(deleted).toBeNull();
    });

    it("should return 404 when program does not exist", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const req = mockRequest({}, { id: fakeId.toString() });
      const res = mockResponse();

      await deleteSkillProgram(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("skill program not found");
    });
  });

  describe("GET /api/skillprograms/search", () => {
    beforeEach(async () => {
      await SkillProgram.create({
        platform: "Udacity",
        title: "Data Analysis Nanodegree",
        description: "Learn data analysis with Python",
        url: "https://example.com/data",
        skillsCovered: ["Python", "Data Analysis", "SQL"],
        level: "intermediate",
        duration: {
          value: 4,
          unit: "months",
        },
        category: "Data Science",
        price: {
          amount: 15000,
          currency: "INR",
          isFree: false,
        },
        rating: 4.8,
        enrollmentCount: 5000,
      });
    });

    it("should search programs by text query", async () => {
      const req = mockRequest({}, {}, null, { q: "Python" });
      const res = mockResponse();

      await searchSkillPrograms(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it("should filter by skills", async () => {
      const req = mockRequest({}, {}, null, { skills: "Python,Data Analysis" });
      const res = mockResponse();

      await searchSkillPrograms(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
    });

    it("should filter by level", async () => {
      const req = mockRequest({}, {}, null, { level: "intermediate" });
      const res = mockResponse();

      await searchSkillPrograms(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(2);
    });

    it("should filter by max price", async () => {
      const req = mockRequest({}, {}, null, { maxPrice: "10000" });
      const res = mockResponse();

      await searchSkillPrograms(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].price.amount).toBeLessThanOrEqual(10000);
    });

    it("should filter by category", async () => {
      const req = mockRequest({}, {}, null, { category: "Web Development" });
      const res = mockResponse();

      await searchSkillPrograms(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].category).toBe("Web Development");
    });

    it("should paginate search results", async () => {
      const req = mockRequest({}, {}, null, { page: "1", limit: "1" });
      const res = mockResponse();

      await searchSkillPrograms(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.pagination.pages).toBe(2);
    });
  });

  describe("POST /api/skillprograms/recommendations", () => {
    beforeEach(async () => {
      await SkillProgram.create({
        platform: "LinkedIn Learning",
        title: "Advanced React",
        description: "Master React development",
        url: "https://example.com/react",
        skillsCovered: ["React", "Redux", "TypeScript"],
        level: "advanced",
        duration: {
          value: 6,
          unit: "weeks",
        },
        category: "Web Development",
        price: {
          amount: 0,
          currency: "INR",
          isFree: true,
        },
        rating: 4.7,
        enrollmentCount: 3000,
      });
    });

    it("should get programs by skills successfully", async () => {
      const req = mockRequest({ skills: ["React", "JavaScript"] });
      const res = mockResponse();

      await getSkillProgramsBySkills(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it("should return 400 when skills array is empty", async () => {
      const req = mockRequest({ skills: [] });
      const res = mockResponse();

      await getSkillProgramsBySkills(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("skills array is required");
    });

    it("should return 400 when skills is not provided", async () => {
      const req = mockRequest({});
      const res = mockResponse();

      await getSkillProgramsBySkills(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("skills array is required");
    });

    it("should return 400 when skills is not an array", async () => {
      const req = mockRequest({ skills: "React" });
      const res = mockResponse();

      await getSkillProgramsBySkills(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("skills array is required");
    });
  });
});
