import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:4001",
    methods: ["GET", "POST"],
  },
});

// Store multiple sockets per user
const users = {};

// Helper function to get receiver socket IDs
export const getReceiverSocketIds = (receiverId) => {
  return users[receiverId] || [];
};

// Socket.io connection
io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    if (!users[userId]) {
      users[userId] = [];
    }
    users[userId].push(socket.id);
  }

  io.emit("getOnlineUsers", Object.keys(users));

  // **Join conversation rooms**
  socket.on("joinConversation", (conversationId) => {
    socket.join(conversationId);
    console.log(`User joined conversation: ${conversationId}`);
  });

  // **Handle message sending**
  socket.on("sendMessage", ({ senderId, receiverId, text, conversationId }) => {
    const messageData = {
      senderId,
      receiverId,
      text,
      createdAt: new Date().toISOString(),
    };

    console.log("🟢 Server received message:", messageData);

    // Send message to receiver(s) if they are online
    const receiverSocketIds = getReceiverSocketIds(receiverId);
    receiverSocketIds.forEach((socketId) => {
      io.to(socketId).emit("receiveMessage", messageData);
    });

    // Also send the message back to the sender
    io.to(socket.id).emit("receiveMessage", messageData);

    // Send message to everyone in the conversation room (optional)
    if (conversationId) {
      io.to(conversationId).emit("receiveMessage", messageData);
    }
  });

  // **Handle disconnection**
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    // Remove user socket from `users` object
    for (const userId in users) {
      users[userId] = users[userId].filter((id) => id !== socket.id);
      if (users[userId].length === 0) delete users[userId];
    }

    io.emit("getOnlineUsers", Object.keys(users));
  });
});

export { app, io, server };
