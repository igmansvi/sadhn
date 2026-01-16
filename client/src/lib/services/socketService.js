import { io } from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(userId) {
    if (this.socket) return;

    const url = import.meta.env.VITE_API_URL || "http://localhost:5000";

    this.socket = io(url, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    this.socket.on("connect", () => {
      console.log("Connected to socket server");
      this.socket.emit("join", userId);
    });

    this.socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event) {
    if (this.socket) {
      this.socket.off(event);
    }
  }
}

export const socketService = new SocketService();
