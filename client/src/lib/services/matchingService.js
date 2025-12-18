import api from "../api";

export const matchingService = {
  getMatchedJobs: async (params = {}) => {
    const response = await api.get("/matching/jobs", { params });
    return response.data;
  },

  getMatchedPrograms: async (params = {}) => {
    const response = await api.get("/matching/programs", { params });
    return response.data;
  },

  getMatchScore: async (jobId) => {
    const response = await api.get(`/matching/jobs/${jobId}/score`);
    return response.data;
  },

  getRecommendations: async () => {
    const response = await api.get("/matching/recommendations");
    return response.data;
  },
};
