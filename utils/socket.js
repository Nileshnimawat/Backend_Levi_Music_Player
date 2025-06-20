import { Server } from "socket.io";
import { Message } from "../models/message.model.js";

export const initializeSocket = (server) => {
const allowedOrigins = [
  "http://localhost:5173",
  "https://twitter-lite-frontend.vercel.app",
  "https://frontend-levi-music.vercel.app",
  "https://frontend-levi-music-31jsnk76v-nilesh-nimawats-projects.vercel.app",
  "https://frontend-levi-music-git-master-nilesh-nimawats-projects.vercel.app",
];

  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
       methods: ["GET", "POST", "PUT", "DELETE"]
    },
  });

  const userSockets = new Map(); // { userId: socketId}
  const userActivities = new Map(); // {userId: activity}

  io.on("connection", (socket) => {
    socket.on("user_connected", (userId) => {
      userSockets.set(userId, socket.id);
      userActivities.set(userId, "Idle");

      // broadcast to all connected sockets that this user just logged in
      io.emit("user_connected", userId);

      socket.emit("users_online", Array.from(userSockets.keys()));

      io.emit("activities", Array.from(userActivities.entries()));
    });

    socket.on("update_activity", ({ userId, activity }) => {
      console.log("activity updated", userId, activity);
      userActivities.set(userId, activity);
      io.emit("activity_updated", { userId, activity });
    });

    socket.on("send_message", async (data) => {
      try {
        const { senderId, receiverId, content } = data;

        const message = await Message.create({
          senderId,
          receiverId,
          content,
        });

        // send to receiver in realtime, if they're online
        const receiverSocketId = userSockets.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receive_message", message);
        }

        socket.emit("message_sent", message);
      } catch (error) {
        console.error("Message error:", error);
        socket.emit("message_error", error.message);
      }
    });

    socket.on("disconnect", () => {
      let disconnectedUserId;
      for (const [userId, socketId] of userSockets.entries()) {
        // find disconnected user
        if (socketId === socket.id) {
          disconnectedUserId = userId;
          userSockets.delete(userId);
          userActivities.delete(userId);
          break;
        }
      }
      if (disconnectedUserId) {
        io.emit("user_disconnected", disconnectedUserId);
      }
    });
  });
};
