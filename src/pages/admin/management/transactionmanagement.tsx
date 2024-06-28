import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import Loader, { Skeleton } from "../../../components/Loader";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useDeleteOrderMutation, useSingleOrderQuery, useUpdateOrderMutation } from "../../../redux/api/orderApi";
import { server } from "../../../redux/store";
import { UserReducerInitalState } from "../../../types/reducer-types";
import { CustomError, OrderItem } from "../../../types/types";

type Order = {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: number;
  status: string;
  subtotal: number;
  discount: number;
  shippingCharges: number;
  tax: number;
  total: number;
  orderItems: OrderItem[];
};

const TransactionManagement = () => {
  const params=useParams();
  const navigate=useNavigate();

  const [order, setOrder] = useState<Order>({
    name: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: 0,
    status: "",
    subtotal: 0,
    discount: 0,
    shippingCharges: 0,
    tax: 0,
    total: 0,
    orderItems:[],
  });

  const {
    name,
    address,
    city,
    country,
    state,
    pinCode,
    subtotal,
    shippingCharges,
    tax,
    discount,
    total,
    status,
    orderItems
  } = order;

  const {user,loading}=useSelector((state:{userReducer:UserReducerInitalState})=>state.userReducer)

  const {data,isLoading,isError}=useSingleOrderQuery(params.id as string);
  const [updateOrder]=useUpdateOrderMutation();
  const [deleteOrder]=useDeleteOrderMutation();


  useEffect(() => {
    if(data){
      setOrder({
        name:data.order.user.name,
        address:data.order.shippingInfo.address,
        city:data.order.shippingInfo.city,
        country:data.order.shippingInfo.country,
        state:data.order.shippingInfo.state,
        pinCode:Number(data.order.shippingInfo.pinCode),
        status:data.order.status,
        subtotal:data.order.subTotal,
        discount:data.order.discount,
        shippingCharges:data.order.shippingCharges,
        tax:data.order.tax,
        total:data.order.total,
        orderItems:data.order.orderItems,
      })
    }
  }, [data])
  

  const updateHandler = async() => {
    try {
      const res=await updateOrder({id:params.id as string,userId:user?._id as string})

      if(res.data){
        toast.success(res.data.message);
      }
      else{
        toast.error((res.error as CustomError).data.message);
      }
    } catch (error) {
      toast.error((error as CustomError).data.message);
    }
  };


  const deleteHandler=async()=>{
    try {
      const res=await deleteOrder({id:params.id as string,userId:user?._id as string})

      if(res.data){
        toast.success(res.data.message);
      }
      else{
        toast.error((res.error as CustomError).data.message);
      }
    } catch (error) {
      toast.error((error as CustomError).data.message);
    }
    navigate("/admin/transaction");
  };

  if(isError){
    return <Navigate to={"/404"}/>
  }


  return loading?<Loader/>:(
    <div className="admin-container">
      <AdminSidebar />
      {isLoading?<Skeleton count={20}/>:<main className="product-management">
        <section
          style={{
            padding: "2rem",
          }}
        >
          <h2>Order Items</h2>

          {orderItems.map((i) => (
            <ProductCard
              key={i._id}
              name={i.name}
              photo={`${server}/${i.photo}`}
              productId={i.productId}
              _id={i._id}
              quantity={i.quantity}
              price={i.price}
            />
          ))}
        </section>

        <article className="shipping-info-card">
          <button className="product-delete-btn" onClick={deleteHandler}>
            <FaTrash />
          </button>
          <h1>Order Info</h1>
          <h5>User Info</h5>
          <p>Name: {name}</p>
          <p>
            Address: {`${address}, ${city}, ${state}, ${country} ${pinCode}`}
          </p>
          <h5>Amount Info</h5>
          <p>Subtotal: {subtotal}</p>
          <p>Shipping Charges: {shippingCharges}</p>
          <p>Tax: {tax}</p>
          <p>Discount: {discount}</p>
          <p>Total: {total}</p>

          <h5>Status Info</h5>
          <p>
            Status:{" "}
            <span
              className={
                status === "Delivered"
                  ? "purple"
                  : status === "Shipped"
                  ? "green"
                  : "red"
              }
            >
              {status}
            </span>
          </p>
          <button className="shipping-btn" onClick={updateHandler}>
            Process Status
          </button>
        </article>
      </main>}
    </div>
  );
};

const ProductCard = ({
  name,
  photo,
  price,
  quantity,
  productId,
}: OrderItem) => (
  <div className="transaction-product-card">
    <img src={photo} alt={name} />
    <Link to={`/product/${productId}`}>{name}</Link>
    <span>
      ₹{price} X {quantity} = ₹{price * quantity}
    </span>
  </div>
);

export default TransactionManagement;
