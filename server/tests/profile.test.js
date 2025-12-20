import mongoose from "mongoose";
import {
  createProfile,
  getMyProfile,
  getProfileById,
  updateProfile,
  deleteProfile,
  searchProfiles,
  addSkill,
  updateSkill,
  removeSkill,
  addExperience,
  updateExperience,
  removeExperience,
  addEducation,
  updateEducation,
  removeEducation,
  addCertification,
  updateCertification,
  removeCertification,
  getProfileCompletion,
} from "../controllers/profile.controller.js";
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

describe("Profile Routes", () => {
  let testUser;
  let testProfile;

  beforeAll(async () => {
    await mongoose.connect(config.TEST_URI);
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Profile.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Profile.deleteMany({});

    testUser = await User.create({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      role: "learner",
    });
  });

  describe("POST /api/profile", () => {
    it("should create a new profile successfully", async () => {
      const req = mockRequest(
        {
          headline: "Software Developer",
          summary: "Experienced developer",
          phone: "1234567890",
        },
        {},
        { id: testUser._id }
      );
      const res = mockResponse();

      await createProfile(req, res);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Profile created successfully");
      expect(res.body.profile.headline).toBe("Software Developer");
    });

    it("should return 400 when profile already exists", async () => {
      await Profile.create({
        user: testUser._id,
        profileType: "learner",
      });

      const req = mockRequest(
        { headline: "Developer" },
        {},
        { id: testUser._id }
      );
      const res = mockResponse();

      await createProfile(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Profile already exists");
    });

    it("should return 404 when user does not exist", async () => {
      await User.deleteMany({});

      const req = mockRequest(
        { headline: "Developer" },
        {},
        { id: testUser._id }
      );
      const res = mockResponse();

      await createProfile(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("User not found");
    });
  });

  describe("GET /api/profile/me", () => {
    beforeEach(async () => {
      testProfile = await Profile.create({
        user: testUser._id,
        profileType: "learner",
        headline: "Test Headline",
      });
    });

    it("should get own profile successfully", async () => {
      const req = mockRequest({}, {}, { id: testUser._id });
      const res = mockResponse();

      await getMyProfile(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.profile.headline).toBe("Test Headline");
    });

    it("should return 404 when profile does not exist", async () => {
      await Profile.deleteMany({});

      const req = mockRequest({}, {}, { id: testUser._id });
      const res = mockResponse();

      await getMyProfile(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Profile not found");
    });
  });

  describe("GET /api/profile/:userId", () => {
    beforeEach(async () => {
      testProfile = await Profile.create({
        user: testUser._id,
        profileType: "learner",
        headline: "Public Profile",
        isPublic: true,
      });
    });

    it("should get public profile by user ID", async () => {
      const req = mockRequest({}, { userId: testUser._id });
      const res = mockResponse();

      await getProfileById(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.profile.headline).toBe("Public Profile");
    });

    it("should return 403 when profile is private", async () => {
      testProfile.isPublic = false;
      await testProfile.save();

      const req = mockRequest({}, { userId: testUser._id });
      const res = mockResponse();

      await getProfileById(req, res);

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Profile is private");
    });

    it("should return 404 when profile does not exist", async () => {
      const fakeUserId = new mongoose.Types.ObjectId();
      const req = mockRequest({}, { userId: fakeUserId });
      const res = mockResponse();

      await getProfileById(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Profile not found");
    });
  });

  describe("PUT /api/profile", () => {
    beforeEach(async () => {
      testProfile = await Profile.create({
        user: testUser._id,
        profileType: "learner",
        headline: "Old Headline",
      });
    });

    it("should update profile successfully", async () => {
      const req = mockRequest(
        {
          headline: "New Headline",
          summary: "New Summary",
        },
        {},
        { id: testUser._id }
      );
      const res = mockResponse();

      await updateProfile(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Profile updated successfully");
      expect(res.body.profile.headline).toBe("New Headline");
      expect(res.body.profile.summary).toBe("New Summary");
    });

    it("should return 404 when profile does not exist", async () => {
      await Profile.deleteMany({});

      const req = mockRequest(
        { headline: "New Headline" },
        {},
        { id: testUser._id }
      );
      const res = mockResponse();

      await updateProfile(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Profile not found");
    });
  });

  describe("DELETE /api/profile", () => {
    beforeEach(async () => {
      testProfile = await Profile.create({
        user: testUser._id,
        profileType: "learner",
      });
    });

    it("should delete profile successfully", async () => {
      const req = mockRequest({}, {}, { id: testUser._id });
      const res = mockResponse();

      await deleteProfile(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Profile deleted successfully");
    });

    it("should return 404 when profile does not exist", async () => {
      await Profile.deleteMany({});

      const req = mockRequest({}, {}, { id: testUser._id });
      const res = mockResponse();

      await deleteProfile(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Profile not found");
    });
  });

  describe("GET /api/profile/search", () => {
    beforeEach(async () => {
      await Profile.create({
        user: testUser._id,
        profileType: "learner",
        headline: "JavaScript Developer",
        isPublic: true,
        skills: [{ name: "JavaScript", level: "advanced" }],
        location: { city: "New York", country: "USA" },
      });

      const user2 = await User.create({
        name: "User 2",
        email: "user2@example.com",
        password: "password123",
        role: "learner",
      });

      await Profile.create({
        user: user2._id,
        profileType: "learner",
        headline: "Python Developer",
        isPublic: true,
        skills: [{ name: "Python", level: "expert" }],
        location: { city: "San Francisco", country: "USA" },
      });
    });

    it("should search profiles successfully", async () => {
      const req = mockRequest({}, {}, null, {});
      const res = mockResponse();

      await searchProfiles(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBeGreaterThan(0);
      expect(res.body.profiles).toBeDefined();
    });

    it("should filter profiles by skills", async () => {
      const req = mockRequest({}, {}, null, { skills: "JavaScript" });
      const res = mockResponse();

      await searchProfiles(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.profiles[0].headline).toBe("JavaScript Developer");
    });

    it("should filter profiles by location", async () => {
      const req = mockRequest({}, {}, null, { location: "New York" });
      const res = mockResponse();

      await searchProfiles(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.profiles[0].location.city).toBe("New York");
    });

    it("should filter profiles by profileType", async () => {
      const req = mockRequest({}, {}, null, { profileType: "learner" });
      const res = mockResponse();

      await searchProfiles(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.profiles.length).toBeGreaterThan(0);
    });
  });

  describe("POST /api/profile/skills", () => {
    beforeEach(async () => {
      testProfile = await Profile.create({
        user: testUser._id,
        profileType: "learner",
      });
    });

    it("should add skill successfully", async () => {
      const req = mockRequest(
        {
          name: "JavaScript",
          level: "advanced",
          yearsOfExperience: 3,
        },
        {},
        { id: testUser._id }
      );
      const res = mockResponse();

      await addSkill(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Skill added successfully");
      expect(res.body.profile.skills.length).toBe(1);
      expect(res.body.profile.skills[0].name).toBe("JavaScript");
    });

    it("should return 404 when profile does not exist", async () => {
      await Profile.deleteMany({});

      const req = mockRequest(
        { name: "JavaScript", level: "advanced" },
        {},
        { id: testUser._id }
      );
      const res = mockResponse();

      await addSkill(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Profile not found");
    });
  });

  describe("PUT /api/profile/skills/:index", () => {
    beforeEach(async () => {
      testProfile = await Profile.create({
        user: testUser._id,
        profileType: "learner",
        skills: [{ name: "JavaScript", level: "beginner" }],
      });
    });

    it("should update skill successfully", async () => {
      const req = mockRequest(
        { name: "JavaScript", level: "advanced" },
        { index: "0" },
        { id: testUser._id }
      );
      const res = mockResponse();

      await updateSkill(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Skill updated successfully");
      expect(res.body.profile.skills[0].level).toBe("advanced");
    });

    it("should return 400 when index is invalid", async () => {
      const req = mockRequest(
        { level: "advanced" },
        { index: "10" },
        { id: testUser._id }
      );
      const res = mockResponse();

      await updateSkill(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Invalid skill index");
    });
  });

  describe("DELETE /api/profile/skills/:index", () => {
    beforeEach(async () => {
      testProfile = await Profile.create({
        user: testUser._id,
        profileType: "learner",
        skills: [{ name: "JavaScript", level: "advanced" }],
      });
    });

    it("should remove skill successfully", async () => {
      const req = mockRequest({}, { index: "0" }, { id: testUser._id });
      const res = mockResponse();

      await removeSkill(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Skill removed successfully");
      expect(res.body.profile.skills.length).toBe(0);
    });

    it("should return 400 when index is invalid", async () => {
      const req = mockRequest({}, { index: "10" }, { id: testUser._id });
      const res = mockResponse();

      await removeSkill(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Invalid skill index");
    });
  });

  describe("POST /api/profile/experience", () => {
    beforeEach(async () => {
      testProfile = await Profile.create({
        user: testUser._id,
        profileType: "learner",
      });
    });

    it("should add experience successfully", async () => {
      const req = mockRequest(
        {
          title: "Software Engineer",
          company: "Tech Corp",
          startDate: "2020-01-01",
          endDate: "2022-12-31",
        },
        {},
        { id: testUser._id }
      );
      const res = mockResponse();

      await addExperience(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Experience added successfully");
      expect(res.body.profile.experience.length).toBe(1);
      expect(res.body.profile.experience[0].title).toBe("Software Engineer");
    });
  });

  describe("PUT /api/profile/experience/:index", () => {
    beforeEach(async () => {
      testProfile = await Profile.create({
        user: testUser._id,
        profileType: "learner",
        experience: [
          {
            title: "Junior Developer",
            company: "Tech Corp",
            startDate: "2020-01-01",
          },
        ],
      });
    });

    it("should update experience successfully", async () => {
      const req = mockRequest(
        { title: "Senior Developer" },
        { index: "0" },
        { id: testUser._id }
      );
      const res = mockResponse();

      await updateExperience(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Experience updated successfully");
      expect(res.body.profile.experience[0].title).toBe("Senior Developer");
    });

    it("should return 400 when index is invalid", async () => {
      const req = mockRequest(
        { title: "Senior Developer" },
        { index: "10" },
        { id: testUser._id }
      );
      const res = mockResponse();

      await updateExperience(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Invalid experience index");
    });
  });

  describe("DELETE /api/profile/experience/:index", () => {
    beforeEach(async () => {
      testProfile = await Profile.create({
        user: testUser._id,
        profileType: "learner",
        experience: [
          {
            title: "Developer",
            company: "Tech Corp",
            startDate: "2020-01-01",
          },
        ],
      });
    });

    it("should remove experience successfully", async () => {
      const req = mockRequest({}, { index: "0" }, { id: testUser._id });
      const res = mockResponse();

      await removeExperience(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Experience removed successfully");
      expect(res.body.profile.experience.length).toBe(0);
    });
  });

  describe("POST /api/profile/education", () => {
    beforeEach(async () => {
      testProfile = await Profile.create({
        user: testUser._id,
        profileType: "learner",
      });
    });

    it("should add education successfully", async () => {
      const req = mockRequest(
        {
          degree: "Bachelor of Science",
          institution: "University of Test",
          startDate: "2015-09-01",
          endDate: "2019-06-30",
        },
        {},
        { id: testUser._id }
      );
      const res = mockResponse();

      await addEducation(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Education added successfully");
      expect(res.body.profile.education.length).toBe(1);
      expect(res.body.profile.education[0].degree).toBe("Bachelor of Science");
    });
  });

  describe("PUT /api/profile/education/:index", () => {
    beforeEach(async () => {
      testProfile = await Profile.create({
        user: testUser._id,
        profileType: "learner",
        education: [
          {
            degree: "Bachelor",
            institution: "University",
            startDate: "2015-09-01",
          },
        ],
      });
    });

    it("should update education successfully", async () => {
      const req = mockRequest(
        { degree: "Master of Science" },
        { index: "0" },
        { id: testUser._id }
      );
      const res = mockResponse();

      await updateEducation(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Education updated successfully");
      expect(res.body.profile.education[0].degree).toBe("Master of Science");
    });

    it("should return 400 when index is invalid", async () => {
      const req = mockRequest(
        { degree: "Master" },
        { index: "10" },
        { id: testUser._id }
      );
      const res = mockResponse();

      await updateEducation(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Invalid education index");
    });
  });

  describe("DELETE /api/profile/education/:index", () => {
    beforeEach(async () => {
      testProfile = await Profile.create({
        user: testUser._id,
        profileType: "learner",
        education: [
          {
            degree: "Bachelor",
            institution: "University",
            startDate: "2015-09-01",
          },
        ],
      });
    });

    it("should remove education successfully", async () => {
      const req = mockRequest({}, { index: "0" }, { id: testUser._id });
      const res = mockResponse();

      await removeEducation(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Education removed successfully");
      expect(res.body.profile.education.length).toBe(0);
    });
  });

  describe("POST /api/profile/certifications", () => {
    beforeEach(async () => {
      testProfile = await Profile.create({
        user: testUser._id,
        profileType: "learner",
      });
    });

    it("should add certification successfully", async () => {
      const req = mockRequest(
        {
          name: "AWS Certified Developer",
          issuer: "Amazon",
          issueDate: "2022-01-01",
        },
        {},
        { id: testUser._id }
      );
      const res = mockResponse();

      await addCertification(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Certification added successfully");
      expect(res.body.profile.certifications.length).toBe(1);
      expect(res.body.profile.certifications[0].name).toBe(
        "AWS Certified Developer"
      );
    });
  });

  describe("PUT /api/profile/certifications/:index", () => {
    beforeEach(async () => {
      testProfile = await Profile.create({
        user: testUser._id,
        profileType: "learner",
        certifications: [
          {
            name: "AWS Developer",
            issuer: "Amazon",
            issueDate: "2022-01-01",
          },
        ],
      });
    });

    it("should update certification successfully", async () => {
      const req = mockRequest(
        { name: "AWS Solutions Architect" },
        { index: "0" },
        { id: testUser._id }
      );
      const res = mockResponse();

      await updateCertification(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Certification updated successfully");
      expect(res.body.profile.certifications[0].name).toBe(
        "AWS Solutions Architect"
      );
    });

    it("should return 400 when index is invalid", async () => {
      const req = mockRequest(
        { name: "New Cert" },
        { index: "10" },
        { id: testUser._id }
      );
      const res = mockResponse();

      await updateCertification(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Invalid certification index");
    });
  });

  describe("DELETE /api/profile/certifications/:index", () => {
    beforeEach(async () => {
      testProfile = await Profile.create({
        user: testUser._id,
        profileType: "learner",
        certifications: [
          {
            name: "AWS Developer",
            issuer: "Amazon",
            issueDate: "2022-01-01",
          },
        ],
      });
    });

    it("should remove certification successfully", async () => {
      const req = mockRequest({}, { index: "0" }, { id: testUser._id });
      const res = mockResponse();

      await removeCertification(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Certification removed successfully");
      expect(res.body.profile.certifications.length).toBe(0);
    });
  });

  describe("GET /api/profile/completion", () => {
    beforeEach(async () => {
      testProfile = await Profile.create({
        user: testUser._id,
        profileType: "learner",
        headline: "Developer",
        summary: "Experienced developer",
        skills: [{ name: "JavaScript", level: "advanced" }],
      });
    });

    it("should get profile completion status", async () => {
      const req = mockRequest({}, {}, { id: testUser._id });
      const res = mockResponse();

      await getProfileCompletion(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.completion).toBeDefined();
      expect(res.body.completion.sections.headline).toBe(true);
      expect(res.body.completion.sections.summary).toBe(true);
      expect(res.body.completion.sections.skills).toBe(true);
    });

    it("should return 404 when profile does not exist", async () => {
      await Profile.deleteMany({});

      const req = mockRequest({}, {}, { id: testUser._id });
      const res = mockResponse();

      await getProfileCompletion(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Profile not found");
    });
  });
});
