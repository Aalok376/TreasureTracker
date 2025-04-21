const User = require('../models/user.js');

const updateProfilePicture=async (req,res)=>{
         const newProfilePicture=req.file;

         if(!newProfilePicture){
            return res.status(400).json({msg:'Please select a picture.'})
         }
         
         try{
            const userToUpdate=await User.findById(req.user.id)
            userToUpdate.profilePicture=newProfilePicture.path;

            await userToUpdate.save();
            return res.status(200).json({success:true,msg:'Profile picture updated successfully.'})
         }
         catch(error){
            console.log(error);
            return res.status(500).json({success:false,msg:'Cannot update profile picture.'})
         }
}

const deleteProfilePicture=async(req,res)=>{
   try{
      const userToDelete=await User.findById(req.user.id)

      userToDelete.profilePicture='../assets/images/DALL·E 2025-01-19 21.12.44 - A default profile image featuring a simple and professional design. The image should have a circular border with a neutral gray background and an abst.webp'
      await userToDelete.save()
      return res.status(200).json({success:true,msg:'Profile picture deleted successfully'})
   }
   catch(error){
      console.log(error)
      return res.status(500).json({success:false,msg:'Cannot delete profile picture'})
   }
}

const updateCoverPicture=async (req,res)=>{
   const newCoverPicture=req.file;

   if(!newCoverPicture){
      return res.status(400).json({msg:'Please select a picture.'})
   }
   
   try{
      const userToUpdate=await User.findById(req.user.id)
      userToUpdate.coverPicture=newCoverPicture.path;

      await userToUpdate.save();
      return res.status(200).json({success:true,msg:'Cover picture updated successfully.'})
   }
   catch(error){
      console.log(error);
      return res.status(500).json({success:false,msg:'Cannot update cover picture.'})
   }
}

const deleteCoverPicture=async(req,res)=>{
try{
const userToDelete=await User.findById(req.user.id)

userToDelete.coverPicture='../assets/images/DALL·E 2025-01-19 21.13.33 - A default cover image featuring a simple and professional design. The image should have a wide rectangular layout with a neutral gradient background i.webp';
await userToDelete.save();
return res.status(200).json({success:true,msg:'Cover picture deleted successfully'})
}
catch(error){
console.log(error)
return res.status(500).json({success:false,msg:'Cannot delete cover picture'})
}
}

const updateName=async(req,res)=>{
   const {newfname,newlname}=req.body;
   if(!newfname||!newlname){
      return res.status(400).json({success:false,msg:'Please provide a new name'})
   }
   try{
        const usernametoupdate=await User.findById(req.user.id)

        usernametoupdate.fname=newfname;
        usernametoupdate.lname=newlname;

        await usernametoupdate.save();

        return res.status(200).json({success:true,msg:'Name Updated succesfully'})
   }
   catch(error){
      console.log(error)
      return res.status(500).json({success:false,msg:'Cannot update name.'})
   }
}

 const updateContact=async(req,res)=>{
   const {newContact}=req.body

   if(!newContact){
      return res.status(400).json({success:false,msg:'Please enter a new contact'})
   }

   try{
      const contactToUpdate=await User.findById(req.user.id)

      contactToUpdate.contactNumber=newContact
      await contactToUpdate.save();
      return res.status(200).json({Success:true,msg:'Contact updated successfully'})
   }
   catch(error){
      console.log(error)
      return res.status(500).json({success:false,msg:'Cannot update contact.'})
   }
 }

 const deletecontact=async(req,res)=>{
   try{
      const contactToDelete=await User.findById(req.user.id)

      contactToDelete.contactNumber=null;
      await contactToDelete.save();

      return res.status(200).json({success:true,msg:'Contact deleted successfully'})
   }
   catch(error){
      console.log(error)
      return res.status(500).json({success:false,msg:'Cannot delete contact'})
   }
 }

 module.exports={
   updateProfilePicture,deleteProfilePicture,updateCoverPicture,deleteCoverPicture,updateName,updateContact,deletecontact
 }