const cookieParser = require('cookie-parser');
const mongoose=require('mongoose');
const express=require('express');
const path=require('path');
const app= express();
const {router}=require('./routes/route');
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use(express.static(path.join(__dirname,'./public')))
app.use('/uploads',express.static(path.join(__dirname,'./uploads')))

app.use('/api/v1',router);

mongoose.connect(process.env.MONGO_URI1)
    .then(() => console.log("Connected to DB1"))
    .catch(err => console.log("Error connecting to DB1", err));

const db2=mongoose.createConnection(process.env.MONGO_URI2)
db2.on('connected',()=>{
    console.log('Connected to db2')
})
db2.on('error',(error)=>{
    console.log('Error connecting to db2',error)
})

const db3=mongoose.createConnection(process.env.MONGO_URI3)
db3.on('connected',()=>{
    console.log('Connected to db3')
})
db3.on('error',(error)=>{
    console.log('Error connecting to db3',error)
})

const db4=mongoose.createConnection(process.env.MONGO_URI4)
db4.on('connected',()=>{
    console.log('Connected to db4')
})
db4.on('error',(error)=>{
    console.log('Error connecting to db4',error)
})

app.listen(process.env.PORT,()=>{
    console.log(`Server is listening on port ${process.env.PORT}`)
})


