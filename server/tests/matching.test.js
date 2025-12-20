import mongoose from "mongoose";
import {
  getMatchedJobs,
  getMatchedPrograms,
  getJobMatchScore,
  getRecommendations,
} from "../controllers/matching.controller.js";
import Profile from "../models/profile.model.js";
import Job from "../models/job.model.js";
import SkillProgram from "../models/skillprogram.model.js";
import User from "../models/user.model.js";
import { config } from "../config/env.js";

const mockRequest = (body = {}, params = {}, user = null, query = {}) => ({
  body,
  params,
  user,
  query,
});

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

const uniqueId = () => new mongoose.Types.ObjectId().toString().slice(-6);

describe("Matching Routes", () => {
  let testUser;
  let testProfile;
  let testJob;
  let testProgram;
  let testEmployer;

  beforeAll(async () => {
    await mongoose.connect(config.TEST_URI);
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Profile.deleteMany({});
    await Job.deleteMany({});
    await SkillProgram.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    const uid = uniqueId();

    testUser = await User.create({
      name: "Test Learner",
      email: `learner-match-${uid}@test.com`,
      password: "password123",
      role: "learner",
      isVerified: true,
    });

    testProfile = await Profile.create({
      user: testUser._id,
      profileType: "learner",
      headline: "Software Developer",
      summary: "Experienced developer",
      skills: [
        { name: "JavaScript", level: "advanced", yearsOfExperience: 3 },
        { name: "React", level: "intermediate", yearsOfExperience: 2 },
        { name: "Node.js", level: "intermediate", yearsOfExperience: 2 },
      ],
      location: { city: "Mumbai", state: "Maharashtra", country: "India" },
      preferences: {
        jobTypes: ["full-time"],
        workMode: ["remote", "hybrid"],
        expectedSalary: { min: 800000, max: 1500000, currency: "INR" },
        willingToRelocate: true,
        preferredLocations: ["Bangalore", "Pune"],
      },
    });

    testEmployer = await User.create({
      name: "Test Employer",
      email: `employer-match-${uid}@test.com`,
      password: "password123",
      role: "employer",
    });

    testJob = await Job.create({
      createdBy: testEmployer._id,
      company: "Tech Corp",
      title: "Full Stack Developer",
      description: "Looking for a full stack developer",
      requiredSkills: [
        { name: "JavaScript", level: "advanced" },
        { name: "React", level: "intermediate" },
      ],
      salary: { min: 1000000, max: 1800000, currency: "INR" },
      location: { city: "Mumbai", state: "Maharashtra", country: "India" },
      employmentType: "full-time",
      workMode: "hybrid",
      status: "active",
    });

    testProgram = await SkillProgram.create({
      platform: "Coursera",
      title: "Advanced React Development",
      description: "Learn advanced React patterns",
      url: "https://coursera.org/react",
      skillsCovered: ["React", "TypeScript", "Testing"],
      level: "intermediate",
      duration: { value: 4, unit: "weeks" },
      category: "Web Development",
      price: { amount: 0, currency: "INR", isFree: true },
      isActive: true,
    });
  });

  afterEach(async () => {
    if (testUser) await User.findByIdAndDelete(testUser._id);
    if (testEmployer) await User.findByIdAndDelete(testEmployer._id);
    if (testProfile) await Profile.findByIdAndDelete(testProfile._id);
    if (testJob) await Job.findByIdAndDelete(testJob._id);
    if (testProgram) await SkillProgram.findByIdAndDelete(testProgram._id);
  });

  describe("GET /api/matching/jobs", () => {
    it("should return matched jobs with scores", async () => {
      const req = mockRequest({}, {}, { id: testUser._id.toString() }, {});
      const res = mockResponse();

      await getMatchedJobs(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0].matchScore).toBeDefined();
      expect(res.body.data[0].job).toBeDefined();
    });

    it("should return 404 if profile not found", async () => {
      const req = mockRequest(
        {},
        {},
        { id: new mongoose.Types.ObjectId().toString() },
        {}
      );
      const res = mockResponse();

      await getMatchedJobs(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Profile not found");
    });

    it("should filter jobs by minimum score", async () => {
      const req = mockRequest(
        {},
        {},
        { id: testUser._id.toString() },
        { minScore: 50 }
      );
      const res = mockResponse();

      await getMatchedJobs(req, res);

      expect(res.statusCode).toBe(200);
      res.body.data.forEach((item) => {
        expect(item.matchScore).toBeGreaterThanOrEqual(50);
      });
    });

    it("should paginate results", async () => {
      const req = mockRequest(
        {},
        {},
        { id: testUser._id.toString() },
        { page: 1, limit: 5 }
      );
      const res = mockResponse();

      await getMatchedJobs(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.pagination).toBeDefined();
      expect(res.body.pagination.page).toBe(1);
      expect(res.body.pagination.limit).toBe(5);
    });
  });

  describe("GET /api/matching/programs", () => {
    it("should return matched programs with scores", async () => {
      const req = mockRequest({}, {}, { id: testUser._id.toString() }, {});
      const res = mockResponse();

      await getMatchedPrograms(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("should return 404 if profile not found", async () => {
      const req = mockRequest(
        {},
        {},
        { id: new mongoose.Types.ObjectId().toString() },
        {}
      );
      const res = mockResponse();

      await getMatchedPrograms(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /api/matching/jobs/:jobId/score", () => {
    it("should return match score for specific job", async () => {
      const req = mockRequest(
        {},
        { jobId: testJob._id.toString() },
        { id: testUser._id.toString() },
        {}
      );
      const res = mockResponse();

      await getJobMatchScore(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.matchScore).toBeDefined();
      expect(res.body.data.breakdown).toBeDefined();
      expect(res.body.data.breakdown.skills).toBeDefined();
      expect(res.body.data.breakdown.location).toBeDefined();
    });

    it("should return 404 if job not found", async () => {
      const req = mockRequest(
        {},
        { jobId: new mongoose.Types.ObjectId().toString() },
        { id: testUser._id.toString() },
        {}
      );
      const res = mockResponse();

      await getJobMatchScore(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Job not found");
    });
  });

  describe("GET /api/matching/recommendations", () => {
    it("should return combined recommendations", async () => {
      const req = mockRequest({}, {}, { id: testUser._id.toString() }, {});
      const res = mockResponse();

      await getRecommendations(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.topJobs).toBeDefined();
      expect(res.body.data.topPrograms).toBeDefined();
      expect(res.body.data.suggestedSkills).toBeDefined();
      expect(res.body.data.profileCompleteness).toBeDefined();
    });

    it("should return suggested skills based on job demand", async () => {
      const req = mockRequest({}, {}, { id: testUser._id.toString() }, {});
      const res = mockResponse();

      await getRecommendations(req, res);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data.suggestedSkills)).toBe(true);
    });
  });
});
