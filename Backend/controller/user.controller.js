
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import createTokenAndSaveCookie from "../JWT/generateToken.js";
import jwt from "jsonwebtoken";

/*
export const signup = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            console.log("Passwords do not match");
            return res.status(400).json({ message: "Password do not match" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log("Email already exists");
            return res.status(400).json({ message: "Email already exists" });
        }

        console.log("Creating new user...");
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });

        await newUser.save();

        console.log("New user saved successfully:", newUser);

        createTokenAndSaveCookie(newUser._id, res);
        console.log("Token created and cookie set");

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (error) {
        console.log("Error during signup:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        console.log("Login attempt for email:", email);

        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found in database:", email);
            return res.status(400).json({ message: "Invalid User or Password" });
        }

        console.log("User found:", user);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Incorrect password for user:", user.email);
            return res.status(400).json({ message: "Invalid User or Password" });
        }

        console.log("Password matched. Generating token...");

        const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN, { expiresIn: '24h' });
        console.log("Generated token:", token);

        createTokenAndSaveCookie(user._id, res);

        return res.status(200).json({
            message: "User logged in successfully!",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
            token: token
        });

    } catch (error) {
        console.log("Error during login:", error);
        return res.status(500).json({ message: "Server error" });
    }
};*/

export const signup = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            console.log("Passwords do not match");
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log("Email already exists");
            return res.status(400).json({ message: "Email already exists" });
        }

        console.log("Creating new user...");
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });

        await newUser.save();
        console.log("New user saved successfully:", newUser);

        createTokenAndSaveCookie(newUser._id, res);
        console.log("Token created and cookie set");

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (error) {
        console.log("Error during signup:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        console.log("Login attempt for email:", email);

        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found in database:", email);
            return res.status(400).json({ message: "Invalid User or Password" });
        }

        console.log("User found:", user);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Incorrect password for user:", user.email);
            return res.status(400).json({ message: "Invalid User or Password" });
        }

        console.log("Password matched. Generating token...");

        const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN, { expiresIn: '24h' });
        console.log("Generated token:", token);

        createTokenAndSaveCookie(user._id, res);

        return res.status(200).json({
            message: "User logged in successfully!",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
            token: token
        });

    } catch (error) {
        console.log("Error during login:", error);
        return res.status(500).json({ message: "Server error" });
    }
};


export const logout = async (req, res) => {
    try {
        res.clearCookie('jwt');
        res.status(200).json({ message: "User logged out successfully!" });
    } catch (error) {
        console.log("Error during logout:", error);
        return res.status(500).json({ message: "Server error" });
    }
};


export const getUserProfile = async (req, res) => {
    try {
        console.log("Logged-in user:", req.user); // Log user data to ensure it's populated correctly
        const loggedInUser = req.user._id;

        // Find users excluding the logged-in user
        const filteredUsers = await User.find({ _id: { $ne: loggedInUser } }).select("-password");

        console.log("Filtered users:", filteredUsers);  // Log the filtered users for debugging

        res.status(200).json({ filteredUsers });
    } catch (error) {
        console.log("Error in getUserProfile Controller:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

