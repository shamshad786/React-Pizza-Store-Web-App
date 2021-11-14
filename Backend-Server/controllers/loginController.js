const Joi = require('joi');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const RefreshToken = require ('../models/refreshToken');
const CustomErrorHandler = require('../services/CustomErrorHandler');
const jwtServices = require('../services/JwtService')

const loginController = {

    async login(req,res,next){

    //login validation

        const loginSchema = Joi.object({

            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[A-Za-z][A-Za-z0-9!@#$%^&*]*$')).required()

        });

        const {error} = loginSchema.validate(req.body);
        
        if(error){
            return next(error);
        }

        try{
                //compare email database email to user input email
            const user = await User.findOne({email: req.body.email});
                if(!user){
                    return next(CustomErrorHandler.wrongCredentials());
                }

                //compare database password to user input password
                const match = await bcrypt.compare(req.body.password, user.password);

                if(!match){
                    return next(CustomErrorHandler.wrongCredentials());
                }

                //if password match generate jwt token and send to the client 

                const access_token = jwtServices.sign({_id:user._id, role: user.role});

                const refresh_token = jwtServices.sign({_id: user._id, role: user.role}, '1y', process.env.REFRESH_SECRET)

                //save refresh token into database
                await RefreshToken.create({token: refresh_token});

                console.log(user)
                res.json({access_token:access_token, refresh_token: refresh_token, message: "user successfully login"});
            
        }catch(error){
            return next(error); 
        }
    },
   async logout(req,res,next){
        //validation 

        const refreshSchema = Joi.object({
            refresh_token: Joi.string().required()
        })

            const {error} = refreshSchema.validate(req.body);
            
            if(error){
                return next(error)
            }

        try{

            await RefreshToken.deleteOne({token: req.body.refresh_token});

        }catch(err){
            return next(new Error('something went wrong in the database'));
        }
        res.json({status:'user Logout'});
    }


}

module.exports = loginController;