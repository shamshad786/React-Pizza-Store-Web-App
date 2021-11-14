import {useContext, useEffect, useState} from 'react';

import { CartContext } from '../CartContext';

const Cart = () => {

    let  total =0;

    const [products, setProducts] = useState([]);

    const {cart,setCart} = useContext(CartContext);
    //console.log(cart);

    const [priceFetch, setTogglePriceFetch] = useState(false);

    useEffect(()=>{
        if(!cart.items){
            return;
        }
        if(priceFetch){
            return;
        }
        
        // console.log(Object.keys(cart));
            fetch('/api/products/cart-items',{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ids: Object.keys(cart.items)})

            }).then(res=>res.json())
            .then((products)=>{
                setProducts(products);
                //console.log(products)
                setTogglePriceFetch(true);
            } )
                  
    },[cart,priceFetch])


    const getQty = (productId)=>{
        //console.log(productId)
        return cart.items[productId]
    }

    const increment = (productId) => {
        const existingQty =  cart.items[productId];
        const _cart = {...cart};

        _cart.items[productId] = existingQty +1;
        // _cart.totalItems = _cart.totalItems +1;
        _cart.totalItems +=1;
        setCart(_cart);
    }


    const decrement =(productId) =>{
        const existingQty = cart.items[productId];

        if(existingQty === 1){
            return;
        }
        const _cart = {...cart};

        _cart.items[productId] = existingQty -1;
        // _cart.totalItems = _cart.totalItems -1;
        _cart.totalItems -= 1;
        setCart(_cart);

        //console.log(_cart)
    }

    const getSum = (productId,price) =>{
        const sum = price * getQty(productId)
        total +=sum;
        return sum;
    }

    const  handleDelete = (productId) =>{
        const _cart = {...cart};
        const qty = _cart.items[productId];
        delete _cart.items[productId];
         _cart.totalItems -= qty;
    //     //_cart.totalItems = _cart.totalItems - qty;
        setCart(_cart);

        const updatedProductList = products.filter((product)=> product._id !== productId);

        setProducts(updatedProductList)
    }


    const handleOrders = () => {

        window.alert('Order Placed');
        setProducts([]);
        setCart({});
    }

    
    return (
        <>
           { products.length ? 
            <div className="container mx-auto lg:w-1/2 w-full pb-24">
                <h1 className="my-12 font-bold">Cart Items</h1>

                <ul>

                {
                    products.map((product)=>{
                        return(
                            <li className=" mb-12" key={product._id}>
                        <div className="flex items-center justify-between ">
                            <div className='flex items-center'>
                                <img className="h-16" src={product.image} alt="pizza"/>
                                <span className="font-bold ml-4 w-48">{product.name}</span>
                            </div>
                            <div>
                                <button onClick={()=>{decrement(product._id)}}  className="bg-yellow-500 px-4 py-1 rounded-full leading-none">-</button>
                                <b className='px-4'>{getQty(product._id)}</b>
                                <button onClick={()=> {increment(product._id)}} className="bg-yellow-500 px-4 py-1 rounded-full leading-none">+</button>
                            </div>
                            <span>₹ {getSum(product._id, product.price)}</span>
                            <button onClick={()=> handleDelete(product._id)} 
                            className="bg-red-500 px-4 py-2 rounded-full leading-none text-white"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg></button>
                         </div>
                    </li>
                        )
                    })
                }
                                             
                </ul>
                <hr className="my-10" />
                <div className="text-right">
                   <b>Grand Total: ₹  </b> {total}
                </div>
                <div className="text-right mt-6">
                    <button onClick={handleOrders} className="bg-yellow-500 px-4 py-2 rounded-full leading-none">Order Now</button>
                </div>
            </div> 
            :
            <div className='container mx-auto '>
            <img className="  mx-auto w-1/2 mt-12" src='images/empty-cart.png' alt=''/>
            </div>
           }
        </>
    )
}

export default Cart
