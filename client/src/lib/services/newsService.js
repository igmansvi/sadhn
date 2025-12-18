import api from "../api";

export const newsService = {
  getNews: async (filters = {}) => {
    const response = await api.get("/news", { params: filters });
    return response.data;
  },

  getNewsById: async (id) => {
    const response = await api.get(`/news/${id}`);
    return response.data;
  },

  createNews: async (newsData) => {
    const response = await api.post("/news", newsData);
    return response.data;
  },

  updateNews: async (id, newsData) => {
    const response = await api.put(`/news/${id}`, newsData);
    return response.data;
  },

  deleteNews: async (id) => {
    const response = await api.delete(`/news/${id}`);
    return response.data;
  },

  deactivateNews: async (id) => {
    const response = await api.patch(`/news/${id}/deactivate`);
    return response.data;
  },
};
