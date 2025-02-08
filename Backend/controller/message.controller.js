import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
    try {
        console.log("User from req.user:", req.user);
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        const { message } = req.body;
        const { id: receiverId } = req.params; // Receiver ID
        const senderId = req.user._id; // Logged-in User ID

        if (!message) {
            return res.status(400).json({ message: "Message content is required" });
        }

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            console.log("No conversation found. Creating new one...");
            conversation = new Conversation({
                participants: [senderId, receiverId],
                messages: []
            });
            await conversation.save(); // Save it
        }

        // Create new message
        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        });

        // Add message ID to conversation
        conversation.messages.push(newMessage._id);

        // Save both message and conversation
        await Promise.all([conversation.save(), newMessage.save()]);

        res.status(201).json({ message: "Message sent successfully", newMessage });
    } catch (error) {
        console.error("Error in sending message:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const getMessages = async (req, res) => {
    try {
        console.log("User from req.user:", req.user);
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        const { id: receiverId } = req.params; // Receiver ID
        const senderId = req.user._id; // Logged-in User ID

        // Find conversation
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate("messages");

        if (!conversation) {
            return res.status(404).json({ message: "No conversation found" });
        }

        res.status(200).json({ messages: conversation.messages });
    } catch (error) {
        console.error("Error in retrieving messages:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};