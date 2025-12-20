import axios from "@/lib/api";

export const newsService = {
  getAllNews: async (params = {}) => {
    return await axios.get("/news", { params });
  },
};
