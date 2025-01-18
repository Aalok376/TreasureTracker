const User = require('../models/user');
const Post = require('../models/createPost');
const Comment = require('../models/comments');
const Like = require('../models/likes');
const path=require('path');

const serveOtherProfile=async(req,res)=>{
    res.sendFile(path.join(__dirname, '..', 'public','pages', 'userprofile.html'));
}

const otherProfile = async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User not found' });
        }

        const { fname, lname, profilePicture, contactNumber } = user;
        return res.status(200).json({ success: true, user: { fname, lname, profilePicture, contactNumber } });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, msg: 'Internal server error' });
    }
};

const otherPost = async (req, res) => {
    const userId = req.params.userId
       const { page = 1, limit = 10 } = req.query;
   
       try {
           const posts = await Post.find({ userId }).skip((page - 1) * limit).limit(Number(limit)).sort({ createdAt: -1 }).populate('userId','fname lname profilePicture');
   
           if (posts.length === 0) {
               return res.status(404).json({ success: false, msg: 'No post found' })
           }
   
           return res.status(200).json({ posts })
       }
       catch (error) {
           console.log(error)
           return res.status(500).json({ success: false, msg: 'Cannot fetch posts' })
       }
};

const commentsOnOtherPosts = async (req, res) => {
    const postId = req.params.postId;
    const { page = 1, limit = 10 } = req.query;

    try {
        const comments = await Comment.find({ postId })
            .populate('userId', 'fname lname profilePicture')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const totalComments = await Comment.countDocuments({ postId });

        return res.status(200).json({ comments, totalComments });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Error fetching comments.' });
    }
};

const likesOnOtherPosts = async (req, res) => {
    const postId = req.params.postId;
    const { page = 1, limit = 10 } = req.query;

    try {
        // If using the Like model:
        const likes = await Like.find({ postId })
            .populate('userId', 'fname lname profilePicture').sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const totalLikes = await Like.countDocuments({ postId });

        return res.status(200).json({ likes, totalLikes });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Error fetching likes. Please try again later.' });
    }
};

module.exports = { otherProfile, otherPost, commentsOnOtherPosts, likesOnOtherPosts,serveOtherProfile };
