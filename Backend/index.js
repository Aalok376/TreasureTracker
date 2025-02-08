import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoute from './route/user.route.js';
import messageRoute from './route/message.route.js';

dotenv.config();

// Initialize the express app
const app = express();

// CORS options to allow requests from your frontend
const corsOptions = {
    origin: 'http://localhost:4002',  // Frontend URL
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow cookies and headers
};

const PORT = process.env.PORT || 5001;
const URI = process.env.MONGODB_URI;

// Use middlewares
app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions)); // Apply CORS middleware before routes

// Handling OPTIONS preflight request (ensure this is before routes)
app.options('*', cors(corsOptions));

// MongoDB connection
async function connectDB() {
    try {
        await mongoose.connect(URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB Connection Error:', error);
        process.exit(1); // Stop server if database connection fails
    }
}

// Connect to MongoDB before starting the server
connectDB().then(() => {
    // Define routes after database connection
    app.use('/api/user', userRoute);
    app.use('/api/message', messageRoute);

    // Start the server
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
