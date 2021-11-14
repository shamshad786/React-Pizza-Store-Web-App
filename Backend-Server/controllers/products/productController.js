const Product = require('../../models/product');
const Joi = require('joi');
const CustomErrorHandler = require('../../services/CustomErrorHandler');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const storage = multer.diskStorage({
    destination: (req, file,cb) => cb(null, './uploads'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(
            Math.random() * 1e9
        )}${path.extname(file.originalname)}`;
        // 3746674586-836534453.png
        cb(null, uniqueName);
    },
});
                         // fileSize ka meaning hai ki ye bytes me value hai aur usko 5 se multiply karenge to 5MB ki image file support karega 
const handleMulterData = multer({storage, limits:{fileSize: 1000000 * 5}}).single('image');

const productController = {

    //create products
   async store(req,res,next){

        //multer multipart data

        handleMulterData(req,res, async(err)=>{
                if(err){
                    return next(CustomErrorHandler.serverError(err.message));
                
                }
                    //console.log(req.file);
                    const ImageFilePath = req.file.path;
                    //console.log(filePath)

                    // validation for user request should be required
                    const productSchema = Joi.object({
                        name: Joi.string().required(),
                        price: Joi.number().required(),
                        size: Joi.string().required(),
                        image: Joi.string(),
                    });

                    const {error} = productSchema.validate(req.body);

                    if(error){
                        //yaha pr validation pehle se image upload ho rahi hai agar validation me error nahi aayega to image fir dubara upload ho jayega means image double uplopad ho jayega
                        //isliye hum yaha par validation me error aate hi jo image pehle upload hui hai usko delete kar denge

                        //ye appRoot global variable banaya hai humne, server.js ke file aur uske ander path roo directory diya hai jissey appRoot ko hum project me kahi pr bhi use kar sakte hai
                        fs.unlink(`${appRoot}/${ImageFilePath}`,(err)=>{
                            if(err){
                                return next(CustomErrorHandler.serverError(err.message));
                            }
                          
                        })
                        return next(error);
                    }

                    const {name,price,size} = req.body;

                    let document;

                    try{
                            // save image with fields in database
                        document = await Product.create({
                            name,
                            price,
                            size,
                            image: ImageFilePath
                        });
                        
                    }catch(err){
                        return next(err);
                    }
                    console.log(document);
                    res.json(document);

        })
        
    },

    //Update products only admin can update the products
    async update(req,res,next){
            
        handleMulterData(req,res, async(err)=>{
            if(err){
                return next(CustomErrorHandler.serverError(err.message));
            
            }
                //console.log(req.file);
                let ImageFilePath;
                if (req.file){
                 ImageFilePath = req.file.path;
                }
                
                
                // validation for user request should be required
                const productSchema = Joi.object({
                    name: Joi.string().required(),
                    price: Joi.number().required(),
                    size: Joi.string().required(),
                    image: Joi.string(),
                });

                const {error} = productSchema.validate(req.body);

                if(error){
                    //yaha pr validation pehle se image upload ho rahi hai agar validation me error nahi aayega to image fir dubara upload ho jayega means image double uplopad ho jayega
                    //isliye hum yaha par validation me error aate hi jo image pehle upload hui hai usko delete kar denge

                    //ye appRoot global variable banaya hai humne, server.js ke file aur uske ander path roo directory diya hai jissey appRoot ko hum project me kahi pr bhi use kar sakte hai
                    if(req.file){
                        fs.unlink(`${appRoot}/${ImageFilePath}`,(err)=>{
                            if(err){
                                return next(CustomErrorHandler.serverError(err.message));
                            }
                          
                        })
                    }
                    return next(error);
                }

                const {name,price,size} = req.body;

                let document;

                try{
                        // save image with fields in database
                    document = await Product.findOneAndUpdate({_id: req.params.id},{
                        name,
                        price,
                        size,
                        ...(req.file && {image: ImageFilePath})
                    },{new: true});

                    console.log(document);

                }catch(err){
                    return next(err);
                }
                
                res.json(document);

    })

    },

    // DELETE product from database 
    async destroy(req,res,next){

        const document = await Product.findOneAndRemove({_id: req.params.id});

        if(!document){
            return next(new Error('Nothing to delete'));
        }

            // image delete from upload folder in directory kyu jab database se image ka path delete kar denge to upload folder me wo photo rakh ke kya karenge
            
            //const imagePath = document.image;

            /* yaha ek problem hai is code me 'const imagePath = document.image;' kyu ki hamare image ka jo path hai wo hai './uploads/876876-87678.png'
            kuch is type ka, aur jo server se image get kr rahe uska path hai kuch is type ka 'http://localhost:5000/uploads/1635593918779-439777282.png'
            issey problem ye ki 'delete' function ko image ka correct path nahi mil rha hai kyu ki hamne "Product Schema ke image field me
                        "get: (image)=>{
                            return `${process.env.APP_URL}/${image}` 
                    } 
                    {
                    timestamps: true,
                        toJSON: {getters: true}, id: false/
                    });"  iye code likha taki image url se pehle domain ka link add ho jaaye taki API ko frontend me use kar sake
                        aur issey image ka path update hoke kuch aisa ban gya hai "http://localhost:5000/uploads/1635593909680-17019455.png"
                        is problem ko fix karne ka liye 'delete method' ke image path ko "._doc" likhna hoga jisey taki usko proper path mile image ko delete karne ke liye usko "uploads/1635593918779-439777282.png" ye path milega*/
                        const imagePath = document._doc.image;
                        console.log(imagePath);

            fs.unlink(`${appRoot}/${imagePath}`, (err)=>{
                
                if(err){
                    return next(CustomErrorHandler.serverError());
                }
                res.json(document);
            });

            



     },

     //pagination ke liye 'mongoose-pagination' ka use karna chahiye jab bhi get products me bahut saare products ho


     // GET ALl product from database
     async index(req, res,next){

        let document;
       try{

        document = await Product.find().select('-updatedAt -__v').sort({_id: -1});
        

       }catch(err){
           return next(CustomErrorHandler.serverError());
       }
       
    
       res.json(document);

     },

     // GET SINGLE product by id from database
     async show(req,res,next){
         
        let document;
        try {
                document = await Product.findById({_id: req.params.id}).select('-updatedAt -__v')


         }catch(err){
             return next(CustomErrorHandler.serverError());
         }

         res.json(document);

     },
     async getProducts(req, res, next) {
        let documents;
        try {
            documents = await Product.find({
                _id: { $in: req.body.ids },
            }).select('-updatedAt -__v');
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json(documents);
    },
        

}


module.exports = productController;