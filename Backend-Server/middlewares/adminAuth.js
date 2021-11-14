const CustomErrorHandler = require('../services/CustomErrorHandler');
const User = require('../models/user');

const admin = async (req,res,next )=>{

try{
    const user = await User.findOne({_id: req.user._id});

        if(user.role === 'admin'){
            next();
        }else{
            return next(CustomErrorHandler.unAuthorized());
        }
}catch(err){

    return next(CustomErrorHandler.serverError());
}

}

module.exports = admin;




