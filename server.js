require('dotenv').config()
const mongoose=require('mongoose')

const {server}=require('./socket.js')

mongoose.connect(process.env.MONGO_URI1)
    .then(() => console.log("Connected to DB1"))
    .catch(err => console.log("Error connecting to DB1", err))


server.listen(process.env.PORT,()=>{
    console.log(`Server is listening on port ${process.env.PORT}`)
})