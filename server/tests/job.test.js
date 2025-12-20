import mongoose from "mongoose";
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs,
  searchJobs,
} from "../controllers/job.controller.js";
import Job from "../models/job.model.js";
import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
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

describe("Job Routes", () => {
  let testEmployer;
  let testJob;

  beforeAll(async () => {
    await mongoose.connect(config.TEST_URI);
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Job.deleteMany({});
    await Profile.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Job.deleteMany({});
    await Profile.deleteMany({});

    testEmployer = await User.create({
      name: "Test Employer",
      email: "employer@example.com",
      password: "password123",
      role: "employer",
    });
  });

  describe("POST /api/jobs", () => {
    it("should create a new job successfully", async () => {
      const req = mockRequest(
        {
          company: "Tech Corp",
          title: "Software Engineer",
          description: "Looking for experienced developer",
          employmentType: "full-time",
          location: { city: "Mumbai", state: "Maharashtra", country: "India" },
          salary: { min: 800000, max: 1200000, currency: "INR" },
        },
        {},
        { id: testEmployer._id }
      );
      const res = mockResponse();

      await createJob(req, res);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("job created successfully");
      expect(res.body.data.title).toBe("Software Engineer");
      expect(res.body.data.company).toBe("Tech Corp");
    });
  });

  describe("GET /api/jobs", () => {
    beforeEach(async () => {
      await Job.create({
        createdBy: testEmployer._id,
        company: "Tech Corp",
        title: "Software Engineer",
        description: "Description",
        employmentType: "full-time",
        status: "active",
      });

      await Job.create({
        createdBy: testEmployer._id,
        company: "Another Corp",
        title: "Senior Developer",
        description: "Description 2",
        employmentType: "part-time",
        status: "active",
      });
    });

    it("should get all jobs successfully", async () => {
      const req = mockRequest({}, {}, null, {});
      const res = mockResponse();

      await getJobs(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.pagination).toBeDefined();
    });

    it("should filter jobs by employment type", async () => {
      const req = mockRequest({}, {}, null, { employmentType: "full-time" });
      const res = mockResponse();

      await getJobs(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data[0].employmentType).toBe("full-time");
    });

    it("should filter jobs by status", async () => {
      await Job.create({
        createdBy: testEmployer._id,
        company: "Closed Corp",
        title: "Closed Position",
        description: "Description",
        employmentType: "full-time",
        status: "closed",
      });

      const req = mockRequest({}, {}, null, { status: "closed" });
      const res = mockResponse();

      await getJobs(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data[0].status).toBe("closed");
    });

    it("should paginate jobs correctly", async () => {
      const req = mockRequest({}, {}, null, { page: "1", limit: "1" });
      const res = mockResponse();

      await getJobs(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.pagination.page).toBe(1);
      expect(res.body.pagination.limit).toBe(1);
    });
  });

  describe("GET /api/jobs/:id", () => {
    beforeEach(async () => {
      testJob = await Job.create({
        createdBy: testEmployer._id,
        company: "Tech Corp",
        title: "Software Engineer",
        description: "Description",
        employmentType: "full-time",
        status: "active",
      });
    });

    it("should get job by ID successfully", async () => {
      const req = mockRequest({}, { id: testJob._id });
      const res = mockResponse();

      await getJobById(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe("Software Engineer");
    });

    it("should increment view count when job is viewed", async () => {
      const initialViewCount = testJob.viewCount;
      const req = mockRequest({}, { id: testJob._id });
      const res = mockResponse();

      await getJobById(req, res);

      expect(res.body.data.viewCount).toBe(initialViewCount + 1);
    });

    it("should return 404 when job does not exist", async () => {
      const fakeJobId = new mongoose.Types.ObjectId();
      const req = mockRequest({}, { id: fakeJobId });
      const res = mockResponse();

      await getJobById(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("job not found");
    });
  });

  describe("PUT /api/jobs/:id", () => {
    beforeEach(async () => {
      testJob = await Job.create({
        createdBy: testEmployer._id,
        company: "Tech Corp",
        title: "Software Engineer",
        description: "Description",
        employmentType: "full-time",
        status: "active",
      });
    });

    it("should update job successfully", async () => {
      const req = mockRequest(
        {
          title: "Senior Software Engineer",
          description: "Updated description",
        },
        { id: testJob._id.toString() },
        { id: testEmployer._id.toString() }
      );
      const res = mockResponse();

      await updateJob(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("job updated successfully");
      expect(res.body.data.title).toBe("Senior Software Engineer");
    });

    it("should return 404 when job does not exist", async () => {
      const fakeJobId = new mongoose.Types.ObjectId();
      const req = mockRequest(
        { title: "New Title" },
        { id: fakeJobId },
        { id: testEmployer._id }
      );
      const res = mockResponse();

      await updateJob(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("job not found");
    });

    it("should return 403 when user is not the job creator", async () => {
      const otherUser = await User.create({
        name: "Other User",
        email: "other@example.com",
        password: "password123",
        role: "employer",
      });

      const req = mockRequest(
        { title: "New Title" },
        { id: testJob._id },
        { id: otherUser._id }
      );
      const res = mockResponse();

      await updateJob(req, res);

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("not authorized to update this job");
    });
  });

  describe("DELETE /api/jobs/:id", () => {
    beforeEach(async () => {
      testJob = await Job.create({
        createdBy: testEmployer._id,
        company: "Tech Corp",
        title: "Software Engineer",
        description: "Description",
        employmentType: "full-time",
        status: "active",
      });
    });

    it("should delete job successfully", async () => {
      const req = mockRequest(
        {},
        { id: testJob._id.toString() },
        { id: testEmployer._id.toString() }
      );
      const res = mockResponse();

      await deleteJob(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("job deleted successfully");

      const deletedJob = await Job.findById(testJob._id);
      expect(deletedJob).toBeNull();
    });

    it("should return 404 when job does not exist", async () => {
      const fakeJobId = new mongoose.Types.ObjectId();
      const req = mockRequest({}, { id: fakeJobId }, { id: testEmployer._id });
      const res = mockResponse();

      await deleteJob(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("job not found");
    });

    it("should return 403 when user is not the job creator", async () => {
      const otherUser = await User.create({
        name: "Other User",
        email: "other@example.com",
        password: "password123",
        role: "employer",
      });

      const req = mockRequest({}, { id: testJob._id }, { id: otherUser._id });
      const res = mockResponse();

      await deleteJob(req, res);

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("not authorized to delete this job");
    });
  });

  describe("GET /api/jobs/my/jobs", () => {
    beforeEach(async () => {
      await Job.create({
        createdBy: testEmployer._id,
        company: "Tech Corp",
        title: "Job 1",
        description: "Description 1",
        employmentType: "full-time",
        status: "active",
      });

      await Job.create({
        createdBy: testEmployer._id,
        company: "Tech Corp",
        title: "Job 2",
        description: "Description 2",
        employmentType: "part-time",
        status: "closed",
      });

      const otherEmployer = await User.create({
        name: "Other Employer",
        email: "other@example.com",
        password: "password123",
        role: "employer",
      });

      await Job.create({
        createdBy: otherEmployer._id,
        company: "Other Corp",
        title: "Other Job",
        description: "Description",
        employmentType: "full-time",
        status: "active",
      });
    });

    it("should get current employer jobs only", async () => {
      const req = mockRequest({}, {}, { id: testEmployer._id }, {});
      const res = mockResponse();

      await getMyJobs(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(2);
      expect(res.body.pagination).toBeDefined();
    });

    it("should filter own jobs by status", async () => {
      const req = mockRequest(
        {},
        {},
        { id: testEmployer._id },
        { status: "active" }
      );
      const res = mockResponse();

      await getMyJobs(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].status).toBe("active");
    });
  });

  describe("GET /api/jobs/search", () => {
    beforeEach(async () => {
      await Job.create({
        createdBy: testEmployer._id,
        company: "Tech Corp",
        title: "JavaScript Developer",
        description: "React and Node.js experience required",
        employmentType: "full-time",
        workMode: "remote",
        status: "active",
        requiredSkills: [{ name: "JavaScript", level: "advanced" }],
        location: { city: "New York", state: "NY" },
        salary: { min: 80000, max: 120000 },
        experienceRequired: { min: 2, max: 5 },
      });

      await Job.create({
        createdBy: testEmployer._id,
        company: "Python Corp",
        title: "Python Developer",
        description: "Django and Flask experience",
        employmentType: "part-time",
        workMode: "onsite",
        status: "active",
        requiredSkills: [{ name: "Python", level: "expert" }],
        location: { city: "San Francisco", state: "CA" },
        salary: { min: 70000, max: 100000 },
        experienceRequired: { min: 3, max: 7 },
      });
    });

    it("should search jobs successfully", async () => {
      const req = mockRequest({}, {}, null, {});
      const res = mockResponse();

      await searchJobs(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it("should filter jobs by skills", async () => {
      const req = mockRequest({}, {}, null, { skills: "JavaScript" });
      const res = mockResponse();

      await searchJobs(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data[0].title).toBe("JavaScript Developer");
    });

    it("should filter jobs by employment type", async () => {
      const req = mockRequest({}, {}, null, { employmentType: "full-time" });
      const res = mockResponse();

      await searchJobs(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data[0].employmentType).toBe("full-time");
    });

    it("should filter jobs by work mode", async () => {
      const req = mockRequest({}, {}, null, { workMode: "remote" });
      const res = mockResponse();

      await searchJobs(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data[0].workMode).toBe("remote");
    });

    it("should filter jobs by location", async () => {
      const req = mockRequest({}, {}, null, { location: "New York" });
      const res = mockResponse();

      await searchJobs(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data[0].location.city).toBe("New York");
    });

    it("should filter jobs by minimum salary", async () => {
      const req = mockRequest({}, {}, null, { minSalary: "75000" });
      const res = mockResponse();

      await searchJobs(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data[0].salary.min).toBeGreaterThanOrEqual(75000);
    });

    it("should filter jobs by experience range", async () => {
      const req = mockRequest({}, {}, null, {
        minExperience: "2",
      });
      const res = mockResponse();

      await searchJobs(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
