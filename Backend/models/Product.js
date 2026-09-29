import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'اسم المنتج مطلوب'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'وصف المنتج مطلوب'],
    },
    price: {
        type: Number,
        required: [true, 'سعر المنتج مطلوب'],
        min: 0,
    },
    oldPrice: {
        type: Number,
        default: 0,
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    image: {
        type: String,
        required: true,
    },
    cloudinary_id: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['Men', 'Women', 'Kids', 'Electronics', 'Cosmetics'],
    },
    inStock: {
        type: Boolean,
        default: true,
    },
    rating: {
        type: Number,
        default: 0,
    },
    reviews: {
        type: Number,
        default: 0,
    },
}, { timestamps: true })

const Product = mongoose.models.Product || mongoose.model('Product', productSchema)

export default Product