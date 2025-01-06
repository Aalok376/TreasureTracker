const multer=require('multer')
const path=require('path')

const storage=multer.diskStorage({
    destination:function(req,file,cb){
         cb(null,'./uploads')
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+path.extname(file.originalname))
    },
})

const upload=multer({storage:storage,
    fileFilter:function(req,file,cb){
        const fileTypes=/jpeg|jpg/
        const extName=fileTypes.test(path.extname(file.originalname).toLowerCase())
        const mimeType=fileTypes.test(file.mimetype)

        if(extName&& mimeType){
            cb(null,true)
        }
        else{
            cb(new Error('Only images are allowed!'))
        }
    },
})

const multiUpload=upload.array('image',10)
const singleUpload=upload.single('image')

module.exports={multiUpload,singleUpload}