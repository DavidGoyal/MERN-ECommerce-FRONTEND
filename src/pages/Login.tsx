import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';
import { auth } from '../firebase';
import { getUser, useLoginMutation } from '../redux/api/userApi';
import { MessageResponse } from '../types/api-types';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { userExists } from '../redux/reducer/userReducer';

const Login = () => {
    const navigate=useNavigate();
    const dispatch=useDispatch();

    const [gender,setGender]=useState<string>("");
    const [date,setDate]=useState<string>("");

    const [userLogin]=useLoginMutation();

    const loginHandler=async()=>{
        try {
            const provider=new GoogleAuthProvider();

            const {user}=await signInWithPopup(auth,provider); 

            const res=await userLogin({
                name:user.displayName as string,
                email:user.email as string,
                photo:user.photoURL as string,
                gender,
                _id:user.uid,
                dob:date,
                role:"user"
            })

            if("data" in res){
                toast.success(res.data?.message || "Logged In Successfully");
                const data = await getUser(user.uid);
                dispatch(userExists(data?.user!));
                navigate("/");
            }
            else{
                const error=res.error as FetchBaseQueryError;
                const message=error.data as MessageResponse;
                toast.error(message.message)
                await signOut(auth);
            }
        } catch (error) {
            toast.error("Sign In Fail");
            await signOut(auth);
        }
    }

  return (
    <div className='login'>
        <main>
            <h1 className='heading'>Login</h1>

            <div>
                <label>Gender</label>
                <select name="gender" value={gender} onChange={(e)=>setGender(e.target.value)}>
                    <option>Choose Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
            </div>

            <div>
                <label>Date of Birth</label>
                <input type="date" value={date} onChange={(e)=>setDate(e.target.value)}/>
            </div>

            <div>
                <p>Already Signed In Once</p>
                <button onClick={loginHandler}><FcGoogle/><span>Sign In With Google</span></button>
            </div>
        </main>
    </div>
  )
}

export default Login