const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: ['Lost', 'Found'],
        required: true,
    },
    caption: {
        type: String,
        trim: true,
        required: true,
    },
    image: [String],
    category: {
        type: String,
        required: true,
    },
    likeCount: {
        type: Number,
        default: 0,
    },
    isLikedByUser:{
        type:String,
        default:null
    },
    commentCount: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model('Post', postSchema)