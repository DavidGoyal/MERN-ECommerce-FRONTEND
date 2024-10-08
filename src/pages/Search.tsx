import { useState } from 'react'
import ProductCard from '../components/ProductCard';
import { useAllCategoriesQuery, useSearchProductsQuery } from '../redux/api/productApi';
import { Skeleton } from '../components/Loader';
import toast from 'react-hot-toast';
import { CartItem, CustomError } from '../types/types';
import { addToCart } from '../redux/reducer/cartReducer';
import { useDispatch } from 'react-redux';


const Search = () => {
  const dispatch=useDispatch();

  const [search,setSearch]=useState<string>("");
  const [sort,setSort]=useState<string>("");
  const [maxPrice,setMaxPrice]=useState<number>(100000);
  const [category,setCategory]=useState<string>("");
  const [page,setPage]=useState<number>(1);

  const {data:categoriesResponse,isLoading:categoryLoading,isError:isCategoryError,error:categoryError}=useAllCategoriesQuery();

  const {
		data: products,
		isLoading: productLoading,
		isError: isProductError,
		error: productError,
	} = useSearchProductsQuery({ search, sort, category, price: maxPrice, page });

  if(isCategoryError){
    toast.error((categoryError as CustomError).data.message);
  }

  if(isProductError){
    toast.error((productError as CustomError).data.message);
  }

  const addToCartHandler=(cartItem:CartItem)=>{
	if(cartItem.stock<=0) return toast.error("Out of stock")
	
	dispatch(addToCart(cartItem));
	toast.success("Item added to cart")
  }

  const isPrevPage=page>1;
  const isNextPage=products && page<products.totalPage;

  return (
		<div className="product-search-page">
			<aside>
				<h2>Filters</h2>

				<div>
					<h4>Sort</h4>
					<select value={sort} onChange={(e) => setSort(e.target.value)}>
						<option value="">None</option>
						<option value="asc">Price (Low to High)</option>
						<option value="dsc">Price (High to Low)</option>
					</select>
				</div>

				<div>
					<h4>Max Price: {maxPrice || ""}</h4>
					<input
						type="range"
						min={100}
						max={100000}
						value={maxPrice}
						onChange={(e) => setMaxPrice(Number(e.target.value))}
					/>
				</div>

	
				<div>
					<h4>Category</h4>
					<select
						value={category}
						onChange={(e) => setCategory(e.target.value)}
					>
						<option value="">ALL</option>
						{categoryLoading===false && categoriesResponse?.categories?.map((i:string, index:number) => (
							<option key={index} value={i}>
								{i.toUpperCase()}
							</option>
						))}
					</select>
				</div>

			</aside>

			<main>
				<h1>Products</h1>
				<input
					type="text"
					placeholder="Search By Name..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>

				{productLoading?<Skeleton count={10}/>:<div className="search-product-list">
					{products?.products?.map((product) => (
						<ProductCard
							key={product._id}
							productId={product._id}
							name={product.name}
							price={product.price}
							stock={product.stock}
							photo={product.photo}
							handler={addToCartHandler}
						/>
					))}
				</div>}

				{products && products.totalPage>1 && <article>
					<button
						disabled={!isPrevPage}
						onClick={() => setPage((prev) => prev - 1)}
					>
						Prev
					</button>
					<p>{page} of {products.totalPage}</p>
					<button
						disabled={!isNextPage}
						onClick={() => setPage((prev) => prev + 1)}
					>
						Next
					</button>
				</article>}
			</main>
		</div>
	);
}

export default Search