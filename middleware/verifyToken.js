const jwt=require('jsonwebtoken')

require('dotenv').config();

const verifyToken=(req,res,next)=>{
    const token=req.cookies.token||req.headers['authorizarion']?.split(' ')[1];

    if(!token){
        return res.status(401).json({msg:'No token provided'})
    }

    jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
        if(err){
            return res.status(403).json({msg:'Invalid or expired token'})
        }
        req.user=decoded;
        next()
    })
}

module.exports={verifyToken }