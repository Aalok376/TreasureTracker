const Notification=require('../models/notifications')

const {io}=require('../socket')

const user={}

const createNotification=async(req,res)=>{
    const recieverId=req.user.id

    const {senderId,type,postId}=req.body

    if(!senderId||!type||!postId){
        return res.status(400).json({success:false,msg:'Please provide all information'})
    }

    try{

        const notification=new Notification({senderId,recieverId,type,postId})
        await notification.save()

        
    }catch(error){
        console.error(error)
    }
}
