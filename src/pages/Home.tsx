import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Skeleton } from '../components/Loader';
import ProductCard from '../components/ProductCard';
import { useLatestProductsQuery } from '../redux/api/productApi';
import { addToCart } from '../redux/reducer/cartReducer';
import { CartItem } from '../types/types';

const Home = () => {
  const dispatch=useDispatch();

  const {data,isLoading,isError,error}=useLatestProductsQuery("");

  if(isError) toast.error(error as string || "Cannot fetch latest products")

  const addToCartHandler=(cartItem:CartItem)=>{
	if(cartItem.stock<=0) return toast.error("Out of stock")
	
	dispatch(addToCart(cartItem));
	toast.success("Item added to cart")
  }
  return (
		<div className="home">
			<section></section>

			<h1>
				Latest Products
				<Link to="/search" className="findmore">
					More
				</Link>
			</h1>

			<main>
				{isLoading ? (
					<Skeleton width='80vw' />
				) : (
					data?.products.map((product) => (
						<ProductCard
							key={product._id}
							productId={product._id}
							name={product.name}
							price={product.price}
							stock={product.stock}
							handler={addToCartHandler}
							photo={product.photo}
						/>
					))
				)}
			</main>
		</div>
	);
}

export default Home