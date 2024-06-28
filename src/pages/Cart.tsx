import axios from "axios";
import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CartItem from "../components/CartItem";
import { Skeleton } from "../components/Loader";
import { applyDiscount, calculatePrice } from "../redux/reducer/cartReducer";
import { RootState, server } from "../redux/store";




const Cart = () => {

  const dispatch=useDispatch();	
  const {cartItems,subTotal,tax,shippingCharges,discount,total,loading}=useSelector((state:RootState)=>state.cartReducer)

  const [couponCode,setCouponCode]=useState<string>("");
  const [isValidCouponCode,setIsValidCouponCode]=useState<boolean>(false);

  useEffect(() => {
	const {token,cancel}=axios.CancelToken.source();

    const timeoutId = setTimeout(() => {
			axios.get(`${server}/api/v1/payment/discount?coupon=${couponCode}`,{cancelToken:token})
			.then((res)=>{
				setIsValidCouponCode(true);
				dispatch(applyDiscount(res.data.discount))
				dispatch(calculatePrice());
			})
			.catch(()=>{
				setIsValidCouponCode(false);
				dispatch(applyDiscount(0))
				dispatch(calculatePrice());
			})

		}, 1000);

      return ()=>{
        clearTimeout(timeoutId);
		cancel();
        setIsValidCouponCode(false);
      }
  }, [couponCode,dispatch])


  useEffect(() => {
	dispatch(calculatePrice());
  }, [cartItems,dispatch])
  
  

  return loading?<Skeleton count={20}/>:(
		<div className="cart">
			<main>
        {cartItems.length>0?cartItems.map((cart,index)=>
        <CartItem key={index} cartItem={cart}/>
        ):(
          <h1>No Cart Items</h1>
        )}
      </main>

			<aside>
				<p>Subtotal: ₹{subTotal}</p>
				<p>Shipping Charges: ₹{shippingCharges}</p>
				<p>Tax: ₹{tax}</p>
				<p>
					Discount:<em className="red"> - ₹{discount}</em>
				</p>
				<p>
					<b>Total: ₹{total}</b>
				</p>

				<input
					type="text"
					placeholder="Coupon Code"
					value={couponCode}
					onChange={(e) => setCouponCode(e.target.value)}
				/>

				{couponCode && (isValidCouponCode ? (
					<span className="green">
						₹{discount} off using the <code>{couponCode}</code>
					</span>
				) : (
					<span className="red">Invalid Coupon <VscError/></span>
				))}

        {cartItems.length>0&&
          <Link to="/shipping">Checkout</Link>
        }
			</aside>
		</div>
	);
}

export default Cart