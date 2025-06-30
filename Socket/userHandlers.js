import { handleDisconnect } from "./RedisChatManager.js";

export default function registerUserHandlers(io, socket, userSockets, userActivities, userInfoMap) {
  socket.on("user_connected", (user) => {
    const { _id, name, coverImage } = user;
    userSockets.set(_id, socket.id);
    userActivities.set(_id, { status: "Idle" });
    userInfoMap.set(_id, { _id, name, coverImage });

    socket.data.userId = _id;

    io.emit("user_connected", { _id, name, coverImage });
    socket.emit("users_online", Array.from(userSockets.keys()));
    socket.emit("activities", Array.from(userActivities.entries()));
    socket.emit("users_info", Array.from(userInfoMap.entries()));
  });

  socket.on("update_current_music", ({ userId, music }) => {
    const activity = music?.title && music?.artist
      ? { status: "Playing", title: music.title, artist: music.artist }
      : { status: "Idle" };

    userActivities.set(userId, activity);
    io.emit("activity_updated", { userId, activity });
  });

  socket.on("disconnect", async () => {
    const userId = socket.data.userId;
    if (!userId) return;

    await handleDisconnect(userId);

    userSockets.delete(userId);
    userActivities.delete(userId);
    userInfoMap.delete(userId);

    io.emit("user_disconnected", userId);
    console.log("🔴 User Disconnected:", userId);
  });
}
