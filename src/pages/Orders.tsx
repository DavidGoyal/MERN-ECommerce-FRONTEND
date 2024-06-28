import { ReactElement, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Column } from 'react-table';
import Loader, { Skeleton } from '../components/Loader';
import TableHOC from '../components/admin/TableHOC';
import { useMyOrdersQuery } from '../redux/api/orderApi';
import { RootState } from '../redux/store';
import { CustomError } from '../types/types';

type DataType={
    _id:string,
    quantity:number,
    amount:number,
    discount:number,
    status: ReactElement,
    action: ReactElement
}

const columns:Column<DataType>[]=[
    {
        Header:'ID',
        accessor:'_id'
    },
    {
        Header:'Quantity',
        accessor:'quantity'
    },
    {
        Header:'Discount',
        accessor:'discount'
    },
    {
        Header:'Amount',
        accessor:'amount'
    },
    {
        Header:'Status',
        accessor:'status'
    },
    {
        Header:'Action',
        accessor:'action'
    }
]


const Orders = () => {
    const [rows,setRows]=useState<DataType[]>([]);

    const {user,loading}=useSelector((state:RootState)=>state.userReducer)

    const {data,isLoading,isError,error}=useMyOrdersQuery(user?._id as string)

    const Table=TableHOC<DataType>(columns,rows,"dashboard-product-box","Orders",rows.length>6)();

    if(isError){
        toast.error((error as CustomError).data.message)
    }

    useEffect(() => {
      if(data){
        setRows(data.orders.map((order)=>{
            return{
                _id:order._id,
                quantity:order.orderItems.length,
                amount:order.total,
                discount:order.discount,
                status: <span className={order.status==="Delivered"?"green":"red"}>{order.status}</span>,
                action: <Link to={`/order/${order._id}`}>View</Link>
            }
        }))
      }
    }, [data])
    

  return loading?<Loader/>:(
    <div className="container">
        <h1>My Orders</h1>
        {
            isLoading?<Skeleton count={20}/>:Table
        }
    </div>
  )
}

export default Orders