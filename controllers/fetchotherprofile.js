const User = require('../models/user');
const Post = require('../models/createPost');
const path=require('path');

const serveOtherProfile=async(req,res)=>{

    if(req.params.userId===req.user.id){
        res.sendFile(path.join(__dirname, '..', 'public','pages', 'profile.html'));
    }
    else{
        res.sendFile(path.join(__dirname, '..', 'public','pages', 'userprofile.html'));
    }
}

const otherProfile = async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User not found' });
        }

        const { fname, lname, profilePicture, contactNumber,coverPicture } = user;
        return res.status(200).json({ success: true, user: { fname, lname, profilePicture, contactNumber,coverPicture } });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, msg: 'Internal server error' });
    }
}

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
}

module.exports = { otherProfile, otherPost,serveOtherProfile };
