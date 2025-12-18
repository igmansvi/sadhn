import api from "../api";

export const applicationService = {
  applyToJob: async (applicationData) => {
    const response = await api.post("/applications", applicationData);
    return response.data;
  },

  getMyApplications: async (filters = {}) => {
    const response = await api.get("/applications/my/applications", {
      params: filters,
    });
    return response.data;
  },

  getEmployerApplications: async (filters = {}) => {
    const response = await api.get("/applications/employer/all", {
      params: filters,
    });
    return response.data;
  },

  getJobApplications: async (jobId, filters = {}) => {
    const response = await api.get(`/applications/job/${jobId}`, {
      params: filters,
    });
    return response.data;
  },

  getApplicationById: async (id) => {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },

  updateApplicationStatus: async (id, statusData) => {
    const response = await api.patch(`/applications/${id}/status`, statusData);
    return response.data;
  },

  withdrawApplication: async (id) => {
    const response = await api.patch(`/applications/${id}/withdraw`);
    return response.data;
  },
};
