const verifyOtp = (otpStore) => {
    return (req, res, next) => {

        const { username, userInputOtp } = req.body;
        console.log('Request Body:', req.body);
        console.log('OTP Store:', Array.from(otpStore.entries()));
        
        const record = otpStore.get(username);
        if (!record) {
            return res.status(400).json({ success: false, msg: 'Otp either expired or invalid' });
        }

        const { otp, expiresAt } = record;

        if (Date.now() > expiresAt) {
            otpStore.delete(username);
            return res.status(400).json({ success: false, msg: 'Otp expired!' });
        }

        if (otp !== userInputOtp) {
            return res.status(400).json({ success: false, msg: 'Invalid Otp' })
        }
        otpStore.delete(username);

        next()
    }
}

module.exports = { verifyOtp }