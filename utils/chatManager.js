import { nanoid } from "nanoid";

export const roomChats = new Map(); // roomId => [messages]
export const userRooms = new Map(); // socketId => Set of roomIds
export const roomUsers = new Map(); // roomId => Map(userId => userObj)


export const createRoom = () => {
  const roomId = nanoid(8);
  roomChats.set(roomId, []);
  roomUsers.set(roomId, new Map());
  return roomId;
};


export const joinRoom = (socket, roomId, user) => {
  socket.join(roomId);

  if (!userRooms.has(socket.id)) userRooms.set(socket.id, new Set());
  userRooms.get(socket.id).add(roomId);


  if (!roomUsers.has(roomId)) roomUsers.set(roomId, new Map());
  roomUsers.get(roomId).set(user._id, user);

  socket.to(roomId).emit("user_joined", user);
};


export const leaveRoom = (socket, roomId, userId) => {
  socket.leave(roomId);

  const rooms = userRooms.get(socket.id);
  if (rooms && rooms.has(roomId)) {
    rooms.delete(roomId);
    if (rooms.size === 0) userRooms.delete(socket.id);
  }


  const userMap = roomUsers.get(roomId);
  if (userMap) {
    userMap.delete(userId);
    if (userMap.size === 0) {
      roomUsers.delete(roomId);
      roomChats.delete(roomId);
      console.log(`🗑️ Room ${roomId} deleted (empty)`);
    }
  }
};


export const leaveAllRooms = (socket, userId) => {
  const rooms = userRooms.get(socket.id);
  if (!rooms) return [];

  const leftRooms = [];

  rooms.forEach((roomId) => {
    socket.leave(roomId);

    const userMap = roomUsers.get(roomId);
    if (userMap) {
      userMap.delete(userId);
      if (userMap.size === 0) {
        roomUsers.delete(roomId);
        roomChats.delete(roomId);
        console.log(`🗑️ Room ${roomId} deleted (empty)`);
      }
    }

    leftRooms.push(roomId);
  });

  userRooms.delete(socket.id);
  return leftRooms;
};

export const sendMessage = (roomId, messageObj) => {
  if (!roomChats.has(roomId)) return;
  roomChats.get(roomId).push(messageObj);
  console.log(`💬 Message added to room ${roomId}:`, messageObj);
};


export const getRoomMessages = (roomId) => {
  return roomChats.get(roomId) || [];
};


export const getRoomUsers = (roomId) => {
  const usersMap = roomUsers.get(roomId);
  return usersMap ? Array.from(usersMap.values()) : [];
};
