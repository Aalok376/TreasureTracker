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
        enum: ["like", "comment", "friend_request", "post_approved"], // Define notification types
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
