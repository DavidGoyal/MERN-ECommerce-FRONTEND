import { ChangeEvent, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useNewProductMutation } from "../../../redux/api/productApi";
import { useSelector } from "react-redux";
import { UserReducerInitalState } from "../../../types/reducer-types";
import toast from "react-hot-toast";
import { CustomError } from "../../../types/types";
import { useNavigate } from "react-router-dom";

const NewProduct = () => {
  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [price, setPrice] = useState<number>(1000);
  const [stock, setStock] = useState<number>(1);
  const [photoPrev, setPhotoPrev] = useState<string>("");
  const [photo, setPhoto] = useState<File>();

  const {user,loading}=useSelector((state:{userReducer:UserReducerInitalState})=>state.userReducer)
  const navigate=useNavigate();

  const [newProduct]=useNewProductMutation();

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];

    const reader: FileReader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPhotoPrev(reader.result);
          setPhoto(file);
        }
      };
    }
  };

  const submitHandler = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(!name || !price || !category || stock<0 || !photo){
      return;
    }
    const myForm=new FormData();
    myForm.set("name",name);
    myForm.set("price", price.toString());
    myForm.set("category", category);
    myForm.set("stock", stock.toString());
    myForm.set("photo", photo);

    try {
      const res=await newProduct({formData:myForm,id:user?._id as string});
  
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
    setName("");

    setCategory("");
    setPrice(1000);
    setStock(1);
    setPhotoPrev("");
    setPhoto(undefined)
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        <article>
          <form onSubmit={submitHandler}>
            <h2>New Product</h2>
            <div>
              <label>Name</label>
              <input
                type="text"
                placeholder="Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label>Price</label>
              <input
                type="number"
                placeholder="Price"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Stock</label>
              <input
                type="number"
                placeholder="Stock"
                required
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
              />
            </div>

            <div>
              <label>Category</label>
              <input
                type="text"
                placeholder="eg. laptop, camera etc"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div>
              <label>Photo</label>
              <input required type="file" onChange={changeImageHandler} />
            </div>

            {photoPrev && <img src={photoPrev} alt="New Image" />}
            <button disabled={loading} type="submit">Create</button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default NewProduct;
