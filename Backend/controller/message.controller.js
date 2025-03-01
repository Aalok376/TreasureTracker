import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { getReceiverSocketId } from "../SocketIO/socketUtils.js";  // Import the socket utility function

// Assuming you have access to the Socket.IO instance (often done in server.js or app.js)
import { io } from "../SocketIO/server.js";  // Update the import based on where `io` is initialized

export const sendMessage = async (req, res) => {
  try {
    console.log("User from req.user:", req.user);
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized: User not found" });
    }

    const { text } = req.body;
    const { id: receiverId } = req.params; // Receiver ID
    const senderId = req.user._id; // Logged-in User ID

    // Validate message content
    if (!text) {
      return res.status(400).json({ success: false, message: "Message content is required" });
    }

    // Validate if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ success: false, message: "Receiver not found" });
    }

    // Check if conversation exists between users
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    });

    if (!conversation) {
      console.log("No conversation found. Creating a new one...");
      conversation = new Conversation({
        participants: [senderId, receiverId],
        messages: []
      });
      await conversation.save();
    }

    // Create a new message
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
    });

    // Save the new message
    await newMessage.save();

    // Add message ID to conversation
    conversation.messages.push(newMessage._id);

    // Save both message and conversation
    await conversation.save();

    // Emit the message to the receiver's socket
    const receiverSocketId = getReceiverSocketId(receiverId);  // Get the receiver's socket ID
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);  // Emit to receiver's socket
    }

    res.status(201).json({ success: true, message: "Message sent successfully", data: newMessage });
  } catch (error) {
    console.error("Error in sending message:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get messages with pagination for the conversation
export const getMessages = async (req, res) => {
  try {
    console.log("User from req.user:", req.user);
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized: User not found" });
    }

    const { id: receiverId } = req.params; // Receiver ID
    const senderId = req.user._id; // Logged-in User ID

    // Find conversation and populate messages with pagination
    const { page = 1, limit = 20 } = req.query;  // Default pagination: page 1, limit 20
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    }).populate({
      path: "messages",
      options: {
        sort: { createdAt: 1 }, // Sort messages by creation time (oldest first)
        skip: (page - 1) * limit, // Skip the messages from previous pages
        limit: parseInt(limit), // Limit the number of messages fetched
      }
    });

    if (!conversation || !conversation.messages) {
      return res.status(404).json({ success: false, message: "Conversation not found", messages: [] });
    }

    // Respond with messages
    res.status(200).json({ success: true, messages: conversation.messages });

  } catch (error) {
    console.error("Error in retrieving messages:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
