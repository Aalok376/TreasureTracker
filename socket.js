const { Server } = require('socket.io')
const http = require('http')
const { app } = require('./app.js')

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: '*',
    },
})

io.on('connection', (socket) => {

    console.log('A user connceted', socket.id)

    socket.on('register', (UserIdForPost) => {

        console.log(UserIdForPost)
    })

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id)
    })
})

module.exports = { server, io }



