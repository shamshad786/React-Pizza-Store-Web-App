import Products from '../components/Products';
import Footer from '../components/Footer';
const Home = () =>{

    return(
        <>
            <div className = 'hero py-16 bg-gray-100'>
                <div className='container mx-auto flex items-center justify-between'>
                <div className='w-1/2'>
                    <h6 className='text-lg'><em>Are you hungry?</em></h6>
                    <h1 className='text-3xl md:text-6xl font-bold'>Grab the deal ! </h1>
                    <button className='px-6 py-2 rounded-full text-white font-bold mt-4 bg-yellow-500 hover:bg-yellow-600'>Order Now</button>
                </div>
                <div className='w1/2'>
                    <img className='w-4/3' src='/images/pizza.png' alt='pizza'/>
                </div>
                </div>
            </div>
        
            <Products/>
            <Footer/>
        </>
    )
}

export default Home;