import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import { Skeleton } from "../../components/Loader";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { useAllProductsQuery } from "../../redux/api/productApi";
import { RootState, server } from "../../redux/store";
import { CustomError } from "../../types/types";
import { refetchProducts } from "../../redux/reducer/cartReducer";


interface DataType {
  photo: ReactElement;
  name: string;
  price: number;
  stock: number;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Photo",
    accessor: "photo",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Price",
    accessor: "price",
  },
  {
    Header: "Stock",
    accessor: "stock",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];


const Products = () => {
  const dispatch=useDispatch();

  const {user}=useSelector((state:RootState)=>state.userReducer)

  const {isRefetch}=useSelector((state:RootState)=>state.cartReducer)

  const {data,isLoading,isError,error,refetch}=useAllProductsQuery(user?._id || "");

  const [rows, setRows] = useState<DataType[]>([]);

  if(isError){
    toast.error((error as CustomError).data.message);
  }


  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Products",
    rows.length > 6
  )();

  useEffect(() => {
    if(data){
      setRows(data.products.map((i)=>({
        photo:<img src={`${server}/${i.photo}`}/>,
        name:i.name,
        price:i.price,
        stock:i.stock,
        action:<Link to={`/admin/product/${i._id}`}>Manage</Link>
      })))
    }
  }, [data])

  useEffect(()=>{
    if(isRefetch){
      refetch();
      dispatch(refetchProducts(false));
    }
  },[isRefetch,dispatch,refetch])
  

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading?<Skeleton count={20}/>:Table}</main>
      <Link to="/admin/product/new" className="create-product-btn">
        <FaPlus />
      </Link>
    </div>
  );
};

export default Products;
