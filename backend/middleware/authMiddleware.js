const jwt = require('jsonwebtoken')
const User = require('../models/UserModel')

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith("Bearer")) {
        try {
            let token = authHeader.split(" ")[1];
            const decoded = jwt.verify(token, process.env.COOKIE_SECRET);
            req.user = await User.findById(decoded.id).select("-password")
            next();
        } catch (error) {
            res.status(401).json({
                message: "Session expired. Please login again.",
                success: false,
            });
        }
    } else {
        res.status(401).json({
            message: "Session expired. Please login again.",
            success: false,
        });
    }
};

module.exports = authMiddleware