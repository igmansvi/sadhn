import api from "../api";

export const profileService = {
  createProfile: async (profileData) => {
    const response = await api.post("/profile", profileData);
    return response.data;
  },

  getMyProfile: async () => {
    const response = await api.get("/profile/me");
    return response.data;
  },

  getProfileById: async (userId) => {
    const response = await api.get(`/profile/${userId}`);
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put("/profile", profileData);
    return response.data;
  },

  deleteProfile: async () => {
    const response = await api.delete("/profile");
    return response.data;
  },

  searchProfiles: async (params) => {
    const response = await api.get("/profile/search", { params });
    return response.data;
  },

  getProfileCompletion: async () => {
    const response = await api.get("/profile/completion");
    return response.data;
  },

  addSkill: async (skillData) => {
    const response = await api.post("/profile/skills", skillData);
    return response.data;
  },

  updateSkill: async (skillId, skillData) => {
    const response = await api.patch(`/profile/skills/${skillId}`, skillData);
    return response.data;
  },

  removeSkill: async (skillId) => {
    const response = await api.delete(`/profile/skills/${skillId}`);
    return response.data;
  },

  addExperience: async (experienceData) => {
    const response = await api.post("/profile/experience", experienceData);
    return response.data;
  },

  updateExperience: async (expId, experienceData) => {
    const response = await api.patch(
      `/profile/experience/${expId}`,
      experienceData
    );
    return response.data;
  },

  removeExperience: async (expId) => {
    const response = await api.delete(`/profile/experience/${expId}`);
    return response.data;
  },

  addEducation: async (educationData) => {
    const response = await api.post("/profile/education", educationData);
    return response.data;
  },

  updateEducation: async (eduId, educationData) => {
    const response = await api.patch(
      `/profile/education/${eduId}`,
      educationData
    );
    return response.data;
  },

  removeEducation: async (eduId) => {
    const response = await api.delete(`/profile/education/${eduId}`);
    return response.data;
  },

  addCertification: async (certData) => {
    const response = await api.post("/profile/certifications", certData);
    return response.data;
  },

  updateCertification: async (certId, certData) => {
    const response = await api.patch(
      `/profile/certifications/${certId}`,
      certData
    );
    return response.data;
  },

  removeCertification: async (certId) => {
    const response = await api.delete(`/profile/certifications/${certId}`);
    return response.data;
  },

  getProfileSummary: async () => {
    const response = await api.get("/profile/summary");
    return response.data;
  },

  syncProfileSummary: async () => {
    const response = await api.post("/profile/summary/sync");
    return response.data;
  },

  checkProfileExists: async () => {
    const response = await api.get("/profile/exists");
    return response.data;
  },
};
