import {Link} from 'react-router-dom';
import { useContext, useState } from 'react';
import { CartContext } from '../CartContext';


const Product = (props) =>{
    //console.log(props);

    //---------------pizza ko add karne par added ka effect aeryega us ka logics hai wo hai 

    const [ isAdding, setIsAdding] = useState(false);



    //------------------------------------------------Cart add logics-------------------
   const {cart, setCart} =  useContext(CartContext);

    const {product} = props;
    //console.log(product)

    const addToCart = (event,product) =>{
        //console.log(event);
        console.log(product)
         
        let _cart = {...cart}; // yaha local cart ke variable ko define kar usme context ke cart ko clone kiya hai taki uski original cart change naa ho kyu ki cart ek object hai aur object by reference hota hai. 

        if(!_cart.items){
            _cart.items = {}
        }

        if(_cart.items[product._id]){ // ye card ke ander item me product ki agar id already exist hai to uski quantity +1 badha dega

        // _cart.items[product._id] = _cart.items[product._id] +1;
        _cart.items[product._id] =+1;
        }else{
            _cart.items[product._id] = 1;
        }

        if(!_cart.totalItems){
            _cart.totalItems = 0;
        }

        // _cart.totalItems = _cart.totalItems + 1;
        _cart.totalItems += 1;

        setCart(_cart)
        setIsAdding(true)

        setTimeout(()=>{
            setIsAdding(false);
        },1000);
    }

        


    return(
        <>
           
            <div  className=" shadow-md px-3 bg-white">
            <Link to={`/products/${product._id}`}>
                <img src={product.image}alt=''/>
                </Link>
                <div className='text-center'>
                <h2 className ='text-lg font-bol py-2' >{product.name}</h2>
                <span className ='bg-gray-200 py-1 rounded-full text-sm px-4'>{product.size}</span>
                </div>
                <div className ='flex justify-between items-center my-4'>
                    <span>₹ {product.price}</span>
                    <button disabled={isAdding} onClick={(e)=> {addToCart(e,product)}} className={`${isAdding ? 'bg-green-500' : 'bg-yellow-500'} bg-yellow-500 py-1 px-4 rounded-full font-bold`}>ADD{isAdding ? 'ED' : ''}</button>
                </div>
            </div>
           


        </>
    )
}

export default Product;