const Post = require('../models/createPost')

const getOwnPosts = async (req, res) => {
    const userId = req.user.id
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

module.exports = { getOwnPosts }