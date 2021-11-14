import {useState,useEffect} from 'react';
import { useParams,useHistory } from 'react-router-dom';

const SingleProduct = () => {

    const [product, setProduct] = useState({});

    const params = useParams(); // ye routes ke pasth se 'products/:id' jo bhi di waha hoti usko apne aap utha leta hai
    //console.log(params)

        const history = useHistory();

    useEffect(() => {
            fetch(`/api/products/${params.id}`).then(res => res.json()
            ).then((data => {
                setProduct(data);
                //console.log(data)
            }));
            
    }, [params.id])
    return(
        <>      <div className="w-screen h-screen bg-gray-100 py-8"> 
                <div className="container mx-auto mt-12 shadow-md bg-white">
                    <button className="bg-blue-500 text-white py-1 px-8 rounded-full mb-12 font-bold focus:outline-black" onClick={ () => { history.goBack()}}>Back</button>             
                    <div className="flex " >
                        <img src={product.image} width="270px" height="270px" alt="pizza" />
                        <div className="ml-16 mt-4 ">
                            <h1 className="text-xl font-bold ">{product.name}</h1>

                            <div className="text-md">{product.size}</div>
                            <div className=" font-bold mt-2">₹ {product.price}</div>
                            <button className="bg-yellow-500 py-1 px-8 rounded-full mt-4 font-bold">Add to Cart</button>
                            <div className="pr-10 pb-4 ">
                            <p className="mt-4 text-gray-500 text-justify select-none">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                            </div>
                        </div>
                    </div>
                </div>  
                </div>
                    
        </>
    )
}
export default SingleProduct;


