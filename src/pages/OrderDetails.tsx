import { Navigate, useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import { useSingleOrderQuery } from '../redux/api/orderApi';
import { server } from '../redux/store';

const OrderDetails = () => {
    const params=useParams();


    const {data,isLoading,isError}=useSingleOrderQuery(params.id as string);

    if(isError){
        return <Navigate to={"404"}/>
    }

    const order=data?.order!;
    
  return (
    <>
    {isLoading?<Loader/>:
    <>
        <div className="orderDetailsPage">
          <div className="orderDetailsContainer">
            <h1>
              Order #{order && order._id}
            </h1>
            <h1>Shipping Info</h1>
            <div className="orderDetailsContainerBox">
              <div>
                <p>Name:</p>
                <span>{order.user && order.user.name}</span>
              </div>
              <div>
                <p>Address:</p>
                <span>{order.shippingInfo && `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.country} - ${order.shippingInfo.pinCode}`}</span>
              </div>
            </div>
            <h1>Payment</h1>
            <div className="orderDetailsContainerBox">
              <div>
                <p
                className="green"
                >
                  PAID
                </p>
              </div>
              <div>
                <p>Amount:</p>
                <span>{order.total && `Rs.${order.total}`}</span>
              </div>
            </div>

            <h1>Order Status</h1>
            <div className="orderDetailsContainerBox">
              <div>
                <p
                className={
                  order.status &&
                  order.status === "Delivered"
                    ? "green"
                    : "red"
                }
                >
                  {order.status&&order.status}
                </p>
              </div>
            </div>
          </div>


          <div className="orderDetailsCartItems">
            <h1>Order Items</h1>
            <div className="orderDetailsCartItemsContainer">
              {order.orderItems &&
                order.orderItems.map((item) => (
                  <div key={item._id}>
                    <img src={`${server}/${item.photo}`} alt="Product" />
                     <p> {item.name}</p>
                    <span>
                      {item.quantity} X Rs.{item.price} ={" "}
                      <b>Rs.{item.price * item.quantity}</b>
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
    </>
    }
    </>
  )
}

export default OrderDetails