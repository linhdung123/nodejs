const NguoiDung = require('../Models/NguoiDung');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../Middleware/auth.middleware');

// Lấy tất cả người dùng
const getAllNguoiDung = async (req, res) => {
    try {
        const nguoiDungs = await NguoiDung.find().select('-matKhau');
        res.status(200).json({
            success: true,
            data: nguoiDungs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách người dùng',
            error: error.message
        });
    }
};

// Lấy người dùng theo ID
const getNguoiDungById = async (req, res) => {
    try {
        const userId = req.userId;
        const vaiTro = req.user.vaiTro;
        const requestedId = req.params.id;

        // User chỉ có thể xem chính mình, admin có thể xem tất cả
        if (requestedId !== userId && vaiTro !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Bạn chỉ có thể xem thông tin của chính mình'
            });
        }

        const nguoiDung = await NguoiDung.findById(requestedId).select('-matKhau');
        if (!nguoiDung) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }
        res.status(200).json({
            success: true,
            data: nguoiDung
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin người dùng',
            error: error.message
        });
    }
};

// Tạo người dùng mới (Đăng ký)
const createNguoiDung = async (req, res) => {
    try {
        const { tenDangNhap, email, matKhau, vaiTro } = req.body;
        
        if (!tenDangNhap || !email || !matKhau) {
            return res.status(400).json({
                success: false,
                message: 'Tên đăng nhập, email và mật khẩu là bắt buộc'
            });
        }

        // Kiểm tra email hoặc tên đăng nhập đã tồn tại
        const existingUser = await NguoiDung.findOne({
            $or: [{ email }, { tenDangNhap }]
        });
        
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email hoặc tên đăng nhập đã tồn tại'
            });
        }

        // Hash mật khẩu
        const hashedPassword = await bcrypt.hash(matKhau, 10);

        const nguoiDung = new NguoiDung({
            tenDangNhap,
            email,
            matKhau: hashedPassword,
            vaiTro: vaiTro || 'user'
        });

        await nguoiDung.save();
        const nguoiDungResponse = nguoiDung.toObject();
        delete nguoiDungResponse.matKhau;

        // Tạo JWT token
        const token = jwt.sign(
            { userId: nguoiDung._id, vaiTro: nguoiDung.vaiTro },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'Tạo người dùng thành công',
            data: nguoiDungResponse,
            token: token
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tạo người dùng',
            error: error.message
        });
    }
};

// Cập nhật người dùng
const updateNguoiDung = async (req, res) => {
    try {
        const { tenDangNhap, email, matKhau, vaiTro, trangThai } = req.body;
        const updateData = {};
        
        if (tenDangNhap) updateData.tenDangNhap = tenDangNhap;
        if (email) updateData.email = email;
        if (matKhau) {
            // Hash mật khẩu mới nếu có
            updateData.matKhau = await bcrypt.hash(matKhau, 10);
        }
        if (vaiTro) updateData.vaiTro = vaiTro;
        if (trangThai !== undefined) updateData.trangThai = trangThai;

        const nguoiDung = await NguoiDung.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).select('-matKhau');

        if (!nguoiDung) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Cập nhật người dùng thành công',
            data: nguoiDung
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật người dùng',
            error: error.message
        });
    }
};

// Xóa người dùng
const deleteNguoiDung = async (req, res) => {
    try {
        const nguoiDung = await NguoiDung.findByIdAndDelete(req.params.id);
        
        if (!nguoiDung) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Xóa người dùng thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa người dùng',
            error: error.message
        });
    }
};

// Đăng nhập
const login = async (req, res) => {
    try {
        const { tenDangNhap, matKhau } = req.body;
        
        if (!tenDangNhap || !matKhau) {
            return res.status(400).json({
                success: false,
                message: 'Tên đăng nhập và mật khẩu là bắt buộc'
            });
        }

        const nguoiDung = await NguoiDung.findOne({ tenDangNhap });
        
        if (!nguoiDung) {
            return res.status(401).json({
                success: false,
                message: 'Tên đăng nhập hoặc mật khẩu không đúng'
            });
        }

        // Kiểm tra trạng thái tài khoản
        if (nguoiDung.trangThai !== 'active') {
            return res.status(401).json({
                success: false,
                message: 'Tài khoản đã bị khóa'
            });
        }

        // So sánh mật khẩu với bcrypt
        const isPasswordValid = await bcrypt.compare(matKhau, nguoiDung.matKhau);
        
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Tên đăng nhập hoặc mật khẩu không đúng'
            });
        }

        // Tạo JWT token
        const token = jwt.sign(
            { userId: nguoiDung._id, vaiTro: nguoiDung.vaiTro },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        const nguoiDungResponse = nguoiDung.toObject();
        delete nguoiDungResponse.matKhau;

        res.status(200).json({
            success: true,
            message: 'Đăng nhập thành công',
            data: nguoiDungResponse,
            token: token
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi đăng nhập',
            error: error.message
        });
    }
};

module.exports = {
    getAllNguoiDung,
    getNguoiDungById,
    createNguoiDung,
    updateNguoiDung,
    deleteNguoiDung,
    login
};

