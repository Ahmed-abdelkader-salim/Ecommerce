import Order from "../models/Order.js";
import User from "../models/User.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const frontendUrl = process.env.FRONTEND_URL

export const placeOrder = async (req, res) => {
    try {
        const { items, address, amount } = req.body

        const newOrder = new Order({
            userId: req.user._id,
            items,
            amount,
            address,
            paymentMethod: 'stripe',
            payment: false,
        })
        await newOrder.save()

        await User.findByIdAndUpdate(req.user._id, { cartData: {} })

        const line_items = items.map((item) => ({
            price_data: {
                currency: 'usd',
                product_data: { name: item.name },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        }))

        line_items.push({
            price_data: {
                currency: 'usd',
                product_data: { name: 'Delivery Charges' },
                unit_amount: 2 * 100,
            },
            quantity: 1,
        })

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${frontendUrl}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontendUrl}/verify?success=false&orderId=${newOrder._id}`,
        })

        res.status(200).json({ success: true, session_url: session.url })

    } catch (error) {
        console.error('Stripe Order Error:', error)
        res.status(500).json({ success: false, message: error.message })
    }
}

export const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body
    try {
        if (success === "true") {
            await Order.findByIdAndUpdate(orderId, { payment: true }) // ✅
            res.json({ success: true, message: "Paid" })
        } else {
            await Order.findByIdAndDelete(orderId)
            res.json({ success: false, message: "Not Paid" })
        }
    } catch (err) {
        console.log(err)
        res.json({ success: false, message: err.message })
    }
}

export const userOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
        res.json({ success: true, data: orders })
    } catch (err) {
        console.log(err)
        res.json({ success: false, message: err.message })
    }
}

export const listOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('userId', 'name email phone')
            .sort({ createdAt: -1 })
        res.json({ success: true, data: orders })
    } catch (err) {
        console.log(err)
        res.json({ success: false, message: err.message })
    }
}

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body
        await Order.findByIdAndUpdate(orderId, { orderStatus: status })
        res.json({ success: true, message: 'تم تحديث حالة الطلب' })
    } catch (err) {
        console.log(err)
        res.json({ success: false, message: err.message })
    }
}