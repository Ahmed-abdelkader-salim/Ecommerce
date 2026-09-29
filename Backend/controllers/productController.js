import Product from "../models/Product.js";
import cloudinary from '../config/cloudinary.js'


export const createProduct = async(req, res) => {
    try {
        const { name, description, price, oldPrice, discount, category } = req.body

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'الصورة مطلوبة' })
        }

        const product = await Product.create({
            name,
            description,
            price,
            oldPrice: oldPrice || 0,
            discount: discount || 0,
            category,
            image: req.file.path,           // Cloudinary URL
            cloudinary_id: req.file.filename, // Cloudinary public_id
        })

        res.status(201).json({
            success: true,
            message: 'تم إضافة المنتج بنجاح',
            product,
        })

    } catch (err) {
        console.log(err)
        res.json({ success: false, message: err.message })
    }
};


export const listProducts = async(req, res) => {
    try {
        const products = await Product.find({}).sort({ createdAt: -1 })
        res.json({ success: true, data: products })
    } catch (err) {
        console.log(err)
        res.json({ success: false, message: err.message })
    }
};

export const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)

        if (!product) {
            return res.status(404).json({ success: false, message: 'المنتج غير موجود' })
        }

        res.json({ success: true, data: product })
    } catch (err) {
        console.log(err)
        res.json({ success: false, message: err.message })
    }
};


export const removeProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)

        if (!product) {
            return res.status(404).json({ success: false, message: 'المنتج غير موجود' })
        }

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(product.cloudinary_id)

        await product.deleteOne()

        res.json({ success: true, message: 'تم حذف المنتج بنجاح' })
    } catch (err) {
        console.log(err)
        res.json({ success: false, message: err.message })
    }
}

export const updateProduct = async (req, res) => {
    try {
        const { name, description, price, oldPrice, discount, category, inStock } = req.body

        const product = await Product.findById(req.params.id)
        if (!product) {
            return res.status(404).json({ success: false, message: 'المنتج غير موجود' })
        }

        // لو فيه صورة جديدة
        if (req.file) {
            // Delete old image from Cloudinary
            await cloudinary.uploader.destroy(product.cloudinary_id)
            product.image = req.file.path
            product.cloudinary_id = req.file.filename
        }

        if (name) product.name = name
        if (description) product.description = description
        if (price) product.price = price
        if (oldPrice) product.oldPrice = oldPrice
        if (discount) product.discount = discount
        if (category) product.category = category
        if (inStock !== undefined) product.inStock = inStock

        await product.save()

        res.json({ success: true, message: 'تم تحديث المنتج بنجاح', product })
    } catch (err) {
        console.log(err)
        res.json({ success: false, message: err.message })
    }
};