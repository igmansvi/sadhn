import api from "../api";

export const jobService = {
  getJobs: async (filters = {}) => {
    const response = await api.get("/jobs", { params: filters });
    return response.data;
  },

  getJobById: async (id) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  createJob: async (jobData) => {
    const response = await api.post("/jobs", jobData);
    return response.data;
  },

  updateJob: async (id, jobData) => {
    const response = await api.put(`/jobs/${id}`, jobData);
    return response.data;
  },

  deleteJob: async (id) => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  },

  getMyJobs: async (filters = {}) => {
    const response = await api.get("/jobs/my/jobs", { params: filters });
    return response.data;
  },

  searchJobs: async (searchParams) => {
    const response = await api.get("/jobs/search", { params: searchParams });
    return response.data;
  },
};
