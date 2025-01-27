const Post = require('../models/createPost.js')

const savedPost = require('../models/savedpost.js')

// Save a post
const save = async (req, res) => {
    const userId = req.user.id;
    const postId = req.params.postId;

    try {
        const existingpost = await savedPost.findOne({ userId, postId });
        if (existingpost) {
            return res.status(400).json({ msg: 'You have already saved this post.' })
        }

        const savedPosts = new savedPost({ userId, postId })
        await savedPosts.save()

        const post = await Post.findById(postId)
        post.isSavedByUser = post.isSavedByUser || []
        post.isSavedByUser.push(userId)
        await post.save()

        return res.status(200).json({ msg: 'Post saved successfully.' })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Error saving the post.' })
    }
}

// Unlike a post
const Unsave = async (req, res) => {
    const userId = req.user.id;
    const postId = req.params.postId;

    try {
        const saved = await savedPost.findOneAndDelete({ userId, postId });
        if (!saved) {
            return res.status(400).json({ msg: 'You have not saved this post.' })
        }

        const post = await Post.findById(postId)
        post.isSavedByUser = post.isSavedByUser.filter(id => id !== userId)
        await post.save()

        return res.status(200).json({ msg: 'Post unsaved successfully.' })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Error unsaving the post.' });
    }
}

const getsavedPost = async (req, res) => {
    const userId = req.user.id

    try {

        const savedPosts = await savedPost.find({ userId }).populate({
            path: 'postId',
            populate: {
                path: 'userId',
                select: 'fname lname profilePicture'
            }
        })

        const posts = savedPosts.map(saved => saved.postId)

        return res.status(200).json({success:true,posts })
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Error fetching posts. Please try again later.' });
    }
}

module.exports = {
    save,
    Unsave,
    getsavedPost
}