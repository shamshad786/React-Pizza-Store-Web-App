const mongoose = require('mongoose')

const useSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required:true,
        unique: true
    },
    password:{
        type:String,
        required: true
    },
    role:{
        type:String,
        default: 'customer'
    },
    date: {
        type:Date,
        default:Date.now
    }
});

const User = mongoose.model('User', useSchema);

module.exports = User;