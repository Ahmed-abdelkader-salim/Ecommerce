// models/User.js
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    isAdmin:{type:Boolean, default:false},
    avatar: {
        type: String,
        default: '',
    },
    phone: {
        type: String,
        default: '',
    },
    address: {
        street: { type: String, default: '' },
        city: { type: String, default: '' },
        country: { type: String, default: '' },
    },
    cartData: {
        type: Object,
        default: {},
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true, 
    },
    lastLogin: {
        type: Date,
        default: null,
    },
}, { timestamps: true, minimize: false })

const User = mongoose.models.User || mongoose.model('User', userSchema)

export default User