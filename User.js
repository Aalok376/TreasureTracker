const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensure email is unique
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'user'], // Only allow 'admin' or 'user' as roles
      default: 'user',
    },
    profilePicture: {
      type: String, // Store the path or URL of the profile picture
      default: '', // Optional, default empty if no picture is uploaded
    },
    createdAt: {
      type: Date,
      default: Date.now, // Automatically set creation date
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const User = mongoose.model('User', userSchema);
module.exports = User;


