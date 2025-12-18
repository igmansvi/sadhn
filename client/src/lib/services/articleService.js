import api from "../api";

export const articleService = {
  getArticles: async (filters = {}) => {
    const response = await api.get("/articles", { params: filters });
    return response.data;
  },

  getArticleById: async (id) => {
    const response = await api.get(`/articles/${id}`);
    return response.data;
  },

  createArticle: async (articleData) => {
    const response = await api.post("/articles", articleData);
    return response.data;
  },

  updateArticle: async (id, articleData) => {
    const response = await api.put(`/articles/${id}`, articleData);
    return response.data;
  },

  deleteArticle: async (id) => {
    const response = await api.delete(`/articles/${id}`);
    return response.data;
  },

  getMyArticles: async (filters = {}) => {
    const response = await api.get("/articles/my/articles", {
      params: filters,
    });
    return response.data;
  },

  publishArticle: async (id) => {
    const response = await api.patch(`/articles/${id}/publish`);
    return response.data;
  },

  searchArticles: async (params) => {
    const response = await api.get("/articles/search", { params });
    return response.data;
  },
};
