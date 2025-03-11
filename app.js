const cookieParser = require('cookie-parser')
const express=require('express')
const path=require('path')
const app= express()
const {router}=require('./routes/route')

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use(express.static(path.join(__dirname,'./public')))
app.use('/uploads',express.static(path.join(__dirname,'./uploads')))

app.use('/api/v1',router)

module.exports={app}









