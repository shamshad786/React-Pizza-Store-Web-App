const mongoose = require('mongoose');

const productSchema = mongoose.Schema({

    name:{
        type: String,
        required: true
    },
    price:{
        type:String,
        required:true
    },
    size:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true,
        get: (image)=>{// iske ander hame ye mil jayega 'uploads/765657867896887678.png'
                // hame image ka complete server se ke path chahiye 'http://localhost:5000/uploads/765657867896887678.png' kuch aisa method chahiye
                return `${process.env.APP_URL}/${image}` 
        }
    },
    // data:{
    //     type: Date,
    //     default: Date.now,
    //     toJSON: {getters: true}
    // }

    
},{
    timestamps: true,
    toJSON: {getters: true}, id: false// ye id isliye false kiya hai kyu mongoose hame get all products me ek duplicate id kde rha tha isliye false kar diya taki wo duplicate id show naa kare
});

const Product = mongoose.model('Product',productSchema);

module.exports = Product;

