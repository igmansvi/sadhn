import api from "../api";

export const skillProgramService = {
  getPrograms: async (filters = {}) => {
    const response = await api.get("/skill-programs", { params: filters });
    return response.data;
  },

  getProgramById: async (id) => {
    const response = await api.get(`/skill-programs/${id}`);
    return response.data;
  },

  createProgram: async (programData) => {
    const response = await api.post("/skill-programs", programData);
    return response.data;
  },

  updateProgram: async (id, programData) => {
    const response = await api.put(`/skill-programs/${id}`, programData);
    return response.data;
  },

  deleteProgram: async (id) => {
    const response = await api.delete(`/skill-programs/${id}`);
    return response.data;
  },

  searchPrograms: async (params) => {
    const response = await api.get("/skill-programs/search", { params });
    return response.data;
  },

  getProgramsBySkills: async (skills) => {
    const response = await api.post("/skill-programs/by-skills", { skills });
    return response.data;
  },
};

export default skillProgramService;
