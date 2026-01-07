const jwt = require('jsonwebtoken');
const NguoiDung = require('../Models/NguoiDung');

// Secret key cho JWT (nên lưu trong biến môi trường)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware xác thực người dùng (kiểm tra token)
const authenticate = async (req, res, next) => {
    try {
        // Lấy token từ header
        const token = req.headers.authorization?.split(' ')[1] || req.headers['x-access-token'];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Không có token xác thực. Vui lòng đăng nhập.'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Tìm người dùng
        const nguoiDung = await NguoiDung.findById(decoded.userId).select('-matKhau');
        
        if (!nguoiDung) {
            return res.status(401).json({
                success: false,
                message: 'Người dùng không tồn tại'
            });
        }

        if (nguoiDung.trangThai !== 'active') {
            return res.status(401).json({
                success: false,
                message: 'Tài khoản đã bị khóa'
            });
        }

        // Lưu thông tin người dùng vào request
        req.user = nguoiDung;
        req.userId = decoded.userId;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token không hợp lệ'
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token đã hết hạn'
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Lỗi xác thực',
            error: error.message
        });
    }
};

// Middleware kiểm tra quyền Admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.vaiTro === 'admin') {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: 'Bạn không có quyền truy cập. Chỉ Admin mới được phép.'
        });
    }
};

// Middleware kiểm tra quyền User hoặc Admin
const isUserOrAdmin = (req, res, next) => {
    if (req.user && (req.user.vaiTro === 'user' || req.user.vaiTro === 'admin')) {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: 'Bạn không có quyền truy cập'
        });
    }
};

// Middleware kiểm tra người dùng có phải chủ sở hữu hoặc admin không
const isOwnerOrAdmin = async (req, res, next) => {
    try {
        const resourceId = req.params.id || req.params.userId;
        const userId = req.userId;
        const vaiTro = req.user.vaiTro;

        // Admin có quyền truy cập tất cả
        if (vaiTro === 'admin') {
            return next();
        }

        // Kiểm tra nếu là chủ sở hữu
        if (resourceId === userId) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: 'Bạn chỉ có thể thao tác với tài nguyên của chính mình'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi kiểm tra quyền',
            error: error.message
        });
    }
};

module.exports = {
    authenticate,
    isAdmin,
    isUserOrAdmin,
    isOwnerOrAdmin,
    JWT_SECRET
};

