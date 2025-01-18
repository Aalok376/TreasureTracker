const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middleware/verifyToken');
const { verifyOtp } = require('../middleware/verifyOtp');
const {multiUpload,singleUpload}=require('../middleware/multer')

const {signup,verify,login,checkToUpdate,updatePassword,toDelete,logout}=require('../controllers/account');
const {profile}=require('../controllers/fetchProfile')
const {updateProfilePicture,deleteProfilePicture,updateCoverPicture,deleteCoverPicture,updateName,updateContact,deletecontact}=require('../controllers/profilesetup')
const {CreatePost,updatePost,deletePost}=require('../controllers/post');
const { getOwnPosts} = require('../controllers/fetchownpost');
const {getPosts}=require('../controllers/getPosts')
const {createComment,deleteComment,updateComment,getAllComments,}=require('../controllers/comment')
const {like,removeLike,getLikes,}=require('../controllers/like')
const {otherProfile, otherPost, commentsOnOtherPosts, likesOnOtherPosts, serveOtherProfile}=require('../controllers/fetchotherprofile')

const otpStore = new Map();

router.post('/signup',signup(otpStore));
router.post('/verifyOtp',verifyOtp(otpStore),verify)

router.post('/login',login);

router.put('/check', verifyToken,checkToUpdate);
router.put('/update', verifyToken,updatePassword);

router.delete('/delete', verifyToken,toDelete);

router.get('/profile', verifyToken,profile);
router.get('/logout', verifyToken,logout);

router.put('/updateProfilePicture',verifyToken,singleUpload,updateProfilePicture)
router.delete('/deleteProfilePicture',verifyToken,deleteProfilePicture)

router.put('/updateCoverPicture',verifyToken,singleUpload,updateCoverPicture)
router.delete('/deleteCoverPicture',verifyToken,deleteCoverPicture)

router.put('/updatename',verifyToken,updateName)

router.put('/updatecontact',verifyToken,updateContact)
router.delete('/deleteContact',verifyToken,deletecontact)

router.post('/createPost',verifyToken,multiUpload,CreatePost);
router.put('/updateOwnPost/:postId',verifyToken,multiUpload,updatePost)
router.delete('/deleteOwnPost/:postId',verifyToken,deletePost)

router.get('/getOwnPosts',verifyToken,getOwnPosts)
router.get('/getPosts',verifyToken,getPosts)

router.post('/likeapost/:postId',verifyToken,like)
router.delete('/removelike/:postId',verifyToken,removeLike)
router.get('/getalllike/:postId',verifyToken,getLikes)


router.post('/commentinpost/:postId',verifyToken,createComment)
router.put('/updatecomment/:commentId',verifyToken,updateComment)
router.delete('/removecomment/:commentId',verifyToken,deleteComment)
router.get('/getallcomment/:postId',verifyToken,getAllComments)

router.get('/getotherprofile/:userId',verifyToken,otherProfile)
router.get('/userprofile/:userId',verifyToken,serveOtherProfile)
router.get('/getotherposts/:userId',verifyToken,otherPost )
router.get('/getotherscomment/:postId',verifyToken,commentsOnOtherPosts)
router.get('/getotherslike/:postId',verifyToken,likesOnOtherPosts)
module.exports = { router }