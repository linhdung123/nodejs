const jwt = require('jsonwebtoken');
const NguoiDung = require('../Models/NguoiDung');
const { JWT_SECRET } = require('./auth.middleware');

// Middleware xác thực Socket.IO
const authenticateSocket = async (socket, next) => {
    try {
        // Lấy token từ query hoặc auth object
        const token = socket.handshake.auth?.token || 
                     socket.handshake.query?.token ||
                     socket.handshake.headers?.authorization?.split(' ')[1];

        if (!token) {
            return next(new Error('Không có token xác thực'));
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Tìm người dùng
        const nguoiDung = await NguoiDung.findById(decoded.userId).select('-matKhau');
        
        if (!nguoiDung) {
            return next(new Error('Người dùng không tồn tại'));
        }

        if (nguoiDung.trangThai !== 'active') {
            return next(new Error('Tài khoản đã bị khóa'));
        }

        // Lưu thông tin người dùng vào socket
        socket.userId = nguoiDung._id.toString();
        socket.userRole = nguoiDung.vaiTro;
        socket.userName = nguoiDung.tenDangNhap;
        
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return next(new Error('Token không hợp lệ'));
        }
        if (error.name === 'TokenExpiredError') {
            return next(new Error('Token đã hết hạn'));
        }
        return next(new Error('Lỗi xác thực: ' + error.message));
    }
};

module.exports = {
    authenticateSocket
};

