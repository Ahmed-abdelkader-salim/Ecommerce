import { useContext } from "react";
import { Navigate } from "react-router-dom"
import { ShopContext } from "../src/context/ShopContext";

const Protected = ({children}) => {
    const {token} = useContext(ShopContext);
  if(!token){
    return <Navigate to="/login" replace/>
  }

  return children;
}

export default Protected
