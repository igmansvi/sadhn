import api from "../api";

export const dashboardService = {
  getDashboard: async () => {
    const response = await api.get("/dashboard");
    return response.data;
  },

  getLearnerDashboard: async () => {
    const response = await api.get("/dashboard/learner");
    return response.data;
  },

  getEmployerDashboard: async () => {
    const response = await api.get("/dashboard/recruiter");
    return response.data;
  },

  getAdminDashboard: async () => {
    const response = await api.get("/dashboard/admin");
    return response.data;
  },
};
