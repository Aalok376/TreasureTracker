const User = require('../models/user.js');

const profile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);


        const userId=req.user.id
        res.cookie('UserId',userId, { httpOnly: true })

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const { fname,lname,profilePicture,contactNumber,coverPicture,username,_id } = user;

        return res.status(200).json({ user:{fname,lname,profilePicture,contactNumber,coverPicture,username,_id} });
    } catch (error) {
        console.error('Error fetching profile:', error);
        return res.status(500).json({ msg: 'Error fetching profile', error });
    }
}

module.exports={profile}