import Product from "./Product";
import {useState, useEffect, useContext} from 'react';
import { CartContext } from "../CartContext";


const Products = () =>{

//const {name} = useContext(CartContext);


    const [product, setProduct] = useState([]);

    useEffect(()=>{
            fetch('/api/products').then((response)=>{
               return response.json()
            }).then((productsData)=>{
                //console.log(productsData);
                setProduct(productsData);
            });
    },[]); 

    return (
        <>
            <div className = 'container mx-auto pb-24'>
                    <h1 className ='text-2xl font-bold my-8'>Products</h1>
                    <div className ='grid grid-cols-5 my-8 gap-24'>

                    {
                        product.map(product =>  <Product key={product._id} product={product} />)
                    }
                            
                    </div>

                    
            </div>
        </>
    )
            
}

export default Products;