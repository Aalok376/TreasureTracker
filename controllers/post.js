const Post = require('../models/createPost')

const CreatePost = async (req, res) => {
    const userId = req.user.id;
    const { type, caption, image, category } = req.body

    if (!type || !caption || !image || !category) {
        return res.status(400).json({ success: false, msg: 'Please provide all information' })
    }

    try {
        const post = new Post({ userId, type, caption, image, category })
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
    const {postId} = req.params

    const { type, caption, image, category } = req.body

    try {
        const postToUpdate = await Post.findOne({ _id: postId, userId })

        if (!postToUpdate) {
            return res.status(404).json({ success: false, msg: 'Cannot find the post' })
        }

        postToUpdate.type = type || postToUpdate.type
        postToUpdate.caption = caption || postToUpdate.caption
        postToUpdate.image = image || postToUpdate.image
        postToUpdate.category = category || postToUpdate.category

        await postToUpdate.save()
        return res.status(200).json({ success: true, msg: 'Post updated successfully' })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, msg: 'Cannot update the post' })
    }
}

const deletePost=async(req,res)=>{
    const userId=req.user.id;
    const {postId}=req.params

    try{
        const postToDelete=await Post.findOneAndDelete({_id:postId,userId})

        if(!postToDelete){
            return res.status(404).json({success:false,msg:'Post not found'})
        }
        
        return res.status(200).json({success:true,msg:'Post deleted successfully'})
    }
    catch(error){
        console.log(error)
        return res.status(500).json({success:false,msg:'Cannot delete post'})
    }
}

module.exports = {CreatePost,updatePost,deletePost }