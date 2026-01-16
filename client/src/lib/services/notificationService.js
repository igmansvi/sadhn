import axios from "@/lib/api";

export const notificationService = {
  getNotifications: async () => {
    return await axios.get("/notifications");
  },

  markAsRead: async (id = null) => {
    const url = id ? `/notifications/${id}/read` : "/notifications/read";
    return await axios.put(url);
  },

  sendNotification: async (data) => {
    return await axios.post("/notifications/send", data);
  },
};
