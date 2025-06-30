import redis from "./redis.js";
import { nanoid } from "nanoid";

export const createRoom = async (userId) => {
  const roomId = nanoid(8);
  await redis.set(`room:${roomId}:owner`, userId);
  return roomId;
};

export const joinRoom = async (socket, roomId, user) => {
  socket.join(roomId);
  await redis.set(`user:${user._id}:room`, roomId);
  await redis.sadd(`room:${roomId}:users`, JSON.stringify(user));
};

export const leaveRoom = async (socket, userId) => {
  const roomId = await redis.get(`user:${userId}:room`);
  if (!roomId) return;

  socket.leave(roomId);

  const users = await redis.smembers(`room:${roomId}:users`);
  for (const u of users) {
    const parsed = JSON.parse(u);
    if (parsed._id === userId) {
      await redis.srem(`room:${roomId}:users`, u);
      break;
    }
  }

  await redis.del(`user:${userId}:room`);
  await redis.del(`reconnect:${userId}`);

  const remainingMembers = await redis.scard(`room:${roomId}:users`);
  if (remainingMembers === 0) {
    await redis.del(`room:${roomId}:users`);
    await redis.del(`room:${roomId}:owner`);
    await redis.del(`room:${roomId}:chats`);
    console.log(`🗑️ Redis Room ${roomId} deleted (empty)`);
  }
};

export const sendMessage = async (roomId, messageObj) => {
  await redis.rpush(`room:${roomId}:chats`, JSON.stringify(messageObj));
};

export const getRoomMessages = async (roomId) => {
  const msgs = await redis.lrange(`room:${roomId}:chats`, 0, -1);
  return msgs.map((msg) => JSON.parse(msg));
};

export const getRoomUsers = async (roomId) => {
  const users = await redis.smembers(`room:${roomId}:users`);
  return users.map((user) => JSON.parse(user));
};

export const getRoomOwner = async (roomId) => {
  return await redis.get(`room:${roomId}:owner`);
};

export const tryReconnect = async (userId, socket) => {
  const roomId = await redis.get(`reconnect:${userId}`);
  if (!roomId) return null;

  socket.join(roomId);

  const users = await getRoomUsers(roomId);
  const messages = await getRoomMessages(roomId);

  return { roomId, users, messages };
};

export const handleDisconnect = async (userId) => {
  const roomId = await redis.get(`user:${userId}:room`);
  if (roomId) {
    await redis.setex(`reconnect:${userId}`, 120, roomId); 
  }
};
