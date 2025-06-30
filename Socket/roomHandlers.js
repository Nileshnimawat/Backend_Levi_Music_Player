import {
  createRoom,
  joinRoom,
  leaveRoom,
  sendMessage,
  getRoomMessages,
  getRoomUsers,
  getRoomOwner,
  tryReconnect,
} from "./RedisChatManager.js";

export default function registerRoomHandlers(io, socket) {
  socket.on("create_room", async (cb) => {
    const userId = socket.data.userId;
    const roomId = await createRoom(userId);
    cb(roomId);

    console.log(` Room created: ${roomId} by user: ${userId}`);

    const ownerId = await getRoomOwner(roomId);
    console.log(` Owner of room ${roomId} is: ${ownerId}`);
    io.to(roomId).emit("room_owner", { ownerId });
  });

  socket.on("join_room", async ({ roomId, user }) => {
    const User = {
      _id: user._id,
      name: user.name,
      coverImage: user.coverImage,
    };

    console.log(` User ${user._id} joining room ${roomId}`);
    await joinRoom(socket, roomId, User);

    const messages = await getRoomMessages(roomId);
    const users = await getRoomUsers(roomId);

    socket.emit("room_messages", messages);
    io.to(roomId).emit("room_users", users);

    const ownerId = await getRoomOwner(roomId);
    console.log(` Emitting owner ${ownerId} to room ${roomId}`);
    io.to(roomId).emit("room_owner", { ownerId });
  });

  socket.on("leave_room", async ({ roomId, userId }) => {
    console.log(` User ${userId} leaving room ${roomId}`);
    await leaveRoom(socket, userId);

    const users = await getRoomUsers(roomId);
    io.to(roomId).emit("room_users", users);
    io.to(roomId).emit("user_left", userId);
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

    console.log(` Message from ${User._id} to room ${roomId}: ${message.text}`);
    sendMessage(roomId, messageObj);
    io.to(roomId).emit("receive_message", messageObj);
  });

  socket.on("try_reconnect", async () => {
    const userId = socket.data.userId;
    console.log(` Trying to reconnect user: ${userId}`);

    const result = await tryReconnect(userId, socket);

    if (result) {
      console.log(`✅ Reconnection successful to room ${result.roomId}`);



      socket.emit("rejoined", result);
      const ownerId = await getRoomOwner(result.roomId);
      console.log(` Emitting owner ${ownerId} after reconnect`);
      io.to(result.roomId).emit("room_owner", { ownerId });


    } else {
      console.log(`❌ Reconnection failed for user ${userId}`);
      socket.emit("rejoined_failed");
    }
  });
}
