const Conversation = require("../models/message")
const SocketModel = require('../models/sockets')

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

const getConversatons = async (req, res) => {
    try {

        const userId = req.user.id

        const conversations = await Conversation.find({
            participants: { $in: [userId] }
        }).populate('participants', 'fname lname profilePicture')

        const formattedConversations = conversations.map(convo => {
            const otherParticipant = convo.participants.find(participant => participant._id.toString() !== userId)
            return {
                _id: convo._id,
                otherParticipant,
                updatedAt: convo.updatedAt
            };
        });

        if (!formattedConversations.length) {
            return res.status(404).json({ message: "No conversations found" })
        }

        res.status(200).json(formattedConversations)
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, error: "Failed to fetch conversation" })
    }
}

const createConversation = async (req, res) => {
    try {
        const { receiverId } = req.body
        const senderId=req.user.id

        let existingConversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        })

        if (existingConversation) {
            return res.status(200).json({
                success: true,
                msg: 'Conversation already exists'
            })
        }

        const conversation = new Conversation({ participants: [senderId, receiverId], messages: [] })

        await conversation.save()

        res.status(200).json({ success: true, msg: 'Conversation created successfully' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, error: "Failed to create conversation" })
    }
}

const CreateMessage = async (req, res) => {
    try {
        const { receiverId, message } = req.body

        const senderId=req.user.id

        let MessageStatus = 'sent'

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        })

        if (!conversation) {
            conversation = new Conversation({ participants: [senderId, receiverId], messages: [] })
        }

        const newMessage = { senderId, receiverId, message }
        conversation.messages.push(newMessage)
        await conversation.save()

        const socketId = await getSocketIdByUserId(receiverId)

        const messageId = conversation.messages[conversation.messages.length - 1]._id

        if (socketId) {
            getIo().to(socketId).emit("textMessage", {
                newMessage,
                messageId,
                conversationId: conversation._id,
                socketId
            })
            console.log(`Message sent to user ${receiverId} with socket ${socketId}`)

            MessageStatus = 'delivered'
        } else {
            console.log(`User ${receiverId} is offline. Message not sent via socket.`)
        }

        const messageIndex = conversation.messages.findIndex(msg => msg._id.toString() === messageId.toString())
        if (messageIndex !== -1) {
            conversation.messages[messageIndex].status = MessageStatus
            await conversation.save()
        }

        res.status(200).json({ success: true, newMessage, messageId, MessageStatus })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Failed to send message" })
    }
}

const GetMessage = async (req, res) => {
    try {
        const { conversationId } = req.params
        const userId = req.user.id

        const conversation = await Conversation.findById(conversationId)
            .populate('participants', 'fname lname profilePicture')

        if (!conversation) {
            return res.status(200).json([]) 
        }

        let updated = false
        conversation.messages.forEach(message => {
            if (message.receiverId.toString() === userId && message.status !== "read") {
                message.status = "read"
                updated = true
            }
        })

        if (updated) {
            await conversation.save()
        }

        res.status(200).json({conversation,userId})
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Failed to fetch messages" })
    }
};

const removeMessage = async (req, res) => {
    try {
        const { conversationId, messageId } = req.params

        const conversation = await Conversation.findById(conversationId)
        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found" })
        }

        const messageIndex = conversation.messages.findIndex(msg => msg._id.toString() === messageId)
        if (messageIndex === -1) {
            return res.status(404).json({ error: "Message not found" })
        }

        const { receiverId } = conversation.messages[messageIndex]

        conversation.messages = conversation.messages.filter(msg => msg._id.toString() !== messageId)
        await conversation.save()

        const socketId = await getSocketIdByUserId(receiverId)
        if (socketId) {
            getIo().to(socketId).emit("textMessage", {
                messageId,
                conversationId,
                message: 'removed'
            })
            console.log(`Message sent to user ${receiverId} with socket ${socketId}`)
        } else {
            console.log(`User ${receiverId} is offline. Message not sent via socket.`)
        }

        res.status(200).json({ success: true, message: "Message deleted" })
    } catch (error) {
        res.status(500).json({ error: "Failed to delete message" })
    }
}

const editMessage = async (req, res) => {
    try {
        const { conversationId, messageId, newMessageText } = req.body

        const conversation = await Conversation.findById(conversationId)
        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found" })
        }

        const messageIndex = conversation.messages.findIndex(msg => msg._id.toString() === messageId)
        if (messageIndex === -1) {
            return res.status(404).json({ error: "Message not found" })
        }

        const { receiverId } = conversation.messages[messageIndex]

        conversation.messages[messageIndex].message = newMessageText
        await conversation.save()

        const socketId = await getSocketIdByUserId(receiverId)
        if (socketId) {
            getIo().to(socketId).emit("textMessage", {
                messageId,
                conversationId,
                newMessageText,
                message: 'editedMessage'
            })
            console.log(`Message sent to user ${receiverId} with socket ${socketId}`)
        } else {
            console.log(`User ${receiverId} is offline. Message not sent via socket.`)
        }

        res.status(200).json({ success: true, message: "Message updated" })
    } catch (error) {
        res.status(500).json({ error: "Failed to edit message" })
    }

}

module.exports = { CreateMessage, GetMessage, removeMessage, editMessage, createConversation, getConversatons }