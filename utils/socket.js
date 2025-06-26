import { Server } from "socket.io";
import {
  createRoom,
  joinRoom,
  sendMessage,
  getRoomMessages,
  leaveRoom,
  leaveAllRooms,
  getRoomUsers,
} from "./chatManager.js";

export const initializeSocket = (server) => {
  console.log("🧠 Socket.IO initialized...");

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
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  const userSockets = new Map(); // userId => socketId
  const userActivities = new Map(); // userId => activity
  const userInfoMap = new Map(); // userId => {_id, name, coverImage}

  io.on("connection", (socket) => {
    socket.on("user_connected", (user) => {
      const { _id, name, coverImage } = user;
      console.log(`🟢 User Connected: ${socket.id}, User: ${name}, ID: ${_id}`);

      userSockets.set(_id, socket.id);
      userActivities.set(_id, { status: "Idle" });
      userInfoMap.set(_id, { _id, name, coverImage });

      io.emit("user_connected", { _id, name, coverImage });

      socket.emit("users_online", Array.from(userSockets.keys()));
      socket.emit("activities", Array.from(userActivities.entries()));
      socket.emit("users_info", Array.from(userInfoMap.entries()));

      socket.data.userId = _id;
    });


    socket.on("update_current_music", ({ userId, music }) => {
      const { title = null, artist = null } = music || {};
      const activity =
        title && artist ? { status: "Playing", title, artist } : { status: "Idle" };

      userActivities.set(userId, activity);
      io.emit("activity_updated", { userId, activity });
    });

    socket.on("create_room", (callback) => {
      const roomId = createRoom();
      console.log("🆕 New room created:", roomId);
      callback(roomId);
    });

    socket.on("join_room", ({ roomId, user }) => {
      const User = {
        _id: user._id,
        name: user.name,
        coverImage: user.coverImage,
      };
      joinRoom(socket, roomId, User);
      console.log(`${User.name} joined room ${roomId}`);

      const messages = getRoomMessages(roomId);
      const users = getRoomUsers(roomId);

      socket.emit("room_messages", messages);
      io.to(roomId).emit("room_users", users);
    });

 
    socket.on("leave_room", ({ roomId, userId }) => {
      leaveRoom(socket, roomId, userId);

      const users = getRoomUsers(roomId);
      io.to(roomId).emit("room_users", users);
      io.to(roomId).emit("user_left", userId);

      console.log(`🚪 User ${userId} left room ${roomId}`);
    });

   
    socket.on("send_message", ({ roomId, message }) => {
      const User = {
        _id: message.user._id,
        name: message.user.name,
        coverImage: message.user.coverImage,
      };

      const messageObj = {
        user: User,
        text: message.text,
        timestamp: Date.now(),
      };

      sendMessage(roomId, messageObj);
      io.to(roomId).emit("receive_message", messageObj);
    });


    socket.on("disconnect", () => {
      const userId = socket.data.userId;
      if (!userId) return;

      userSockets.delete(userId);
      userActivities.delete(userId);
      userInfoMap.delete(userId);

      const rooms = leaveAllRooms(socket, userId);
      rooms.forEach((roomId) => {
        const users = getRoomUsers(roomId);
        io.to(roomId).emit("room_users", users);
        io.to(roomId).emit("user_left", userId);
      });

      console.log("🔴 User Disconnected:", userId);
      io.emit("user_disconnected", userId);
    });
  });
};
