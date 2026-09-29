export const adminOnly = async(req, res, next) => {
    if (req.user && req.user.isAdmin === true) {
        next()
    } else {
        res.status(403).json({ success: false, message: 'غير مصرح لك بالوصول' })
    }
}