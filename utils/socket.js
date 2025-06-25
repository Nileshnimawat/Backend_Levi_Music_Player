import { Server } from "socket.io";

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

  // console.log(io)

  const userSockets = new Map();       // userId => socketId
  const userActivities = new Map();    // userId => activity object
  const userInfoMap = new Map();       // userId => { _id, username, avatar }

  io.on("connection", (socket) => {
    
    
    socket.on("user_connected", (user) => {
      console.log(`User Connected Socket ID : ${socket.id} User : ${user.name} UserID : ${user._id}`);
      const { _id, name, coverImage } = user;

      userSockets.set(_id, socket.id);
      userActivities.set(_id, { status: "Idle" });
      userInfoMap.set(_id, { _id, name: user.name, coverImage });

      io.emit("user_connected", { _id, name, coverImage });
      
      socket.emit("users_online", Array.from(userSockets.keys()));
      socket.emit("activities", Array.from(userActivities.entries()));
      socket.emit("users_info", Array.from(userInfoMap.entries()));

      console.log(userActivities)
      console.log(userSockets)
      console.log(userInfoMap)
    });

    // Music playback auto-sets activity
    socket.on("update_current_music", ({ userId, music }) => {
      const title = music?.title || null;
      const artist = music?.artist || null;

      const activity = title && artist
        ? { status: "Playing", title, artist }
        : { status: "Idle" };

      userActivities.set(userId, activity);
      io.emit("activity_updated", { userId, activity });
    });


    socket.on("disconnect", () => {
      let disconnectedUserId = null;

      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          disconnectedUserId = userId;
          userSockets.delete(userId);
          userActivities.delete(userId);
          userInfoMap.delete(userId);
          break;
        }
      }

      if (disconnectedUserId) {
        console.log("User Disconnected Successfully : ", disconnectedUserId);
        io.emit("user_disconnected", disconnectedUserId);
      }
    });
  });
};
