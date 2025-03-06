const Notification=require('../models/notification')
const SocketModel=require('../models/sockets')
const Post = require('../models/createPost')

const { getIo } = require('../sockett')

const getSocketIdByUserId = async (userId) => {
    try {
        const userSocket = await SocketModel.findOne({ userId })
        return userSocket ? userSocket.socketId : null
    } catch (error) {
        console.error("Error fetching socket ID:", error)
        return null
    }
}

const getReceiverID=async(postId)=>{
    try{
        const recieverId = await Post.findById(postId)
        console.log(recieverId)
        return recieverId?recieverId.userId:null
    }
    catch(error){
        console.log(error)
    }
}

const createNotification=async(req,res)=>{
    const senderId=req.user.id

    const {type,postId}=req.body
    console.log(type,postId)

    const recieverIdX=await getReceiverID(postId)
    const receiverId=recieverIdX.toString()
    console.log(receiverId)

    if(!receiverId||!type||!postId){
        return res.status(400).json({success:false,msg:'Please provide all information'})
    }

    try{

        const notification=new Notification({senderId,receiverId,type,postId})
        await notification.save()

        const socketId= await getSocketIdByUserId(receiverId)

        if (socketId) {
            getIo().to(socketId).emit("privateMessage", {
                message: `You have a new ${type} notification`,
                senderId: senderId,
                postId: postId,
                type: type
            });
            console.log(`Notification sent to user ${receiverId} with socket ${socketId}`)
        } else {
            console.log(`User ${receiverId} is offline. Notification not sent via socket.`)
        }
        
    }catch(error){
        console.error(error)
    }
}

module.exports={createNotification}
