import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


export const adminLogin = async(req, res) => {
    try {
        const {email, password} = req.body;


        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'البريد الإلكتروني وكلمة المرور مطلوبان' 
            })
        }
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({success:false, message:'user not found'});
        if(!user.isAdmin) return res.status(403).json({success:false, message:'Not an admin'});
        
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({success:false, message:'invalid Credintals'});

        const token = jwt.sign(
    { id: user._id, email: user.email, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
    )
        res.json({ success: true, token , user:{email:user.email, name:user.name}})
    } catch (error) {
        console.error(error.message)
        res.status(500).json({success:false, message:error.message})
    }
}