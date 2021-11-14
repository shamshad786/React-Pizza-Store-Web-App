import { BrowserRouter,Route,Switch} from "react-router-dom";
import {useState,useEffect} from 'react'
import Home from "./pages/Home";
import About from "./pages/About"
import Navigation from "./components/Navigation";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import SingleProduct from "./pages/SingleProduct";
import ErrorPage from "./pages/ErrorPage";
import { CartContext } from "./CartContext";

const App = () =>{

    const [cart , setCart] = useState({})

    //fetch cart from local storage
    useEffect(() => {
        
        const cart  = window.localStorage.getItem('cart')
        setCart(JSON.parse(cart));
        //console.log(JSON.parse(cart))

    },[]);

    useEffect(() => {
            window.localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);



    return(
        
        <BrowserRouter>
        <CartContext.Provider value={{cart,setCart}}>
        <Navigation/>
            <Switch>
               
                <Route path='/' component={Home} exact />
                <Route path='/about' component={About} />
                <Route path='/products' exact component={Products} />
                <Route path='/cart' component={Cart}/>
                <Route path='/products/:id' component={SingleProduct}></Route>
                <Route component={ErrorPage}></Route>
                
            </Switch>
            </CartContext.Provider>
        </BrowserRouter>



    )
}

export default App;