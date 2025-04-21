const FriendRequest = require("../models/friendRequest")

const sendRequest = async (req, res) => {
    const senderId = req.user.id
    const { receiverId } = req.body

    try {
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        })

        if (existingRequest) {
            return res.status(400).json({ success: false, msg: "Friend request already exists" })
        }

        const newRequest = new FriendRequest({ senderId, receiverId })
        await newRequest.save()

        return res.status(200).json({ success: true, msg: 'Friend request sent' })

    } catch (error) {
        return res.status(500).json({ success: false, msg: 'Error sending request' })
    }
}

const responseOfrequest = async (req, res) => {

    const senderId = req.user.id

    const { requestId, status, receiverId } = req.body

    try {
        const request = await FriendRequest.findById(requestId)

        const request2 = await FriendRequest.findOne({ senderId: receiverId, receiverId: senderId })

        if (!request && !request2) {
            return res.status(404).json({ success: false, msg: 'Request not found' })
        }

        if (request) {
            request.status = status
            await request.save()
        }

        if (request2) {
            request2.status = status
            await request2.save()
        }

        return res.status(200).json({ success: true, msg: `Friend request ${status}` })

    } catch (error) {
        return res.status(500).json({ success: false, msg: 'Error updating request' })
    }
}

const getRequest = async (req, res) => {

    try {
        const requests = await FriendRequest.find({ receiverId: req.user.id, status: 'pending' })
            .populate('senderId', 'fname lname profilePicture _id')

        return res.status(200).json({ success: true, requests })

    } catch (error) {
        return res.status(500).json({ success: false, msg: 'Error fetching requests' })
    }
}

const getFriends = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, msg: "Unauthorized" })
        }

        const friends = await FriendRequest.find({
            $or: [{ senderId: req.user.id },
            { receiverId: req.user.id }],

            status: "accepted"
        })
            .populate("senderId", "fname lname profilePicture")
            .populate("receiverId", "fname lname profilePicture")

        const friendList = friends.map(friend => {
            const friendData = friend.senderId._id.toString() === req.user.id
                ? friend.receiverId
                : friend.senderId
            return {
                _id: friendData._id,
                fname: friendData.fname,
                lname: friendData.lname,
                profilePicture: friendData.profilePicture
            }
        })

        return res.status(200).json({ success: true, friendList })

    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, msg: "Error fetching friends" })
    }
}

const unfriend = async (req, res) => {
    try {
        const { friendId } = req.body
        const userId = req.user.id

        const deletedFriendship = await FriendRequest.findOneAndDelete({
            $or: [
                { senderId: userId, receiverId: friendId, status: "accepted" },
                { senderId: friendId, receiverId: userId, status: "accepted" }
            ]
        })

        if (!deletedFriendship) {
            return res.status(404).json({ success: false, msg: "Friendship not found" })
        }

        return res.status(200).json({ success: true, msg: "Friend removed successfully" })
    } catch (error) {
        return res.status(500).json({ success: false, msg: "Error removing friend" })
    }
}

const cancelRequest = async (req, res) => {

    const senderId = req.user.id
    const { receiverId } = req.body

    try {
        const request = await FriendRequest.findOneAndDelete({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        })

        if (!request) {
            return res.status(404).json({ success: false, msg: "Friend request not found" })
        }

        return res.status(200).json({ success: true, msg: "Friend request canceled" })
    } catch (error) {
        return res.status(500).json({ success: false, msg: "Error canceling request" })
    }
}

const getStatusOfFriend = async (req, res) => {
    const senderId = req.user.id

    const { receiverId } = req.body

    try {
        const existingRequest = await FriendRequest.findOne({ senderId, receiverId })

        const receivedRequest = await FriendRequest.findOne({ senderId: receiverId, receiverId: senderId })

        if (existingRequest) {
            return res.status(200).json({ success: true, status: "Sent", existingRequest })
        }

        if (receivedRequest) {
            return res.status(200).json({ success: true, status: "Received", receivedRequest })
        }

        return res.status(200).json({ success: true, status: "No request", message: "No pending friend request" })


    } catch (error) {
        return res.status(500).json({ success: false, msg: "Error fetching status" })
    }
}

module.exports = { sendRequest, responseOfrequest, getRequest, getFriends, unfriend, cancelRequest, getStatusOfFriend }