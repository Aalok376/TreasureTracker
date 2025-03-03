const { Server } = require('socket.io')
const http = require('http')
const { app } = require('./app.js')
const cookie = require("cookie")

const server = http.createServer(app)

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
        console.log(UserId)
    })

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id)
    })
})

module.exports = { server, io }



