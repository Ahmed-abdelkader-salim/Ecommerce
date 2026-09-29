import express from 'express'
import {
    listProducts,
    getProduct,
    removeProduct,
    updateProduct,
    createProduct,
} from '../controllers/productController.js'
import { protect } from '../middleware/authMiddleware.js'
import { adminOnly } from '../middleware/adminMiddleware.js'
import { upload } from '../config/cloudinary.js'

const productRouter = express.Router()

productRouter.post('/add', protect, adminOnly, upload.single('image'), createProduct)
productRouter.get('/list', listProducts)
productRouter.get('/:id', getProduct)
productRouter.delete('/:id', protect, adminOnly, removeProduct)
productRouter.put('/:id', protect, adminOnly, upload.single('image'), updateProduct)

export default productRouter