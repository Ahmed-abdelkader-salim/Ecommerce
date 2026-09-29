import express from "express";
import {
    addToCart,
    removeFromCart,
    clearCart,
    getCart,
    updateCart,
} from '../controllers/cartController.js'
import { protect } from '../middleware/authMiddleware.js'

const cartRouter = express.Router();

cartRouter.post('/add', protect, addToCart)
cartRouter.post('/remove', protect, removeFromCart)
cartRouter.post('/clear', protect, clearCart)
cartRouter.get('/get', protect, getCart)
cartRouter.post('/update', protect, updateCart)



export default cartRouter;