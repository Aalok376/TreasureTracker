const { Server } = require('socket.io')
const cookie = require("cookie")
const SocketModel = require('./models/sockets.js')
const Conversation = require("../models/message")

let io

const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: '*',
        },
    })

    io.on('connection', async (socket) => {
        const cookies = cookie.parse(socket.handshake.headers.cookie || "")
        const UserId = cookies.UserId || socket.handshake.auth.token

        if (!UserId) {
            console.log('User ID missing, rejecting connection:', socket.id)
            socket.disconnect()
            return
        }

        console.log('A user connected:', socket.id)
        const newSocket = new SocketModel({
            userId: UserId,
            socketId: socket.id,
        })
        await newSocket.save()

        socket.on('MessageSeen', async (data) => {
            const { messageId, conversationId, newMessage,socketId } = data

            let MessageStatus = 'read'
            console.log(`Message ${messageId} in conversation ${conversationId} marked as read`)
    
            try {
                const conversation = await Conversation.findById(conversationId)
                const message = conversation.messages.find(msg => msg._id.toString() === messageId)
                if (message) {
                    message.status = MessageStatus
                    await conversation.save()
                    console.log(`Message ${messageId} status updated to 'read'`)
                }
        
                if (socketId) {
                    socket.to(socketId).emit('messageSeen', { 
                        messageId, 
                        conversationId, 
                        newMessage, 
                        MessageStatus 
                    })
                }
            } catch (error) {
                console.error('Error handling MessageSeen event:', error)
            }
        })

        socket.on('disconnect', async () => {
            console.log('A user disconnected:', socket.id)
            await SocketModel.deleteOne({ socketId: socket.id }).then(() => {
                console.log('Socket ID removed')
            })
        })
    })
}

const getIo = () => {
    if (!io) {
        throw new Error("Socket.IO is not initialized! Call initializeSocket(server) first.")
    }
    return io
}

module.exports = { initializeSocket, getIo }
