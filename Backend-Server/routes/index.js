const express = require('express')
const router = express.Router();

//user authentication controller 
const registerController = require('../controllers/registerController');
const loginController = require('../controllers/loginController');
const userAuthentication = require('../controllers/userAuthentication');
const refreshTokenController = require('../controllers/refreshTokenController');

//user authentication middleware 
const auth = require('../middlewares/auth');
//admin auth middleware
const adminAuth = require('../middlewares/adminAuth');

// products CRUD controller 
const productController = require('../controllers/products/productController')

//register logic
router.post('/register',registerController.register)
//user login
router.post('/login',loginController.login)
//user authentication 
router.get('/me', auth, userAuthentication.userAuth)
router.post('/refresh', refreshTokenController.refresh)
router.post('/logout',auth,loginController.logout)

//CREATE PRODUCT  only admin can create the product
router.post('/products', [auth,adminAuth],productController.store)

//UPDATE PRODUCT only admin can update the product
router.put('/products/:id', [auth,adminAuth],productController.update)

//DELETE PRODUCT only admin can delete the product
router.delete('/products/:id', [auth,adminAuth], productController.destroy)


//GET CART ITEMS from database
router.post('/products/cart-items', productController.getProducts)

//GET All products from database 
router.get('/products', productController.index)

//GET SINGLE product from database 
router.get('/products/:id', productController.show)


module.exports = router; 



