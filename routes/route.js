const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middleware/verifyToken');
const { verifyOtp } = require('../middleware/verifyOtp');

const {signup,verify,login,checkToUpdate,updatePassword,toDelete,logout}=require('../controllers/account');
const {profile}=require('../controllers/fetchProfile')
const {updateProfilePicture,deleteProfilePicture,updateCoverPicture,deleteCoverPicture,updateName,updateContact,deletecontact}=require('../controllers/profilesetup')
const {CreatePost,updatePost,deletePost}=require('../controllers/post');
const { getOwnPosts} = require('../controllers/fetchownpost');
const {getPosts}=require('../controllers/getPosts')

const otpStore = new Map();

router.post('/signup',signup(otpStore));
router.post('/verifyOtp',verifyOtp(otpStore),verify)

router.post('/login',login);

router.put('/check', verifyToken,checkToUpdate);
router.put('/update', verifyToken,updatePassword);

router.delete('/delete', verifyToken,toDelete);

router.get('/profile', verifyToken,profile);
router.get('/logout', verifyToken,logout);

router.put('/updateProfilePicture',verifyToken,updateProfilePicture)
router.delete('/deleteProfilePicture',verifyToken,deleteProfilePicture)

router.put('/updateCoverPicture',verifyToken,updateCoverPicture)
router.delete('/deleteCoverPicture',verifyToken,deleteCoverPicture)

router.put('/updatename',verifyToken,updateName)

router.put('/updatecontact',verifyToken,updateContact)
router.delete('/deleteContact',verifyToken,deletecontact)

router.post('/createPost',verifyToken,CreatePost);
router.put('/updateOwnPost/:postId',verifyToken,updatePost)
router.delete('/deleteOwnPost/:postId',verifyToken,deletePost)

router.get('/getOwnPosts',verifyToken,getOwnPosts)
router.get('/getPosts',verifyToken,getPosts)

module.exports = { router }