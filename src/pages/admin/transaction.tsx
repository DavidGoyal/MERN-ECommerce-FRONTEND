import { ReactElement, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { useAllOrdersQuery } from "../../redux/api/orderApi";
import Loader, { Skeleton } from "../../components/Loader";
import toast from "react-hot-toast";
import { CustomError } from "../../types/types";
import { UserReducerInitalState } from "../../types/reducer-types";
import { useSelector } from "react-redux";

interface DataType {
  user: string;
  amount: number;
  discount: number;
  quantity: number;
  status: ReactElement;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Avatar",
    accessor: "user",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Discount",
    accessor: "discount",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Transaction = () => {
  const [rows, setRows] = useState<DataType[]>([]);
  const {user,loading}=useSelector((state:{userReducer:UserReducerInitalState})=>state.userReducer)

  const {data,isLoading,error,isError}=useAllOrdersQuery(user?._id as string);

  if(isError){
    toast.error((error as CustomError).data.message)
  }

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Transactions",
    rows.length > 6
  )();

  useEffect(() => {
    if(data){
      setRows(data.orders.map((order) => {
        return {
          user: order.user.name,
          amount: order.total,
          discount: order.discount,
          quantity: order.orderItems.length,
          status: (
            <span className={order.status === "Delivered" ? "green" : "red"}>
              {order.status}
            </span>
          ),
          action: <Link to={`/admin/transaction/${order._id}`}>Manage</Link>,
        };
      }))
    }
  }, [data])
  
  return loading?<Loader/>:(
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading?<Skeleton count={20}/>:Table}</main>
    </div>
  );
};

export default Transaction;
