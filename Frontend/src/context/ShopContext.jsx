import { createContext, useEffect, useState } from "react"
import { all_products } from "../assets/data"
import axios from "axios"

// eslint-disable-next-line react-refresh/only-export-components
export const ShopContext = createContext()

const ShopContextProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState({})
    const [products, setProducts] = useState([])
    const [token, setToken] = useState("")
    const [user, setUser] = useState(null)
    const url = "http://localhost:4000"

    // Add to cart
    const addToCart = async (id, quantity = 1) => {
        setCartItems((prev) => ({
            ...prev,
            [id]: prev[id] ? prev[id] + quantity : quantity,
        }))

        if (token) {
            try {
                await axios.post(`${url}/api/cart/add`,
                    { itemId: id },
                    { headers: { Authorization: `Bearer ${token}` } }
                )
            } catch (error) {
                console.log(error.message)
            }
        }
    }

    // Remove from cart
    const removeFromCart = async (id, removeAll = false) => {
        setCartItems((prev) => {
            const updated = { ...prev }
            if (removeAll || updated[id] === 1) {
                delete updated[id]
            } else if (updated[id] > 1) {
                updated[id]--
            }
            return updated
        })

        if (token) {
            try {
                await axios.post(`${url}/api/cart/remove`,
                    { itemId: id },
                    { headers: { Authorization: `Bearer ${token}` } }
                )
            } catch (error) {
                console.log(error.message)
            }
        }
    }

    // Clear cart
    const clearCart = async () => {
        setCartItems({})
        localStorage.removeItem("cartItems")

        if (token) {
            try {
                await axios.post(`${url}/api/cart/clear`, {},
                    { headers: { Authorization: `Bearer ${token}` } }
                )
            } catch (error) {
                console.log(error.message)
            }
        }
    }

    // Total amount
    const getTotalCartAmount = () => {
        return Object.entries(cartItems).reduce((total, [id, quantity]) => {
            const product = products.find((p) => p._id === id)
            return total + (product ? product.price * quantity : 0)
        }, 0)
    }

    // Fetch products
    const fetchProductList = async () => {
        try {
            const res = await axios.get(`${url}/api/product/list`)
            setProducts(res.data.data || [])
        } catch (error) {
            console.log(error.message)
            setProducts(all_products) // fallback
        }
    }

    // Load cart from backend
    const loadCartData = async (token) => {
        try {
            const res = await axios.get(`${url}/api/cart/get`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            if (res.data.success) {
                setCartItems(res.data.cartData || {})
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    // Save cart to localStorage
    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems))
    }, [cartItems])

    // Load data on mount
    useEffect(() => {
        const loadData = async () => {
            await fetchProductList()
            const storedToken = localStorage.getItem("token")
            if (storedToken) {
                setToken(storedToken)
                await loadCartData(storedToken)
            }
        }
        loadData()
    }, [])

    const value = {
        cartItems,
        setCartItems,
        products,
        token,
        setToken,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        clearCart,
        user,
        setUser,
        url,
    }

    return (
        <ShopContext.Provider value={value}>
            {children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider