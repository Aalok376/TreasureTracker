const mongoose=require('mongoose');

const bcrypt=require('bcryptjs');

const UserSchema=new mongoose.Schema({
    fname:{
        type:String,
        required:true,
        trim:true,
    },
    lname:{
        type:String,
        required:true,
        trim:true,
    },
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
    },
    profilePicture:{
        type:String,
        default:"../assets/images/DALL·E 2025-01-19 21.12.44 - A default profile image featuring a simple and professional design. The image should have a circular border with a neutral gray background and an abst.webp",
    },
    coverPicture:{
        type:String,
        default:"../assets/images/DALL·E 2025-01-19 21.13.33 - A default cover image featuring a simple and professional design. The image should have a wide rectangular layout with a neutral gradient background i.webp",
    },
    contactNumber:{
        type:String,
        default:null,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    }, 
});

UserSchema.pre('save',async function (next){
    if(!this.isModified('password')){
        return next();
    }

    try{
        const salt=await bcrypt.genSalt(10);
        this.password=await bcrypt.hash(this.password,salt);
        next();
    }
    catch(error){
      next(err);
    }
})

module.exports=mongoose.model('User',UserSchema);