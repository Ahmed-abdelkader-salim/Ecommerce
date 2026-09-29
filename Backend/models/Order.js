// models/Order.js
import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [
        {
            _id: { type: String, required: true },
            name: { type: String, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
            category: { type: String },
        }
    ],
    address: {
        name: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        phone: { type: String, required: true },
    },
    amount: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ['stripe', 'cod'],
        required: true,
        default: 'cod',
    },
    payment: {
        type: Boolean,
        default: false,
    },
    orderStatus: {
        type: String,
        enum: ['Order Placed', 'Packing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
        default: 'Order Placed',
    },
    stripeSessionId: {
        type: String,
        default: '',
    },
    date: {
        type: Number,
        default: Date.now,
    }
}, { timestamps: true, minimize: false })

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema)

export default Order;