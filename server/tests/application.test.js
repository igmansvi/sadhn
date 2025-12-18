import mongoose from "mongoose";
import {
  applyToJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  withdrawApplication,
  getApplicationById,
} from "../controllers/application.controller.js";
import Application from "../models/application.model.js";
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

describe("Application Routes", () => {
  let testLearner;
  let testEmployer;
  let testJob;
  let testApplication;

  beforeAll(async () => {
    await mongoose.connect(config.MONGODB_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});
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

    testJob = await Job.create({
      createdBy: testEmployer._id,
      company: "Tech Corp",
      title: "Software Engineer",
      description: "Job Description",
      employmentType: "full-time",
      status: "active",
    });
  });

  describe("POST /api/applications", () => {
    it("should apply to job successfully", async () => {
      const req = mockRequest(
        {
          jobId: testJob._id,
          coverLetter: "I am interested in this position",
        },
        {},
        { id: testLearner._id }
      );
      const res = mockResponse();

      await applyToJob(req, res);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("application submitted successfully");
      expect(res.body.data.coverLetter).toBe(
        "I am interested in this position"
      );
    });

    it("should return 404 when job does not exist", async () => {
      const fakeJobId = new mongoose.Types.ObjectId();
      const req = mockRequest(
        { jobId: fakeJobId },
        {},
        { id: testLearner._id }
      );
      const res = mockResponse();

      await applyToJob(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("job not found");
    });

    it("should return 400 when job is not active", async () => {
      testJob.status = "closed";
      await testJob.save();

      const req = mockRequest(
        { jobId: testJob._id },
        {},
        { id: testLearner._id }
      );
      const res = mockResponse();

      await applyToJob(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("job is not accepting applications");
    });

    it("should return 400 when already applied", async () => {
      await Application.create({
        job: testJob._id,
        applicant: testLearner._id,
      });

      const req = mockRequest(
        { jobId: testJob._id },
        {},
        { id: testLearner._id }
      );
      const res = mockResponse();

      await applyToJob(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("already applied to this job");
    });
  });

  describe("GET /api/applications/my/applications", () => {
    beforeEach(async () => {
      await Application.create({
        job: testJob._id,
        applicant: testLearner._id,
        status: "applied",
      });

      const anotherJob = await Job.create({
        createdBy: testEmployer._id,
        company: "Another Corp",
        title: "Developer",
        description: "Description",
        employmentType: "full-time",
        status: "active",
      });

      await Application.create({
        job: anotherJob._id,
        applicant: testLearner._id,
        status: "reviewing",
      });
    });

    it("should get learner applications successfully", async () => {
      const req = mockRequest({}, {}, { id: testLearner._id }, {});
      const res = mockResponse();

      await getMyApplications(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(2);
      expect(res.body.pagination).toBeDefined();
    });

    it("should filter applications by status", async () => {
      const req = mockRequest(
        {},
        {},
        { id: testLearner._id },
        { status: "applied" }
      );
      const res = mockResponse();

      await getMyApplications(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].status).toBe("applied");
    });

    it("should paginate applications correctly", async () => {
      const req = mockRequest(
        {},
        {},
        { id: testLearner._id },
        { page: "1", limit: "1" }
      );
      const res = mockResponse();

      await getMyApplications(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.pagination.page).toBe(1);
      expect(res.body.pagination.limit).toBe(1);
    });
  });

  describe("GET /api/applications/job/:jobId", () => {
    beforeEach(async () => {
      testApplication = await Application.create({
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

      await Application.create({
        job: testJob._id,
        applicant: anotherLearner._id,
        status: "reviewing",
      });
    });

    it("should get job applications successfully", async () => {
      const req = mockRequest(
        {},
        { jobId: testJob._id },
        { id: testEmployer._id.toString() },
        {}
      );
      const res = mockResponse();

      await getJobApplications(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(2);
      expect(res.body.pagination).toBeDefined();
      expect(res.body.statusCounts).toBeDefined();
    });

    it("should return 404 when job does not exist", async () => {
      const fakeJobId = new mongoose.Types.ObjectId();
      const req = mockRequest(
        {},
        { jobId: fakeJobId },
        { id: testEmployer._id },
        {}
      );
      const res = mockResponse();

      await getJobApplications(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("job not found");
    });

    it("should return 403 when user is not job owner", async () => {
      const otherEmployer = await User.create({
        name: "Other Employer",
        email: "other@example.com",
        password: "password123",
        role: "employer",
      });

      const req = mockRequest(
        {},
        { jobId: testJob._id },
        { id: otherEmployer._id },
        {}
      );
      const res = mockResponse();

      await getJobApplications(req, res);

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe(
        "not authorized to view applications for this job"
      );
    });

    it("should filter applications by status", async () => {
      const req = mockRequest(
        {},
        { jobId: testJob._id },
        { id: testEmployer._id.toString() },
        { status: "applied" }
      );
      const res = mockResponse();

      await getJobApplications(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].status).toBe("applied");
    });
  });

  describe("PATCH /api/applications/:id/status", () => {
    beforeEach(async () => {
      testApplication = await Application.create({
        job: testJob._id,
        applicant: testLearner._id,
        status: "applied",
      });
    });

    it("should update application status successfully", async () => {
      const req = mockRequest(
        {
          status: "reviewing",
          recruiterNotes: "Good candidate",
        },
        { id: testApplication._id.toString() },
        { id: testEmployer._id.toString() }
      );
      const res = mockResponse();

      await updateApplicationStatus(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("application updated successfully");
      expect(res.body.data.status).toBe("reviewing");
      expect(res.body.data.recruiterNotes).toBe("Good candidate");
    });

    it("should return 404 when application does not exist", async () => {
      const fakeAppId = new mongoose.Types.ObjectId();
      const req = mockRequest(
        { status: "reviewing" },
        { id: fakeAppId },
        { id: testEmployer._id }
      );
      const res = mockResponse();

      await updateApplicationStatus(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("application not found");
    });

    it("should return 403 when user is not job owner", async () => {
      const otherEmployer = await User.create({
        name: "Other Employer",
        email: "other@example.com",
        password: "password123",
        role: "employer",
      });

      const req = mockRequest(
        { status: "reviewing" },
        { id: testApplication._id.toString() },
        { id: otherEmployer._id.toString() }
      );
      const res = mockResponse();

      await updateApplicationStatus(req, res);

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe(
        "not authorized to update this application"
      );
    });
  });

  describe("PATCH /api/applications/:id/withdraw", () => {
    beforeEach(async () => {
      testApplication = await Application.create({
        job: testJob._id,
        applicant: testLearner._id,
        status: "applied",
      });
    });

    it("should withdraw application successfully", async () => {
      const req = mockRequest(
        {},
        { id: testApplication._id.toString() },
        { id: testLearner._id.toString() }
      );
      const res = mockResponse();

      await withdrawApplication(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("application withdrawn successfully");
      expect(res.body.data.status).toBe("withdrawn");
    });

    it("should return 404 when application does not exist", async () => {
      const fakeAppId = new mongoose.Types.ObjectId();
      const req = mockRequest({}, { id: fakeAppId }, { id: testLearner._id });
      const res = mockResponse();

      await withdrawApplication(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("application not found");
    });

    it("should return 403 when user is not applicant", async () => {
      const otherLearner = await User.create({
        name: "Other Learner",
        email: "other@example.com",
        password: "password123",
        role: "learner",
      });

      const req = mockRequest(
        {},
        { id: testApplication._id.toString() },
        { id: otherLearner._id.toString() }
      );
      const res = mockResponse();

      await withdrawApplication(req, res);

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe(
        "not authorized to withdraw this application"
      );
    });

    it("should return 400 when application already withdrawn", async () => {
      testApplication.status = "withdrawn";
      await testApplication.save();

      const req = mockRequest(
        {},
        { id: testApplication._id.toString() },
        { id: testLearner._id.toString() }
      );
      const res = mockResponse();

      await withdrawApplication(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("application already withdrawn");
    });
  });

  describe("GET /api/applications/:id", () => {
    beforeEach(async () => {
      testApplication = await Application.create({
        job: testJob._id,
        applicant: testLearner._id,
        status: "applied",
        coverLetter: "I am interested",
      });
    });

    it("should get application by ID as applicant", async () => {
      const req = mockRequest(
        {},
        { id: testApplication._id },
        { id: testLearner._id.toString() }
      );
      const res = mockResponse();

      await getApplicationById(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.coverLetter).toBe("I am interested");
    });

    it("should get application by ID as job owner", async () => {
      const req = mockRequest(
        {},
        { id: testApplication._id },
        { id: testEmployer._id.toString() }
      );
      const res = mockResponse();

      await getApplicationById(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
    });

    it("should return 404 when application does not exist", async () => {
      const fakeAppId = new mongoose.Types.ObjectId();
      const req = mockRequest({}, { id: fakeAppId }, { id: testLearner._id });
      const res = mockResponse();

      await getApplicationById(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("application not found");
    });

    it("should return 403 when user is neither applicant nor job owner", async () => {
      const otherUser = await User.create({
        name: "Other User",
        email: "other@example.com",
        password: "password123",
        role: "learner",
      });

      const req = mockRequest(
        {},
        { id: testApplication._id },
        { id: otherUser._id }
      );
      const res = mockResponse();

      await getApplicationById(req, res);

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("not authorized to view this application");
    });
  });
});
