import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useDeleteProductMutation, useProductDetailsQuery, useUpdateProductMutation } from "../../../redux/api/productApi";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Skeleton } from "../../../components/Loader";
import { server } from "../../../redux/store";
import { CustomError } from "../../../types/types";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { UserReducerInitalState } from "../../../types/reducer-types";


const Productmanagement = () => {
  const params=useParams();
  const id=params.id;
  const navigate=useNavigate();

  const {user,loading}=useSelector((state:{userReducer:UserReducerInitalState})=>state.userReducer)

  const {data,isLoading,isError}=useProductDetailsQuery(id!);
  const [updateProduct]=useUpdateProductMutation();
  const [deleteProduct]=useDeleteProductMutation();




  const {price,name,photo,stock,category}=data?.product || {
    name:"",
    price:0,
    stock:0,
    category:"",
    photo:""
  }

  const [priceUpdate, setPriceUpdate] = useState<number>(price);
  const [stockUpdate, setStockUpdate] = useState<number>(stock);
  const [nameUpdate, setNameUpdate] = useState<string>(name);
  const [categoryUpdate, setCategoryUpdate] = useState<string>(category);
  const [photoUpdate, setPhotoUpdate] = useState<string>("");
  const [photoFile, setPhotoFile] = useState<File>();



  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];

    const reader: FileReader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPhotoUpdate(reader.result);
          setPhotoFile(file);
        }
      };
    }
  };

  const submitHandler = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();


    const myForm=new FormData();
    if(nameUpdate) myForm.set("name",nameUpdate);
    if(priceUpdate) myForm.set("price", priceUpdate.toString());
    if(categoryUpdate) myForm.set("category", categoryUpdate);
    if(stockUpdate!==undefined) myForm.set("stock", stockUpdate.toString());
    if(photoFile) myForm.set("photo", photoFile);


    try {
      const res=await updateProduct({formData:myForm,userId:user?._id as string,id:data?.product._id as string});
  
      if(res.data){
        toast.success(res.data.message);
        navigate("/admin/product");
      }
      else{
        toast.error((res.error as CustomError).data.message);
      }
    } catch (error) {
      toast.error((error as CustomError).data.message);
    }

  };


  const deleteProductHandler=async()=>{
    try {
      const res=await deleteProduct({userId:user?._id as string,id:data?.product._id as string});
  
      if(res.data){
        toast.success(res.data.message);
        navigate("/admin/product");
      }
      else{
        toast.error((res.error as CustomError).data.message);
      }
    } catch (error) {
      toast.error((error as CustomError).data.message);
    }
  }

  useEffect(() => {
    if(data){
      setPriceUpdate(data.product.price);
      setStockUpdate(data.product.stock);
      setNameUpdate(data.product.name);
      setCategoryUpdate(data.product.category);
    }
  }, [data])

  if(isError){
    return <Navigate to={"/404"}/>
  }
  

  return(
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {isLoading?<Skeleton count={20}/>:<><section>
          <strong>{`ID - ${data?.product._id}`}</strong>
          <img src={`${server}/${photo}`} alt="Product" />
          <p>{name}</p>
          {stock > 0 ? (
            <span className="green">{stock} Available</span>
          ) : (
            <span className="red"> Not Available</span>
          )}
          <h3>₹{price}</h3>
        </section>
        <article>
          <button className="product-delete-btn" onClick={deleteProductHandler}>
            <FaTrash />
          </button>
          <form onSubmit={submitHandler}>
            <h2>Manage</h2>
            <div>
              <label>Name</label>
              <input
                type="text"
                placeholder="Name"
                value={nameUpdate}
                onChange={(e) => setNameUpdate(e.target.value)}
              />
            </div>
            <div>
              <label>Price</label>
              <input
                type="number"
                placeholder="Price"
                value={priceUpdate}
                onChange={(e) => setPriceUpdate(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Stock</label>
              <input
                type="number"
                placeholder="Stock"
                value={stockUpdate}
                onChange={(e) => setStockUpdate(Number(e.target.value))}
              />
            </div>

            <div>
              <label>Category</label>
              <input
                type="text"
                placeholder="eg. laptop, camera etc"
                value={categoryUpdate}
                onChange={(e) => setCategoryUpdate(e.target.value)}
              />
            </div>

            <div>
              <label>Photo</label>
              <input type="file" onChange={changeImageHandler} />
            </div>

            {photoUpdate && <img src={photoUpdate} alt="New Image" />}
            <button disabled={loading} type="submit">Update</button>
          </form>
        </article></>}
      </main>
    </div>
  );
};

export default Productmanagement;
