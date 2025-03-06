const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const User = require('../models/user.js');
const Post = require('../models/createPost.js')
const Comment = require('../models/comments.js');
const Like = require('../models/likes.js')
const Savedpost = require('../models/savedpost.js')
const FriendRequest = require("../models/friendRequest")

const { sendEmail } = require('../middleware/sendmail');

require('dotenv').config();

const signup = (otpStore) => {
    return async (req, res) => {
        const { username, password } = req.body;

        const validatePassword = (password) => {
            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            return passwordRegex.test(password);
        };

        if (!username || !password) {
            return res.status(400).json({ msg: 'Please provide all data' });
        }
        else if (!validatePassword(password)) {
            return res.status(400).json({
                success: false,
                msg: 'Password must be at least 8 characters long and include at least one letter and one number.',
            });
        }
        else {
            try {
                const existinguser = await User.findOne({ username })
                if (existinguser) {
                    return res.status(409).json({ msg: 'Username already taken' });
                }

                const otp = Math.floor(100000 + Math.random() * 900000).toString()
                sendEmail(username, otp);

                const userId = username;
                otpStore.set(userId, { otp, expiresAt: Date.now() + 1 * 60 * 1000 });
                return res.status(200).json({ msg: 'OTP sent to your email. Please verify to complete signup.' });
            }
            catch (error) {
                console.log(error)
                return res.status(500).json({ error });
            }
        }
    }
}

const verify = async (req, res) => {
    const { username, fname, lname, password } = req.body
    try {
        const user = new User({ fname, lname, username, password })
        await user.save();
        return res.status(200).json({ success: true, msg: 'User created successfully.' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error });
    }
}

const login = async (req, res) => {

    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ msg: 'Please provide all data' });
    }
    else {
        try {
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(401).json({ msg: 'Username not found' });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ msg: 'Invalid password' });
            }

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
            res.cookie('token', token, { httpOnly: true })

            const userId = user._id.toString()
            res.cookie('UserId', userId, { httpOnly: true })

            return res.status(200).json({ msg: 'Login successful' })
        }
        catch (error) {
            console.error('Error during login:', error);
            return res.status(500).json({ msg: 'Error logging in', error });
        }
    }
}

const checkToUpdate = async (req, res) => {
    const { password } = req.body;
    if (!password) {
        return res.status(400).json({ msg: 'Please provide password.' });
    }
    try {
        // Find the user using the ID from the JWT token
        const userToUpdate = await User.findById(req.user.id);

        if (!userToUpdate) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(password, userToUpdate.password);

        if (!passwordMatch) {
            return res.status(401).json({ msg: 'Invalid current password' });
        }

        return res.status(200).json({ msg: 'Password verified. Please provide a new password.' });
    }
    catch (error) {
        console.error('Error during verifying password:', error);
        return res.status(500).json({ msg: 'Error verifying password', error });
    }
}

const updatePassword = async (req, res) => {
    const { newPassword } = req.body;

    const validatePassword = (newPassword) => {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(newPassword);
    };

    if (!newPassword) {
        return res.status(400).json({ msg: 'Please provide a new Password.' });
    }
    else if (!validatePassword(newPassword)) {
        return res.status(400).json({
            success: false,
            msg: 'Password must be at least 8 characters long and include at least one letter and one number.',
        });
    }

    try {
        const userToUpdate = await User.findById(req.user.id);

        if (!userToUpdate) {
            return res.status(404).json({ msg: 'User not found' });
        }

        userToUpdate.password = newPassword;

        await userToUpdate.save();

        return res.status(200).json({ msg: 'Password updated successfully' });
    }
    catch (error) {
        console.error('Error during updating password:', error);
        return res.status(500).json({ msg: 'Error updating password', error });
    }
}

const toDelete = async (req, res) => {
    const { password } = req.body;
    if (!password) {
        return res.status(400).json({ msg: 'Please provide all data' });
    }
    try {
        const user = await User.findById(req.user.id);
        const userId = req.user.id

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const passwordmatch = await bcrypt.compare(password, user.password);
        if (!passwordmatch) {
            return res.status(401).json({ msg: 'Incorrect password' });
        }

        await Post.deleteMany({ userId });
        await Comment.deleteMany({ userId })
        await Like.deleteMany({ userId })
        await Savedpost.deleteMany({ userId })
        await FriendRequest.deleteMany({
            $or: [
                { senderId: userId },
                { receiverId: userId }
            ]
        })
        await User.findByIdAndDelete(req.user.id);
        res.clearCookie('token', { httpOnly: true });

        return res.status(200).json({ msg: 'User deleted successfully' });
    } catch (error) {
        console.error('Error during deleting:', error);
        return res.status(500).json({ msg: 'Error deleting user', error });
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie('token', { httpOnly: true })
        res.clearCookie('UserId', { httpOnly: true })
        return res.status(200).json({ msg: 'Logout successfully' });
    }
    catch (error) {
        console.error('Error during logout:', error);
        return res.status(500).json({ msg: 'Error logging out', error });
    }
}

const forgotPassword = async (req, res) => {
    const { newPassword } = req.body;

    const validatePassword = (newPassword) => {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(newPassword);
    };

    if (!newPassword) {
        return res.status(400).json({ msg: 'Please provide a new Password.' });
    }
    else if (!validatePassword(newPassword)) {
        return res.status(400).json({
            success: false,
            msg: 'Password must be at least 8 characters long and include at least one letter and one number.',
        });
    }

    try {
        const userToUpdate = await User.findById(req.user.id);

        if (!userToUpdate) {
            return res.status(404).json({ msg: 'User not found' });
        }

        userToUpdate.password = newPassword;

        await userToUpdate.save();

        return res.status(200).json({ msg: 'Password updated successfully' });
    }
    catch (error) {
        console.error('Error during updating password:', error);
        return res.status(500).json({ msg: 'Error updating password', error });
    }
}

const sendmailInCaseOfForgot = (otpStore) => {
    return async (req, res) => {
        const { username } = req.body;

        try {
            const existinguser = await User.findOne({ username })
            if (!existinguser) {
                return res.status(404).json({ msg: 'User doesnt exists' });
            }

            const otp = Math.floor(100000 + Math.random() * 900000).toString()
            sendEmail(username, otp);

            const userId = username;
            otpStore.set(userId, { otp, expiresAt: Date.now() + 1 * 60 * 1000 });
            return res.status(200).json({ msg: 'OTP sent to your email. Please verify to complete signup.' });
        }
        catch (error) {
            console.log(error)
            return res.status(500).json({ error });
        }
    }
}

const dummy = async (req, res) => {
    return res.status(200).json({ success: true, msg: 'Otp verified successfully' })
}


module.exports = { signup, verify, login, checkToUpdate, updatePassword, toDelete, logout, forgotPassword, sendmailInCaseOfForgot, dummy }