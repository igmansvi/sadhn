import axios from "@/lib/api";

export const newsService = {
  getNews: async (params = {}) => {
    const response = await axios.get("/news", { 
      params: { ...params, includeInactive: 'true' } 
    });
    return response.data;
  },

  getAllNews: async (params = {}) => {
    return await axios.get("/news", { params });
  },

  getNewsById: async (id) => {
    const response = await axios.get(`/news/${id}`);
    return response.data;
  },

  createNews: async (data) => {
    const response = await axios.post("/news", data);
    return response.data;
  },

  updateNews: async (id, data) => {
    const response = await axios.put(`/news/${id}`, data);
    return response.data;
  },

  deleteNews: async (id) => {
    const response = await axios.delete(`/news/${id}`);
    return response.data;
  },

  deactivateNews: async (id) => {
    const response = await axios.patch(`/news/${id}/deactivate`);
    return response.data;
  },
};
