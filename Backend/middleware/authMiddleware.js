import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "غير مصرح لك، يجب تسجيل الدخول",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "المستخدم غير موجود",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "الحساب غير مفعل",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Protect middleware error:", error);

    return res.status(401).json({
      success: false,
      message: "التوكن غير صالح أو منتهي الصلاحية",
    });
  }
};