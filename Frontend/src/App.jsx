import { Route, Routes } from "react-router-dom"
import Home from "./Pages/Home"
import Product from "./Pages/Product"
import Verify from "./Pages/Verify"
import Cart from "./Pages/Cart"
import Order from "./Pages/Order"
import MyOrders from "./Pages/MyOrders"
import Header from "./components/Header"
import Login from "./components/Login"
import SignUp from "./components/SignUp"
import ShopContextProvider from "./context/ShopContext"
import Profile from "./Pages/Profile"
import Protected from "../routes/Protected"
import { NotFound } from "./Pages/NotFound"

const App = () => {
  return (
    <ShopContextProvider>

      <Header/>
      <Routes>
        <Route path="/" element={<Home/>}/>
          <Route path="/product/:productId" element={<Product/>}/>
            <Route path="/cart" element={<Cart/>}/>
                <Route path="/verify" element={<Verify/>}/>
                    <Route path="/login" element={<Login/>}/>
                        <Route path="/signup" element={<SignUp/>}/>


            //==========================================================//
           //                    Protected Routes                      // 
          //==========================================================//


              <Route path="/order" element={
                <Protected>
                  <Order/>
                </Protected>
                }/>
                  <Route path="/myorders" element={
                    <Protected>
                      <MyOrders/>
                    </Protected>
                  }/>
                        <Route path="/profile" element={
                          <Protected>
                            <Profile/>
                          </Protected>          
                          }/>
                          <Route path="*" element={<NotFound/>}/>
      </Routes>
    </ShopContextProvider>
  )
}

export default App