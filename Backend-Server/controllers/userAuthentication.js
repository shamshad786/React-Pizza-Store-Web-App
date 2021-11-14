const User = require('../models/user');
const CustomErrorHandler = require('../services/CustomErrorHandler');


const userAuthentication = {

    async userAuth(req,res,next){

            try{

                const userData = await User.findOne({_id: req.user._id}).select('-password -__v') // ye select ke ander minus(-) laga dete hai to database se wo fields  get nahi hogi aur show bhi nahi hogis 

                if(!userData){
                   return next(CustomErrorHandler.notFound());

                }

                res.json(userData);
                
            }catch(err){
                return next(err);
            } 
    }
}

module.exports = userAuthentication;