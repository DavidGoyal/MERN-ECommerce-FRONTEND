import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Column } from "react-table";
import Loader, { Skeleton } from "../../components/Loader";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { useAllUsersQuery, useDeleteUserMutation } from "../../redux/api/userApi";
import { RootState } from "../../redux/store";
import { CustomError } from "../../types/types";

interface DataType {
  avatar: ReactElement;
  name: string;
  email: string;
  gender: string;
  role: string;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Avatar",
    accessor: "avatar",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Gender",
    accessor: "gender",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Role",
    accessor: "role",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Customers = () => {
  const [rows, setRows] = useState<DataType[]>([]);

  const {user,loading}=useSelector((state:RootState)=>state.userReducer)

  const {data,isLoading,isError,error}=useAllUsersQuery(user?._id as string)
  const [deleteUser]=useDeleteUserMutation();

  if(isError){
    toast.error((error as CustomError).data.message);
  }

  const deleteHandler=async(id:string)=>{
    try {
      const res=await deleteUser({userId:id,adminId:user?._id as string})

      if(res.data){
        toast.success(res.data.message);
      }
      else{
        toast.error((res.error as CustomError).data.message);
      }
    } catch (error) {
      toast.error("Something Went Wrong");
    }
  }

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Customers",
    rows.length > 6
  )();

  useEffect(() => {
    if(data){
      setRows(data.users.map((user)=>({
        avatar: (
          <img
            style={{
              borderRadius: "50%",
            }}
            src={user.photo}
            alt={`${user.name}`}
          />
        ),
        name: user.name,
        email: user.email,
        gender: user.gender,
        role: user.role,
        action: (
          <button onClick={()=>deleteHandler(user._id)}>
            <FaTrash />
          </button>
        ),
      })))
    }
  }, [data])
  

  return loading?<Loader/>:(
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading?<Skeleton count={20}/>:Table}</main>
    </div>
  );
};

export default Customers;
