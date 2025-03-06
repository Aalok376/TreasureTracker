const { Server } = require('socket.io')
const http = require('http')
const { app } = require('./app.js')
const cookie = require("cookie")

const server = http.createServer(app)

const userIdforIO={}

const io = new Server(server, {
    cors: {
        origin: '*',
    },
})

io.on('connection', (socket) => {

    const cookies = cookie.parse(socket.handshake.headers.cookie || "")
    const UserId = cookies.UserId || socket.handshake.auth.token

    console.log('A user connceted', socket.id)

    socket.on('register', () => {
        userIdforIO[UserId]=socket.id
        console.log(userIdforIO)
    })
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id)
        const userId = Object.keys(userIdforIO).find(key => userIdforIO[key] === socket.id)
    
        if (userId) {
            delete userIdforIO[userId]
            console.log(`User ${userId} removed from active sockets`)
        }
    })    
})

module.exports = { server, io }



