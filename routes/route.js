const express = require('express');

const router = express.Router();

const { verifyToken } = require('../middleware/verifyToken');
const { verifyOtp } = require('../middleware/verifyOtp');

const {signup,verify,login,profile,checkToUpdate,update,toDelete,logout}=require('../controllers/account');

const otpStore = new Map();

router.post('/signup',signup(otpStore));
router.post('/verifyOtp',verifyOtp(otpStore),verify)

router.post('/login',login);

router.get('/profile', verifyToken,profile);

router.delete('/delete', verifyToken,toDelete);

router.put('/check', verifyToken,checkToUpdate);
router.put('/update', verifyToken,update);

router.get('/logout', verifyToken,logout);

module.exports = { router }