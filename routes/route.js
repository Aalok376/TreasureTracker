const express = require('express')
const router = express.Router()

const { verifyToken } = require('../middleware/verifyToken')
const { verifyOtp } = require('../middleware/verifyOtp')
const { multiUpload, profileSingleUpload, coverSingleUpload } = require('../middleware/multer')

const { signup, verify, login, checkToUpdate, updatePassword, toDelete, logout, sendmailInCaseOfForgot, forgotPassword, dummy } = require('../controllers/account')
const { profile } = require('../controllers/fetchProfile')
const { updateProfilePicture, deleteProfilePicture, updateCoverPicture, deleteCoverPicture, updateName, updateContact, deletecontact } = require('../controllers/profilesetup')
const { CreatePost, updatePost, deletePost, servePostpage } = require('../controllers/post')
const { getOwnPosts } = require('../controllers/fetchownpost')
const { getPosts, getSpecificpost } = require('../controllers/getPosts')
const { createComment, deleteComment, updateComment, getAllComments, } = require('../controllers/comment')
const { like, removeLike, getLikes, } = require('../controllers/like')
const { otherProfile, otherPost, serveOtherProfile } = require('../controllers/fetchotherprofile')
const { contact } = require('../controllers/contact')
const { save, getsavedPost, Unsave } = require('../controllers/savedPost')
const { sendRequest, responseOfrequest, getRequest, getFriends, unfriend, cancelRequest, getStatusOfFriend } = require('../controllers/friendRequest')
const { createNotification } = require('../controllers/notification')

const otpStore = new Map()

router.post('/contactwithus', contact)//

router.post('/signup', signup(otpStore))//
router.post('/verifyOtp', verifyOtp(otpStore), verify)//

router.post('/login', login);//

router.put('/check', verifyToken, checkToUpdate);//
router.put('/update', verifyToken, updatePassword);//
router.post('/sendmailincaseofforgot', verifyToken, sendmailInCaseOfForgot(otpStore))//
router.put('/verifyotptoupdate', verifyToken, verifyOtp(otpStore), dummy)//
router.put('/changepassword', verifyToken, forgotPassword)//

router.delete('/delete', verifyToken, toDelete);//

router.get('/profile', verifyToken, profile);//
router.get('/logout', verifyToken, logout);//

router.put('/updateProfilePicture', verifyToken, profileSingleUpload, updateProfilePicture)//
router.delete('/deleteProfilePicture', verifyToken, deleteProfilePicture)

router.put('/updateCoverPicture', verifyToken, coverSingleUpload, updateCoverPicture)//
router.delete('/deleteCoverPicture', verifyToken, deleteCoverPicture)

router.put('/updatename', verifyToken, updateName)//

router.put('/updatecontact', verifyToken, updateContact)//
router.delete('/deleteContact', verifyToken, deletecontact)

router.post('/createPost', verifyToken, multiUpload, CreatePost)//
router.put('/updateOwnPost/:postId', verifyToken, multiUpload, updatePost)//
router.delete('/deleteOwnPost/:postId', verifyToken, deletePost)//

router.get('/getOwnPosts', verifyToken, getOwnPosts)//
router.get('/getPosts', verifyToken, getPosts)//
router.get('/getSpecificpost/:postId', verifyToken, getSpecificpost)//
router.get('/editPost/:postId', verifyToken, servePostpage)//

router.post('/savePosts/:postId', verifyToken, save)//
router.delete('/unsavePosts/:postId', verifyToken, Unsave)//
router.get('/getsavedPosts', verifyToken, getsavedPost)//

router.post('/likeapost/:postId', verifyToken, like)//
router.delete('/removelike/:postId', verifyToken, removeLike)//
router.get('/getalllike/:postId', verifyToken, getLikes)//


router.post('/commentinpost/:postId', verifyToken, createComment)//
router.put('/updatecomment/:commentId', verifyToken, updateComment)//
router.delete('/removecomment/:commentId', verifyToken, deleteComment)//
router.get('/getallcomment/:postId', verifyToken, getAllComments)//

router.get('/getotherprofile/:userId', verifyToken, otherProfile)//
router.get('/userprofile/:userId', verifyToken, serveOtherProfile)//
router.get('/getotherposts/:userId', verifyToken, otherPost)//

router.post('/sendfriendrequest', verifyToken, sendRequest)//
router.post('/respondfriendrequest', verifyToken, responseOfrequest)//
router.post('/getstatusoffriends', verifyToken, getStatusOfFriend)//
router.get('/getfriendrequest', verifyToken, getRequest)//
router.get('/getfriends', verifyToken, getFriends)//
router.delete('/removefriend', verifyToken, unfriend)//
router.delete('/cancelrequest', verifyToken, cancelRequest)//

router.post('/createNotification',verifyToken,createNotification)

module.exports = { router }