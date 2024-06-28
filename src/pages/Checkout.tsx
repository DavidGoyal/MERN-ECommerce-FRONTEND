import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { useNewOrderMutation } from "../redux/api/orderApi";
import { refetchProducts, resetCart } from "../redux/reducer/cartReducer";
import { RootState } from "../redux/store";
import { NewOrderRequest } from "../types/api-types";
import { CustomError } from "../types/types";


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_API_KEY);

const CheckoutForm=()=>{
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const stripe=useStripe()
  const elements=useElements()

  const [isProcessing,setIsProcessing]=useState<boolean>(false);

  const {user,loading}=useSelector((state:RootState)=>state.userReducer)

  const {
		cartItems,
		total,
		subTotal,
		tax,
		discount,
		shippingCharges,
		shippingInfo,
	} = useSelector(
		(state: RootState) => state.cartReducer
	);

  const [newOrder]=useNewOrderMutation();


  const submitHandler=async(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();

    if(!stripe || !elements) return;
    setIsProcessing(true);

    const orderData:NewOrderRequest={
      orderItems:cartItems,
      shippingCharges,
      shippingInfo:shippingInfo!,
      total,
      tax,
      discount,
      subTotal,
      user: user!._id,
    }

    try {
      const { paymentIntent, error } = await stripe.confirmPayment({
				elements,
				confirmParams: { return_url: window.location.origin },
				redirect: "if_required",
			});

      if(error){ 
        setIsProcessing(false);
        return toast.error(error.message || "Something Went Wrong");
      }

      if(paymentIntent?.status==="succeeded"){
        const res=await newOrder(orderData);
        dispatch(resetCart());
        dispatch(refetchProducts(true));
        
        if(res.data){
          toast.success(res.data.message);
          navigate("/orders");
        }
        else{
          toast.error((res.error as CustomError).data.message);
        }
      }
    } catch (error) {
      setIsProcessing(false);
      return toast.error("Something Went Wrong");
    }
  }

    return loading?<Loader/>:<div className="checkout-container">
      <form onSubmit={submitHandler}>
        <PaymentElement/>
        <button type="submit" disabled={isProcessing}>{isProcessing?"Processing...":"Pay"}</button>
      </form>
    </div>
}

const Checkout = () => {
  const location=useLocation();
  const clientSecret:string | undefined=location.state

  if(!clientSecret) return <Navigate to={"/shipping"}/>
  return (
    <Elements stripe={stripePromise} options={{clientSecret}}>
        <CheckoutForm/>
    </Elements>
  )
}

export default Checkout