const mongoose = require('mongoose')

const socketSchema = new mongoose.Schema({
    userId: String,
    socketId: String
})

const SocketModel = mongoose.model('Socket', socketSchema)
module.exports=SocketModel