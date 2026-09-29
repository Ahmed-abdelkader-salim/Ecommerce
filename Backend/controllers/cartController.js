import User from "../models/User.js";


export const addToCart = async (req, res) => {
    try {
        const userId = req.user._id
        const { itemId } = req.body

        const userData = await User.findById(userId)
        if (!userData) {
            return res.status(404).json({ success: false, message: "User Not Found" })
        }

        let cartData = userData.cartData || {}

        if (!cartData[itemId]) {
            cartData[itemId] = 1
        } else {
            cartData[itemId]++
        }

        await User.findByIdAndUpdate(userId, { cartData })

        res.json({ success: true, message: "تمت الإضافة للسلة" })

    } catch (err) {
        console.log(err)
        res.json({ success: false, message: err.message })
    }
}


export const removeFromCart = async (req, res) => {
    try {
        const userId = req.user._id
        const { itemId } = req.body

        const userData = await User.findById(userId)
        if (!userData) {
            return res.status(404).json({ success: false, message: "User Not Found" })
        }

        let cartData = userData.cartData || {}

        if (cartData[itemId]) {
            if (cartData[itemId] === 1) {
                delete cartData[itemId]
            } else {
                cartData[itemId]--
            }
        }

        await User.findByIdAndUpdate(userId, { cartData })
        res.json({ success: true, message: "تمت إزالة المنتج" })

    } catch (err) {
        console.log(err)
        res.json({ success: false, message: err.message })
    }
}


export const clearCart = async (req, res) => {
    try {
        const userId = req.user._id

        await User.findByIdAndUpdate(userId, { cartData: {} })
        res.json({ success: true, message: "تم مسح السلة بالكامل" })

    } catch (err) {
        console.log(err)
        res.json({ success: false, message: err.message })
    }
}

export const getCart = async (req, res) => {
    try {
        const userId = req.user._id

        const userData = await User.findById(userId).select('cartData')
        if (!userData) {
            return res.status(404).json({ success: false, message: "User Not Found" })
        }

        res.json({ success: true, cartData: userData.cartData })

    } catch (err) {
        console.log(err)
        res.json({ success: false, message: err.message })
    }
}


export const updateCart = async (req, res) => {
    try {
        const userId = req.user._id
        const { itemId, quantity } = req.body

        const userData = await User.findById(userId)
        if (!userData) {
            return res.status(404).json({ success: false, message: "User Not Found" })
        }

        let cartData = userData.cartData || {}

        if (quantity === 0) {
            delete cartData[itemId]
        } else {
            cartData[itemId] = quantity
        }

        await User.findByIdAndUpdate(userId, { cartData })

        res.json({ success: true, message: "تم تحديث السلة" })

    } catch (err) {
        console.log(err)
        res.json({ success: false, message: err.message })
    }
}