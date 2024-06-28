import { useState } from 'react'
import { FaSearch, FaShoppingBag, FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { User } from '../types/types';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import toast from 'react-hot-toast';


interface PropsType{
	user:User|null
}

const Header = ({user}:PropsType) => {
    const [open,setOpen]=useState<boolean>(false);

	const logoutHandler=async()=>{
		try {
			await signOut(auth);
			toast.success("Logged out successfully")

			setOpen(false)
		} catch (error) {
			toast.error("Sign Out Failed")
		}
	}

  return (
		<nav className='header'>
			<Link onClick={()=>setOpen(false)} to="/">HOME</Link>
			<Link onClick={()=>setOpen(false)} to="/search">
				<FaSearch />
			</Link>
			<Link onClick={()=>setOpen(false)} to="/cart">
				<FaShoppingBag />
			</Link>

			{user?._id ? (
				<>
					<button onClick={()=>setOpen((prev)=>!prev)}>
						<FaUser />
					</button>
                    <dialog open={open} onClose={()=>setOpen(false)}>
                        <div>
                            {user?.role==="admin"&&<Link onClick={()=>setOpen(false)} to="/admin/dashboard">Admin</Link>}

                            <Link onClick={()=>setOpen(false)} to="/orders">Orders</Link>

                            <button onClick={logoutHandler}><FaSignOutAlt/></button>
                        </div>
                    </dialog>
				</>
			) : (
				<Link onClick={()=>setOpen(false)} to="/login">
					<FaSignInAlt />
				</Link>
			)}
		</nav>
	);
}

export default Header