import { Server } from "socket.io";
import registerUserHandlers from "./userHandlers.js";
import registerRoomHandlers from "./roomHandlers.js";
import registerMusicHandlers from "./musicHandlers.js";

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

  const userSockets = new Map();
  const userActivities = new Map();
  const userInfoMap = new Map();

  io.on("connection", (socket) => {
    socket.data.userId = socket.handshake.query.userId;

    // Modular handlers
    registerUserHandlers(io, socket, userSockets, userActivities, userInfoMap);
    registerRoomHandlers(io, socket);
    registerMusicHandlers(io, socket);

    console.log("🟢 New socket connected:", socket.id);
  });
};
