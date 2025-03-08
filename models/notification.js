const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true
    },
    type: {
        type: String,
        enum: ["liked", "commented on"], 
        required: true
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        default: null
    },
    isRead: {
        type: Boolean,
        default: false 
    },
    createdAt: {
        type: Date,
        default: Date.now 
    }
})

module.exports = mongoose.model("Notification", notificationSchema);
