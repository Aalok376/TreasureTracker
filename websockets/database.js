const mongoose = require('mongoose');

// Import the models
const User = require('../Model/User');
const Message = require('../Model/Message');

// MongoDB connection URI
const uri = 'mongodb+srv://deekshya:<db_password>@cluster0.usx4j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB using Mongoose
async function connectToDatabase() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected successfully to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
}

// Export the connection function and models
module.exports = {
  connectToDatabase,User,
  Message,
};

// Connect to the database immediately when this file is required
connectToDatabase();
