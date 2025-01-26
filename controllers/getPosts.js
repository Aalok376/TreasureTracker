const Post = require('../models/createPost')

const getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate('userId', 'fname lname profilePicture');

        return res.status(200).json({ success: true, posts });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, msg: 'Cannot fetch posts' });
    }
}

const getSpecificpost = async (req, res) => {
    const postId = req.params.postId
    try {
        const posts = await Post.findById(postId)
        if (posts) {
            return res.status(200).json({ success: true, posts })
        }
        else {
            return res.status(404).json({ success: false, msg: 'Post not found' })
        }
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, msg: 'Internal server error' })
    }
}

module.exports = { getPosts, getSpecificpost }
