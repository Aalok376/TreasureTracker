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


app.listen(process.env.PORT,()=>{
    console.log(`Server is listening on port ${process.env.PORT}`)
})


