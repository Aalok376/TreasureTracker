const Comment = require('../models/comments')
const Post = require('../models/createPost')

// Add a comment to a post
const createComment = async (req, res) => {
    const { text } = req.body;
    const userId = req.user.id;
    const postId = req.params.postId;

    if (!text || text.trim() === '') {
        return res.status(400).json({ msg: 'Please provide a valid comment.' });
    }

    try {
        const comment = new Comment({ userId, postId, text });
        await comment.save();

        const post = await Post.findById(postId);
        post.commentCount += 1;
        await post.save();

        return res.status(200).json({ msg: 'Comment added successfully.' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Error adding comment.' });
    }
};

// Delete a comment
const deleteComment = async (req, res) => {
    const userId = req.user.id;
    const { commentId } = req.params;

    try {
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ msg: 'Comment not found.' });
        }

        if (comment.userId.toString() !== userId) {
            return res.status(403).json({ msg: 'You are not authorized to delete this comment.' });
        }

        const post = await Post.findById(comment.postId);
        post.commentCount -= 1;
        await post.save();

        await comment.deleteOne();

        return res.status(200).json({ msg: 'Comment deleted successfully.' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Error deleting the comment.' });
    }
}

// Update a comment
const updateComment = async (req, res) => {
    const userId = req.user.id;
    const { commentId } = req.params;
    const { text } = req.body;

    if (!text || text.trim() === '') {
        return res.status(400).json({ msg: 'Please provide valid comment text.' });
    }

    try {
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ msg: 'Comment not found.' });
        }

        if (comment.userId.toString() !== userId) {
            return res.status(403).json({ msg: 'You are not authorized to update this comment.' });
        }

        comment.text = text;
        await comment.save();

        return res.status(200).json({ msg: 'Comment updated successfully.', comment });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Error updating the comment.' });
    }
};


// Get all comments for a post
const getAllComments = async (req, res) => {
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

module.exports = {
    createComment,
    deleteComment,
    updateComment,
    getAllComments,
};