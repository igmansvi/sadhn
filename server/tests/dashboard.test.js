import mongoose from "mongoose";
import {
  getLearnerDashboard,
  getRecruiterDashboard,
  getDashboard,
} from "../controllers/dashboard.controller.js";
import Job from "../models/job.model.js";
import Application from "../models/application.model.js";
import Article from "../models/article.model.js";
import News from "../models/news.model.js";
import SkillProgram from "../models/skillprogram.model.js";
import Profile from "../models/profile.model.js";
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

describe("Dashboard Routes", () => {
  let testLearner;
  let testEmployer;
  let testJob;
  let testProfile;

  beforeAll(async () => {
    await mongoose.connect(config.TEST_URI);
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});
    await Article.deleteMany({});
    await News.deleteMany({});
    await SkillProgram.deleteMany({});
    await Profile.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});
    await Article.deleteMany({});
    await News.deleteMany({});
    await SkillProgram.deleteMany({});
    await Profile.deleteMany({});

    testLearner = await User.create({
      name: "Test Learner",
      email: "learner@example.com",
      password: "password123",
      role: "learner",
    });

    testEmployer = await User.create({
      name: "Test Employer",
      email: "employer@example.com",
      password: "password123",
      role: "employer",
    });

    testProfile = await Profile.create({
      user: testLearner._id,
      profileType: "learner",
      bio: "Test bio",
      skills: [
        {
          name: "JavaScript",
          level: "intermediate",
          proficiency: "intermediate",
        },
      ],
      profileCompleteness: 50,
    });

    testJob = await Job.create({
      createdBy: testEmployer._id,
      company: "Tech Corp",
      title: "Software Engineer",
      description: "Job Description",
      employmentType: "full-time",
      status: "active",
    });
  });

  describe("GET /api/dashboard/learner", () => {
    let application1;
    let application2;

    beforeEach(async () => {
      application1 = await Application.create({
        job: testJob._id,
        applicant: testLearner._id,
        status: "applied",
      });

      const anotherJob = await Job.create({
        createdBy: testEmployer._id,
        company: "Tech Corp 2",
        title: "Frontend Developer",
        description: "Another job",
        employmentType: "full-time",
        status: "active",
      });

      application2 = await Application.create({
        job: anotherJob._id,
        applicant: testLearner._id,
        status: "reviewing",
      });

      await SkillProgram.create({
        platform: "Coursera",
        title: "React Advanced",
        description: "Learn React",
        url: "https://example.com/react",
        skillsCovered: ["React", "Redux"],
        level: "advanced",
        duration: { value: 8, unit: "weeks" },
        category: "Web Development",
        rating: 4.8,
        enrollmentCount: 5000,
      });

      await Article.create({
        author: testEmployer._id,
        title: "Career Tips",
        content: "Career advice",
        category: "career-advice",
        status: "published",
        publishedAt: new Date(),
      });

      await News.create({
        publishedBy: testEmployer._id,
        title: "Platform Update",
        content: "New features",
        category: "update",
        priority: "high",
      });
    });

    it("should get learner dashboard successfully", async () => {
      const req = mockRequest({}, {}, { id: testLearner._id.toString() });
      const res = mockResponse();

      await getLearnerDashboard(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.applicationStats).toBeDefined();
      expect(res.body.data.applicationStats.total).toBe(2);
      expect(res.body.data.recentApplications).toBeDefined();
      expect(res.body.data.recentJobs).toBeDefined();
      expect(res.body.data.recommendedPrograms).toBeDefined();
      expect(res.body.data.recentArticles).toBeDefined();
      expect(res.body.data.recentNews).toBeDefined();
      expect(res.body.data.profileCompletion).toBeGreaterThanOrEqual(0);
    });

    it("should return application stats by status", async () => {
      const req = mockRequest({}, {}, { id: testLearner._id.toString() });
      const res = mockResponse();

      await getLearnerDashboard(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.applicationStats.byStatus.length).toBe(2);
    });

    it("should recommend programs based on skills", async () => {
      const req = mockRequest({}, {}, { id: testLearner._id.toString() });
      const res = mockResponse();

      await getLearnerDashboard(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.recommendedPrograms.length).toBeGreaterThan(0);
    });

    it("should return default profile completeness when no profile", async () => {
      await Profile.deleteMany({ user: testLearner._id });

      const req = mockRequest({}, {}, { id: testLearner._id.toString() });
      const res = mockResponse();

      await getLearnerDashboard(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.profileCompletion).toBe(0);
    });
  });

  describe("GET /api/dashboard/recruiter", () => {
    let anotherJob;
    let application1;
    let application2;

    beforeEach(async () => {
      anotherJob = await Job.create({
        createdBy: testEmployer._id,
        company: "Tech Corp",
        title: "Backend Developer",
        description: "Backend job",
        employmentType: "full-time",
        status: "draft",
      });

      application1 = await Application.create({
        job: testJob._id,
        applicant: testLearner._id,
        status: "applied",
      });

      const anotherLearner = await User.create({
        name: "Another Learner",
        email: "another@example.com",
        password: "password123",
        role: "learner",
      });

      application2 = await Application.create({
        job: testJob._id,
        applicant: anotherLearner._id,
        status: "reviewing",
      });

      await Article.create({
        author: testEmployer._id,
        title: "Published Article",
        content: "Published content",
        category: "career-advice",
        status: "published",
        publishedAt: new Date(),
        likeCount: 20,
      });

      await Article.create({
        author: testEmployer._id,
        title: "Draft Article",
        content: "Draft content",
        category: "other",
        status: "draft",
      });
    });

    it("should get recruiter dashboard successfully", async () => {
      const req = mockRequest({}, {}, { id: testEmployer._id.toString() });
      const res = mockResponse();

      await getRecruiterDashboard(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.jobStats).toBeDefined();
      expect(res.body.data.jobStats.total).toBe(2);
      expect(res.body.data.recentJobs).toBeDefined();
      expect(res.body.data.applicationStats).toBeDefined();
      expect(res.body.data.recentApplications).toBeDefined();
      expect(res.body.data.articleStats).toBeDefined();
      expect(res.body.data.recentArticles).toBeDefined();
    });

    it("should return job stats by status", async () => {
      const req = mockRequest({}, {}, { id: testEmployer._id.toString() });
      const res = mockResponse();

      await getRecruiterDashboard(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.jobStats.byStatus.length).toBe(2);
    });

    it("should return application stats for employer jobs", async () => {
      const req = mockRequest({}, {}, { id: testEmployer._id.toString() });
      const res = mockResponse();

      await getRecruiterDashboard(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.applicationStats.total).toBe(2);
      expect(res.body.data.applicationStats.byStatus.length).toBe(2);
    });

    it("should return article stats with engagement", async () => {
      const req = mockRequest({}, {}, { id: testEmployer._id.toString() });
      const res = mockResponse();

      await getRecruiterDashboard(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.articleStats.total).toBe(2);
      expect(res.body.data.articleStats.byStatus.length).toBe(2);
      expect(res.body.data.articleStats.engagement.totalLikes).toBe(20);
    });

    it("should handle employer with no articles", async () => {
      await Article.deleteMany({ author: testEmployer._id });

      const req = mockRequest({}, {}, { id: testEmployer._id.toString() });
      const res = mockResponse();

      await getRecruiterDashboard(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.articleStats.total).toBe(0);
      expect(res.body.data.articleStats.engagement.totalLikes).toBe(0);
    });
  });

  describe("GET /api/dashboard", () => {
    it("should route to learner dashboard for learner role", async () => {
      const req = mockRequest(
        {},
        {},
        { id: testLearner._id.toString(), role: "learner" }
      );
      const res = mockResponse();

      await getDashboard(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.applicationStats).toBeDefined();
      expect(res.body.data.profileCompletion).toBeDefined();
    });

    it("should route to recruiter dashboard for employer role", async () => {
      const req = mockRequest(
        {},
        {},
        { id: testEmployer._id.toString(), role: "employer" }
      );
      const res = mockResponse();

      await getDashboard(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.jobStats).toBeDefined();
      expect(res.body.data.articleStats).toBeDefined();
    });

    it("should return admin dashboard for admin role", async () => {
      const adminUser = await User.create({
        name: "Admin User",
        email: "admin@example.com",
        password: "password123",
        role: "admin",
      });

      const req = mockRequest(
        {},
        {},
        { id: adminUser._id.toString(), role: "admin" }
      );
      const res = mockResponse();

      await getDashboard(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
