import Profile from "../models/profile.model.js";
import ProfileSummary from "../models/profilesummary.model.js";
import Job from "../models/job.model.js";
import SkillProgram from "../models/skillprogram.model.js";

const calculateSkillMatch = (userSkills, requiredSkills) => {
  if (!requiredSkills || requiredSkills.length === 0) return 100;
  if (!userSkills || userSkills.length === 0) return 0;

  const userSkillNames = userSkills.map((s) =>
    (typeof s === "string" ? s : s.name).toLowerCase()
  );

  let matchCount = 0;
  for (const required of requiredSkills) {
    const reqName = (
      typeof required === "string" ? required : required.name || required
    ).toLowerCase();
    if (
      userSkillNames.some(
        (name) => name.includes(reqName) || reqName.includes(name)
      )
    ) {
      matchCount++;
    }
  }

  return Math.round((matchCount / requiredSkills.length) * 100);
};

const calculateLocationMatch = (userLocation, jobLocation, userPreferences) => {
  if (!jobLocation) return 100;

  const preferredLocations = userPreferences?.preferredLocations || [];
  const willingToRelocate = userPreferences?.willingToRelocate || false;

  if (userLocation?.city && jobLocation?.city) {
    if (userLocation.city.toLowerCase() === jobLocation.city.toLowerCase()) {
      return 100;
    }
  }

  if (preferredLocations.length > 0) {
    const jobCity = (jobLocation.city || "").toLowerCase();
    const jobState = (jobLocation.state || "").toLowerCase();
    for (const loc of preferredLocations) {
      const prefLoc = loc.toLowerCase();
      if (
        jobCity.includes(prefLoc) ||
        prefLoc.includes(jobCity) ||
        jobState.includes(prefLoc) ||
        prefLoc.includes(jobState)
      ) {
        return 80;
      }
    }
  }

  if (willingToRelocate) return 60;

  return 30;
};

const calculateJobTypeMatch = (userPreferences, jobType) => {
  if (!userPreferences?.jobTypes || userPreferences.jobTypes.length === 0)
    return 100;
  if (!jobType) return 50;

  return userPreferences.jobTypes.includes(jobType) ? 100 : 40;
};

const calculateWorkModeMatch = (userPreferences, workMode) => {
  if (!userPreferences?.workMode || userPreferences.workMode.length === 0)
    return 100;
  if (!workMode) return 50;

  return userPreferences.workMode.includes(workMode) ? 100 : 40;
};

const calculateSalaryMatch = (userExpectation, jobSalary) => {
  if (!userExpectation?.min || !jobSalary?.min) return 70;

  const userMin = userExpectation.min;
  const jobMax = jobSalary.max || jobSalary.min;

  if (jobMax >= userMin) return 100;
  if (jobMax >= userMin * 0.8) return 70;
  if (jobMax >= userMin * 0.6) return 50;
  return 30;
};

const calculateOverallJobMatch = (profile, job) => {
  const weights = {
    skills: 0.4,
    location: 0.15,
    jobType: 0.15,
    workMode: 0.15,
    salary: 0.15,
  };

  const skillScore = calculateSkillMatch(profile.skills, job.requiredSkills);
  const locationScore = calculateLocationMatch(
    profile.location,
    job.location,
    profile.preferences
  );
  const jobTypeScore = calculateJobTypeMatch(
    profile.preferences,
    job.employmentType
  );
  const workModeScore = calculateWorkModeMatch(
    profile.preferences,
    job.workMode
  );
  const salaryScore = calculateSalaryMatch(
    profile.preferences?.expectedSalary,
    job.salary
  );

  const overall = Math.round(
    skillScore * weights.skills +
      locationScore * weights.location +
      jobTypeScore * weights.jobType +
      workModeScore * weights.workMode +
      salaryScore * weights.salary
  );

  return {
    overall,
    breakdown: {
      skills: skillScore,
      location: locationScore,
      jobType: jobTypeScore,
      workMode: workModeScore,
      salary: salaryScore,
    },
  };
};

const calculateProgramMatch = (profile, program) => {
  const userSkillNames = (profile.skills || []).map((s) =>
    (typeof s === "string" ? s : s.name).toLowerCase()
  );

  const programSkills = (program.skillsCovered || []).map((s) =>
    s.toLowerCase()
  );

  let relevanceScore = 0;

  for (const programSkill of programSkills) {
    const hasSkill = userSkillNames.some(
      (us) => us.includes(programSkill) || programSkill.includes(us)
    );
    if (hasSkill) {
      relevanceScore += 10;
    } else {
      relevanceScore += 20;
    }
  }

  const isBeginnerProgram = program.level === "beginner";
  const userExperience = profile.experience?.length || 0;

  if (isBeginnerProgram && userExperience === 0) {
    relevanceScore += 15;
  }

  return Math.min(relevanceScore, 100);
};

export const getMatchedJobs = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    const { page = 1, limit = 10, minScore = 0 } = req.query;

    const jobs = await Job.find({ status: "active" })
      .populate("createdBy", "name")
      .sort({ createdAt: -1 })
      .limit(100);

    const matchedJobs = jobs.map((job) => {
      const matchScore = calculateOverallJobMatch(profile, job);
      return {
        job: job.toObject(),
        matchScore: matchScore.overall,
        breakdown: matchScore.breakdown,
      };
    });

    const filteredJobs = matchedJobs
      .filter((item) => item.matchScore >= Number(minScore))
      .sort((a, b) => b.matchScore - a.matchScore);

    const startIndex = (Number(page) - 1) * Number(limit);
    const paginatedJobs = filteredJobs.slice(
      startIndex,
      startIndex + Number(limit)
    );

    res.status(200).json({
      success: true,
      data: paginatedJobs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: filteredJobs.length,
        pages: Math.ceil(filteredJobs.length / Number(limit)),
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const getMatchedPrograms = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    const { page = 1, limit = 10 } = req.query;

    const programs = await SkillProgram.find({ isActive: true })
      .sort({ rating: -1, enrollmentCount: -1 })
      .limit(50);

    const matchedPrograms = programs.map((program) => {
      const matchScore = calculateProgramMatch(profile, program);
      return {
        program: program.toObject(),
        matchScore,
      };
    });

    const sortedPrograms = matchedPrograms.sort(
      (a, b) => b.matchScore - a.matchScore
    );

    const startIndex = (Number(page) - 1) * Number(limit);
    const paginatedPrograms = sortedPrograms.slice(
      startIndex,
      startIndex + Number(limit)
    );

    res.status(200).json({
      success: true,
      data: paginatedPrograms,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: sortedPrograms.length,
        pages: Math.ceil(sortedPrograms.length / Number(limit)),
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const getJobMatchScore = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const matchScore = calculateOverallJobMatch(profile, job);

    res.status(200).json({
      success: true,
      data: {
        jobId: job._id,
        matchScore: matchScore.overall,
        breakdown: matchScore.breakdown,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const getRecommendations = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    const jobs = await Job.find({ status: "active" })
      .populate("createdBy", "name")
      .sort({ createdAt: -1 })
      .limit(50);

    const matchedJobs = jobs.map((job) => ({
      job: job.toObject(),
      matchScore: calculateOverallJobMatch(profile, job).overall,
    }));

    const topJobs = matchedJobs
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5);

    const programs = await SkillProgram.find({ isActive: true })
      .sort({ rating: -1 })
      .limit(30);

    const matchedPrograms = programs.map((program) => ({
      program: program.toObject(),
      matchScore: calculateProgramMatch(profile, program),
    }));

    const topPrograms = matchedPrograms
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5);

    const userSkillNames = (profile.skills || []).map((s) =>
      (typeof s === "string" ? s : s.name).toLowerCase()
    );

    const allJobSkills = jobs.flatMap((j) =>
      (j.requiredSkills || []).map((s) => (typeof s === "string" ? s : s.name))
    );
    const skillDemand = {};
    for (const skill of allJobSkills) {
      const skillLower = skill.toLowerCase();
      skillDemand[skillLower] = (skillDemand[skillLower] || 0) + 1;
    }

    const suggestedSkills = Object.entries(skillDemand)
      .filter(([skill]) => !userSkillNames.includes(skill))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([skill, count]) => ({ skill, demandCount: count }));

    res.status(200).json({
      success: true,
      data: {
        topJobs,
        topPrograms,
        suggestedSkills,
        profileCompleteness: profile.profileCompletion || 0,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const syncProfileSummary = async (userId) => {
  try {
    const profile = await Profile.findOne({ user: userId });
    if (!profile) return null;

    const totalExperience = (profile.experience || []).reduce((total, exp) => {
      if (!exp.startDate) return total;
      const start = new Date(exp.startDate);
      const end = exp.isCurrent
        ? new Date()
        : exp.endDate
        ? new Date(exp.endDate)
        : new Date();
      const years = (end - start) / (1000 * 60 * 60 * 24 * 365);
      return total + Math.max(0, years);
    }, 0);

    const summaryData = {
      user: profile.user,
      profileType: profile.profileType,
      skills: (profile.skills || []).map((s) => ({
        name: typeof s === "string" ? s : s.name,
        level: typeof s === "string" ? "intermediate" : s.level,
        yearsOfExperience: typeof s === "string" ? 0 : s.yearsOfExperience,
      })),
      totalExperienceYears: Math.round(totalExperience * 10) / 10,
      location: profile.location || {},
      preferences: {
        jobTypes: profile.preferences?.jobTypes || [],
        workModes: profile.preferences?.workMode || [],
        salaryExpectation: profile.preferences?.expectedSalary || {},
        willingToRelocate: profile.preferences?.willingToRelocate || false,
        preferredLocations: profile.preferences?.preferredLocations || [],
      },
      headline: profile.headline || "",
      isAvailableForWork: true,
      profileCompleteness: profile.profileCompletion || 0,
      companyName: profile.companyDetails?.name || "",
      industryType: profile.companyDetails?.industry || "",
      lastSyncedAt: new Date(),
    };

    const summary = await ProfileSummary.findOneAndUpdate(
      { user: userId },
      summaryData,
      { upsert: true, new: true }
    );

    return summary;
  } catch (error) {
    console.error("Error syncing profile summary:", error);
    return null;
  }
};
