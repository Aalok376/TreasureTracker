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

app.use('/api/v1',router);

(
    async()=>{
        try{
            await mongoose.connect(process.env.MONGO_URI)
            console.log('connecting to database');
            app.listen(process.env.PORT,()=>{
                console.log('Server is listening on port 5000');
            })
        }
        catch(error){
           console.log('Error connecting to database',error);
        }
    }
)();


