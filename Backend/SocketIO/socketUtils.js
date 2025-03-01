// socketUtils.js
const socketIds = {};

// Set the socket ID for a user
export function setSocketId(userId, socketId) {
  socketIds[userId] = socketId;
}

// Get the socket ID for a specific receiver
export function getReceiverSocketId(receiverId) {
  return socketIds[receiverId]; // Returns the socket ID for the receiver
}
