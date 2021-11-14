const Joi = require('joi');
const RefreshToken = require('../models/refreshToken');
const User = require('../models/user');
const CustomErrorHandler = require('../services/CustomErrorHandler');
const jwtServices = require('../services/JwtService');

const refreshTokenController ={

    // refresh token  validation

   async refresh(req,res,next){

        const refresh_tokenSchema = Joi.object({ 

            refresh_token: Joi.string().required()
        });

        const {error} =  refresh_tokenSchema.validate(req.body);

        if(error){
            next(error)
        }

         // check refresh token in database token match ho jayega to aagey chalega aur nahi match hua to matlab ya to user ne token wapas le liya hai ya user ne logout kar diya hai
            let refresh_Token;
         try {
             refresh_Token = await RefreshToken.findOne({token: req.body.refresh_token});   
                if(!refresh_Token){
                    return next(CustomErrorHandler.unAuthorized('Invalid Token'));
                }


                    //verify refresh token from database and get USER '_id' from database.               
                    let userId;
                try{

                const {_id} = await jwtServices.verify(refresh_Token.token, process.env.REFRESH_SECRET )

                    userId = _id;
                

                    // verify user from database that user exist in database or not

                    const user = await User({_id:userId});
                    if(!user){
                        return next(CustomErrorHandler.unAuthorized('User Not Found'));
                    }

                        // dubara new access token aur refresh token generate karenge

                const access_token = jwtServices.sign({_id:user._id, role: user.role});

                const refresh_token = jwtServices.sign({_id: user._id, role: user.role}, '1y', process.env.REFRESH_SECRET)
                    //save  RefreshToken in database
                await RefreshToken.create({token: refresh_token});

                console.log(user)
                res.json({access_token:access_token, refresh_token: refresh_token});


                }catch(err){

                    return next(CustomErrorHandler.unAuthorized('Invalid Token ' + err));
                    
                }

        } catch (err) {
            return next(new Error('something went wrong' + err.message))
        }
    }
       

};

module.exports = refreshTokenController;