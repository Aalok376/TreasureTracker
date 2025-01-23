const Post = require('../models/createPost')
const Like = require('../models/likes')

// Like a post
const like = async (req, res) => {
    const userId = req.user.id;
    const postId = req.params.postId;

    try {
        const existingLike = await Like.findOne({ userId, postId });
        if (existingLike) {
            return res.status(400).json({ msg: 'You have already liked this post.' });
        }

        const like = new Like({ userId, postId });
        await like.save();

        const post = await Post.findById(postId)
        post.likeCount += 1;
        post.isLikedByUser.push(userId)
        await post.save()

        return res.status(200).json({ msg: 'Post liked successfully.' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Error liking the post.' });
    }
}

// Unlike a post
const removeLike = async (req, res) => {
    const userId = req.user.id;
    const postId = req.params.postId;

    try {
        const like = await Like.findOneAndDelete({ userId, postId });
        if (!like) {
            return res.status(400).json({ msg: 'You have not liked this post.' });
        }

        const post = await Post.findById(postId);
        post.likeCount -= 1;
        post.liked=false
        await post.save();

        return res.status(200).json({ msg: 'Post unliked successfully.' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Error unliking the post.' });
    }
}

const getLikes = async (req, res) => {
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
}

module.exports = {
    like,
    removeLike,
    getLikes,
}