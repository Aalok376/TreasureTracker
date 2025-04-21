const mongoose = require('mongoose');

const savedSchema = new mongoose.Schema({
    userId:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    postId:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
}, { timestamps: true });

const SavedPost = mongoose.model('savedPost', savedSchema)

module.exports = SavedPost
