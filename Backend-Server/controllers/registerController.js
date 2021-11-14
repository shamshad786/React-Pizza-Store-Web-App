const Joi = require('joi');// ye ek package hai validation ke liye user ke detail ko validate karega, aur ye 'Joi.object({})' ek object leta h iske ander saari validation hoti hai
const CustomErrorHandler = require('../services/CustomErrorHandler');
const bcrypt = require('bcrypt');
const JwtService = require('../services/JwtService');
const User = require('../models/user');
const RefreshToken = require('../models/refreshToken');
const registerController ={

   async register(req,res,next){

        // check list hai isko niche serial wise logic banaya hai niche

        // validate request

        // authorize the request 

        // check if user is in the database already 

        // prepare model 

        // store in database

        // generate jwt token

        // send response


                //  validation request

            const registerSchema = Joi.object({
                name: Joi.string().min(3).max(30).required(),
                email: Joi.string().email().required(),
               // password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
               password: Joi.string().pattern(new RegExp('^[A-Za-z][A-Za-z0-9!@#$%^&*]*$')).required(),
                repeat_password: Joi.ref('password')
                 
            });


            const {error} = registerSchema.validate(req.body);
            //console.log(req.body)
            if(error){
                return next(error);
            }

            // check if user is in the database already

                try{
                        const exist = await User.exists({email: req.body.email});

                        if(exist){
                                return next(CustomErrorHandler.alreadyExist('This email is already exist'));
                        }

                }catch(err){
                    return next(err)  
                }

                const {name,email,password} = req.body
                
                
                // hashed password 

                const hashedPassword = await bcrypt.hash(password,10);


                // prepare model
                
                const user = new User({
                    name,
                    email,
                    password: hashedPassword
                });
                
                
                //save user into database

                let access_token;
                let refresh_token;
                try{
                    const result = await user.save();
                    
                    console.log(result)

                    //JWT Token generate 

                   access_token = await JwtService.sign({_id:result._id, role: result.role})
                   refresh_token = await JwtService.sign({_id:result._id, role:result.role}, '1y', process.env.REFRESH_SECRET);

                   //save refresh token into database  

                     await RefreshToken.create({token: refresh_token });
                    
                    //console.log("access_token" + access_token);
                    //console.log("refresh_token" + refresh_token);

                }catch(err){


                    return next(err)
                }

        res.json({access_token: access_token, refresh_token: refresh_token,
        message: "user registered successfully"}); 
        
    }
}

module.exports = registerController;