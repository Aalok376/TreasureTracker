const Notification = require('../models/notification')
const SocketModel = require('../models/sockets')
const Post = require('../models/createPost')

const { getIo } = require('../sockett')

const getSocketIdByUserId = async (userId) => {
    try {
        const userSocket = await SocketModel.findOne({ userId })
        return userSocket ? userSocket.socketId : null
    } catch (error) {
        console.error("Error fetching socket ID:", error)
        return null
    }
}

const getReceiverID = async (postId) => {
    try {
        const recieverId = await Post.findById(postId)
        console.log(recieverId)
        return recieverId ? recieverId.userId : null
    }
    catch (error) {
        console.log(error)
    }
}

const createNotification = async (req, res) => {
    const senderId = req.user.id

    const { type, postId } = req.body

    const recieverIdX = await getReceiverID(postId)
    const receiverId = recieverIdX.toString()

    if (!receiverId || !type || !postId) {
        return res.status(400).json({ success: false, msg: 'Please provide all information' })
    }

    try {

        const notification = new Notification({ senderId, receiverId, type, postId })
        await notification.save()

        const populatedNotification = await Notification.findOne({ senderId, receiverId, postId })
            .populate('senderId', 'fname lname profilePicture')
            .exec()

        const socketId = await getSocketIdByUserId(receiverId)

        if (socketId) {
            getIo().to(socketId).emit("privateMessage", {
                message: `You have a new ${type} notification`,
                notificationId: populatedNotification._id,
                senderId: populatedNotification.senderId,
                postId: postId,
                type: type
            });
            console.log(`Notification sent to user ${receiverId} with socket ${socketId}`)
        } else {
            console.log(`User ${receiverId} is offline. Notification not sent via socket.`)
        }

    } catch (error) {
        console.error(error)
    }
}

const deleteNotification = async (req, res) => {
    const { notificationId } = req.params

    try {
        const deletedNotification = await Notification.findByIdAndDelete(notificationId)

        if (!deletedNotification) {
            return res.status(404).json({ success: false, message: "Notification not found" })
        }

        res.status(200).json({ success: true, message: "Notification deleted successfully" })
    } catch (error) {
        console.error("Error deleting notification:", error)
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}

const deleteNotificationForRemoval = async (req, res) => {
    const senderId = req.user.id

    const { type, postId } = req.body

    const recieverIdX = await getReceiverID(postId)
    const receiverId = recieverIdX.toString()

    if (!postId || !senderId || !receiverId) {
        return res.status(400).json({ success: false, msg: 'Please provide all required information' })
    }

    try {
        const deletedNotification = await Notification.findOneAndDelete({
            postId: postId,
            senderId: senderId,
            receiverId: receiverId,
            type: type
        })

        if (!deletedNotification) {
            return res.status(404).json({ success: false, msg: 'Notification not found for the removed like' })
        }

        const socketId = await getSocketIdByUserId(receiverId)

        if (socketId) {
            getIo().to(socketId).emit("privateMessage", {
                message:'removed',
                notificationId: deletedNotification._id
            })
        } else {
            console.log(`User ${receiverId} is offline. Notification not sent via socket.`)
        }
    } catch (error) {
        console.error("Error deleting notification:", error);
        res.status(500).json({ success: false, msg: 'Internal server error' })
    }
};


const markNotificationAsRead = async (req, res) => {
    const { notificationId } = req.body

    try {
        const updatedNotification = await Notification.findByIdAndUpdate(
            notificationId,
            { isRead: true }
        )

        if (!updatedNotification) {
            return res.status(404).json({ success: false, message: "Notification not found" })
        }

        res.status(200).json({ success: true, message: "Notification marked as read", notification: updatedNotification })
    } catch (error) {
        console.error("Error updating notification:", error)
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}

const markAllNotificationsAsRead = async (req, res) => {
    const receiverId = req.user.id

    try {
        const updatedNotifications = await Notification.updateMany(
            { receiverId, isRead: false },
            { isRead: true }
        );

        if (updatedNotifications.modifiedCount === 0) {
            return res.status(404).json({ success: false, message: "No unread notifications found" });
        }

        res.json({ success: true, message: "All notifications marked as read" });
    } catch (error) {
        console.error("Error updating notifications:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const getNotifications = async (req, res) => {
    const receiverId = req.user.id

    try {
        const notifications = await Notification.find({ receiverId }).populate('senderId', 'fname lname profilePicture').sort({ createdAt: -1 })
        res.status(200).json({ success: true, notifications })
    } catch (error) {
        console.error("Error fetching notifications:", error)
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}

module.exports = { createNotification, deleteNotification, getNotifications, markNotificationAsRead, markAllNotificationsAsRead ,deleteNotificationForRemoval}
