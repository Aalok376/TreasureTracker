const Post = require('../models/createPost')
const Comment = require('../models/comments.js')
const Like = require('../models/likes.js')
const savedPost=require('../models/savedpost.js')
const path = require('path')

const servePostpage = async (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'pages', 'editPost.html'))
}

const CreatePost = async (req, res) => {
    const userId = req.user.id;
    const { type, caption, category } = req.body

    if (!type || !caption || !category || !req.files || req.files.length === 0) {
        return res.status(400).json({ success: false, msg: 'Please provide all information' })
    }

    try {

        const imagePaths = req.files.map((file) => file.path)

        const post = new Post({ userId, type, caption, image: imagePaths, category })
        await post.save();
        return res.status(200).json({ success: true, msg: 'Post created successfully' })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, msg: 'Cannot create a post' })
    }
}

const updatePost = async (req, res) => {
    const userId = req.user.id
    const { postId } = req.params

    const { type, caption, category } = req.body

    try {
        const postToUpdate = await Post.findOne({ _id: postId, userId })

        if (!postToUpdate) {
            return res.status(404).json({ success: false, msg: 'Cannot find the post' })
        }

        postToUpdate.type = type || postToUpdate.type
        postToUpdate.caption = caption || postToUpdate.caption
        postToUpdate.category = category || postToUpdate.category

        if (req.files && req.files.length > 0) {
            const newImagePaths = req.files.map((file) => file.path);
            postToUpdate.image = newImagePaths;
        }

        await postToUpdate.save()
        return res.status(200).json({ success: true, msg: 'Post updated successfully' })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, msg: 'Cannot update the post' })
    }
}

const deletePost = async (req, res) => {
    const userId = req.user.id;
    const { postId } = req.params

    try {
        const postToDelete = await Post.findOneAndDelete({ _id: postId, userId })

        if (!postToDelete) {
            return res.status(404).json({ success: false, msg: 'Post not found' })
        }
        await Comment.deleteMany({ postId })
        await Like.deleteMany({ postId })
        await savedPost.deleteMany({postId})
        return res.status(200).json({ success: true, msg: 'Post deleted successfully' })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, msg: 'Cannot delete post' })
    }
}

module.exports = { CreatePost, updatePost, deletePost, servePostpage }