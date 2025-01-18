const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the sender user
      required: true,
    },
    receiver_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the receiver user
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    created_at: {
      type: Date,
      default: Date.now, // Automatically set message creation date
    },
  },
  {timestamps: false, // Disable auto-created createdAt and updatedAt
  }
);

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;

