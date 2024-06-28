import { ReactElement } from 'react'
import { Navigate, Outlet } from 'react-router-dom';

interface PropsType{
    isAuthenticated:boolean,
    isAdmin?:boolean,
    adminRoute?:boolean,
    children?:ReactElement,
    redirect?:string
}

const ProtectedRoute = ({isAuthenticated,isAdmin=false,adminRoute=false,children,redirect="/"}:PropsType) => {
  if(!isAuthenticated){
    return <Navigate to={redirect}/>;
  }
  if(adminRoute && !isAdmin){
    return <Navigate to={redirect}/>;
  }
  return children?children:<Outlet/>;
}

export default ProtectedRoute