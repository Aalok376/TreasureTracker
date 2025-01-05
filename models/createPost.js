const mongoose=require('mongoose')

const postSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    type:{
        type:String,
        enum:['Lost','Found'],
        required:true,
    },
    caption:{
        type:String,
        trim:true,
        required:true,
    },
    image:[String],
    category:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
})

module.exports=mongoose.model('Post',postSchema)