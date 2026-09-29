import User from "../models/User.js";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";



// Generate JWT Token

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn:'30d',
    })
};



// login user
export const loginUser = async(req, res) => {
    try {
        const {email, password} = req.body;

        // validation
        if(!email || !password) {
            return res.status(400).json({success:false, message:'البريد الإلكتروني وكلمة المرور مطلوبان'})
        }


        // find user

        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({ success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' })
        }


        // Check if account is active
        if (!user.isActive) {
            return res.status(403).json({ success: false, message: 'تم تعطيل هذا الحساب' })
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' })
        }

        // Update last login
        user.lastLogin = new Date()
        await user.save()

        const token = generateToken(user._id)

        res.status(200).json({
            success: true,
            message: 'تم تسجيل الدخول بنجاح',
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                avatar: user.avatar,
            }
        })
    } catch (error) {
        console.error('Login Error:', error)
        res.status(500).json({ success: false, message: error.message })
    }
};


// register user
export const registerUser = async(req, res) => {
    try {

        console.log("========== REGISTER ==========");
        console.log("Method:", req.method);
        console.log("URL:", req.originalUrl);
        console.log("Content-Type:", req.headers["content-type"]);
        console.log("Body:", req.body);
        console.log("==============================");
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'جميع الحقول مطلوبة' })
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: 'البريد الإلكتروني غير صالح' })
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' })
        }

        // Check if user exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'البريد الإلكتروني مستخدم بالفعل' })
        }

        const salt = await bcrypt.genSalt(12)
        const hashedPassword = await bcrypt.hash(password, salt)
        // Create user
        const user = await User.create({ name, email, password:hashedPassword })

        const token = generateToken(user._id)

        res.status(201).json({
            success: true,
            message: 'تم إنشاء الحساب بنجاح',
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                avatar: user.avatar,
            }
        })

    } catch (error) {
        console.error('Register Error:', error)
        res.status(500).json({ success: false, message: error.message })
    }
}


export const getAllUsers = async(req, res) => {
    try{
        const users = await User.find().select('-password');
        res.status(200).json({success:true, data:users})
    }catch(error){
        console.error('Get All Users Error:', error)
        res.status(500).json({success:false, message:error.message})
    }
}


export const deleteUser = async(req, res) => {
    try{
        const {id} = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        if(!deletedUser){
            return res.status(404).json({success:false, message:'User not found'})
        }
        res.status(200).json({success:true, message:'User deleted successfully'})
    }catch(error){
        console.error('Delete User Error:', error)
        res.status(500).json({success:false, message:error.message})
    }
}


export const makeAdmin = async(req, res) => {
    try{
        const {id} = req.params;
        const updatedUser = await User.findByIdAndUpdate(id, {isAdmin:true}, {new:true});
        if(!updatedUser){
            return res.status(404).json({success:false, message:'User not found'})
        }
        res.status(200).json({success:true, message:'User is now an admin', data:updatedUser})
    }catch(error){
        console.error('Make Admin Error:', error)
        res.status(500).json({success:false, message:error.message})
    }
}



export const demoteToUser = async(req, res) => {
    try{
        const {id} = req.params;
        const user = await User.findById(id);
        if(!user){
            return res.status(404).json({success:false, message:'User not found'})
        }
        if(!user.isAdmin){
            return res.status(400).json({success:false, message:'User is not an admin'})
        }
        user.isAdmin = false;
        await user.save();
        res.status(200).json({success:true, message:'User is no longer an admin', user})
    }catch(error){
        console.error('Demote to User Error:', error)
        res.status(500).json({success:false, message:error.message})
    }
}