import { FaTrash } from "react-icons/fa"
import { Link } from "react-router-dom"
import { server } from "../redux/store"
import { CartItem as Cartitem } from "../types/types"
import { useDispatch } from "react-redux"
import { addToCart, removeFromCart } from "../redux/reducer/cartReducer"


type CartItemProps={
  cartItem:Cartitem
}

const CartItem = ({cartItem}:CartItemProps) => {

  const dispatch=useDispatch();

  const minusHandler=(cartItem:Cartitem)=>{
    if(cartItem.quantity===1){
      return;
    }
    else{
      dispatch(addToCart({...cartItem,quantity:cartItem.quantity-1}));
    }
  }

  const plusHandler=(cartItem:Cartitem)=>{
    if(cartItem.quantity===cartItem.stock){
      return;
    }
    dispatch(addToCart({...cartItem, quantity:cartItem.quantity+1}));
  }

  const removeHandler=(id:string)=>{
    dispatch(removeFromCart(id));
  }

  return (
    <div className="cart-item">
      <img src={`${server}/${cartItem.photo}`} alt={cartItem.name} />

      <article>
        <Link to ={`/product/${cartItem.productId}`}>{cartItem.name}</Link>
        <span>₹{cartItem.price}</span>
      </article>

      <div>
        <button onClick={()=>minusHandler(cartItem)}>-</button>
        <p>{cartItem.quantity}</p>
        <button onClick={()=>plusHandler(cartItem)}>+</button>
      </div>

      <button onClick={()=>removeHandler(cartItem.productId)}><FaTrash/></button>
    </div>
  )
}

export default CartItem