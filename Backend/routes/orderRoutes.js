import express from 'express'
import {
    placeOrder,
    verifyOrder,
    userOrders,
    listOrders,
    updateOrderStatus,
} from '../controllers/orderController.js'
import { protect } from '../middleware/authMiddleware.js'
import { adminOnly } from '../middleware/adminMiddleware.js'

const router = express.Router()

// User routes
router.post('/place', protect, placeOrder)
router.post('/verify', protect, verifyOrder)
router.get('/user', protect, userOrders)

// Admin routes
router.get('/list', protect, adminOnly, listOrders)
router.put('/status', protect, adminOnly, updateOrderStatus)

export default router