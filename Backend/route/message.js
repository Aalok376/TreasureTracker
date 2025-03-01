// server/routes/messages.js
const express = require('express');
const router = express.Router();
const MessageRequest = require('../models/MessageRequest');
const { authenticate } = require('../middleware/auth');

// Route to send a message request
router.post('/requests', authenticate, async (req, res) => {
  const { receiverId } = req.body; // Get receiverId from request body

  try {
    // Check if a request already exists
    const existingRequest = await MessageRequest.findOne({
      senderId: req.user._id,
      receiverId,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'You have already sent a message request.' });
    }

    // Create new message request
    const messageRequest = new MessageRequest({
      senderId: req.user._id,
      receiverId,
      status: 'pending'
    });

    await messageRequest.save();
    res.status(201).json({ message: 'Message request sent successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending message request.' });
  }
});

module.exports = router;
