const Post=require('../models/createPost')

const getPosts = async (req, res) => {
    const {page = 1, limit = 10 } = req.query;

    try {
        const posts = await Post.find()
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .sort({ createdAt: -1 })
            .populate('userId','fname lname profilePicture');

        return res.status(200).json({ success: true, posts });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, msg: 'Cannot fetch posts' });
    }
}

module.exports={getPosts}
