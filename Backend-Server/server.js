const express = require('express')
require('dotenv').config()
const errorHandler = require('./middlewares/errorHandler')
const routes = require('./routes/index');
const path = require('path');
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb://localhost:27017/NodeRest-Api').then(()=>{
    console.log(`Database Connected`);
}).catch((err)=>{
    console.log(`Database Not Connected  ${err}`);
});

global.appRoot = path.resolve(__dirname);

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use('/api',routes);
app.use('/uploads', express.static('uploads'))// ye uploads ko middleware ke ander route de diya taki express.js /uploads folder ander ke file ko serve kar sake


app.use(errorHandler)
const port = process.env.PORT || 5000;  
app.listen(port, ()=>{
    console.log(`server running on ${port}`)
})