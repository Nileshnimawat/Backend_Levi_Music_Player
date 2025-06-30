import { getRoomOwner } from "./RedisChatManager.js";

export default function registerMusicHandlers(io, socket) {
  socket.on("send_music", async ({ roomId, music }) => {
    const userId = socket.data.userId;
    const ownerId = await getRoomOwner(roomId);
    if (userId !== ownerId) return;
    io.to(roomId).emit("receive_music", { music });
    socket.emit("receive_music", { music });
  });

  socket.on("toggle_play_pause", async ({ isPlaying, roomId }) => {
    const userId = socket.data.userId;
    const ownerId = await getRoomOwner(roomId);
    if (userId !== ownerId) return;
    socket.to(roomId).emit("receive_play_pause", { isPlaying });
  });

  socket.on("sync-progress", ({ roomId, currentTime }) => {
    socket.to(roomId).emit("receive-progress", { currentTime });
  });
}
