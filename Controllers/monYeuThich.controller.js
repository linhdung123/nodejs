const MonYeuThich = require('../Models/MonYeuThich');
const MonAn = require('../Models/MonAn');
const NguoiDung = require('../Models/NguoiDung');

// Lấy tất cả món yêu thích của một người dùng
const getMonYeuThichByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Kiểm tra người dùng tồn tại
        const nguoiDung = await NguoiDung.findById(userId);
        if (!nguoiDung) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }

        const monYeuThichs = await MonYeuThich.find({ nguoiDungId: userId })
            .populate('monAnId')
            .populate('nguoiDungId', 'tenDangNhap email')
            .sort({ ngayLuu: -1 });

        res.status(200).json({
            success: true,
            data: monYeuThichs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách món yêu thích',
            error: error.message
        });
    }
};

// Thêm món ăn vào danh sách yêu thích
const addMonYeuThich = async (req, res) => {
    try {
        const { monAnId } = req.body;
        const nguoiDungId = req.userId; // Lấy từ middleware authenticate
        
        if (!monAnId) {
            return res.status(400).json({
                success: false,
                message: 'ID món ăn là bắt buộc'
            });
        }

        // Kiểm tra món ăn tồn tại
        const monAn = await MonAn.findById(monAnId);
        if (!monAn) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy món ăn'
            });
        }

        // Kiểm tra đã yêu thích chưa
        const existing = await MonYeuThich.findOne({ nguoiDungId, monAnId });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'Món ăn đã có trong danh sách yêu thích'
            });
        }

        const monYeuThich = new MonYeuThich({
            nguoiDungId,
            monAnId
        });

        await monYeuThich.save();
        const monYeuThichPopulated = await MonYeuThich.findById(monYeuThich._id)
            .populate('monAnId')
            .populate('nguoiDungId', 'tenDangNhap email');

        res.status(201).json({
            success: true,
            message: 'Thêm món yêu thích thành công',
            data: monYeuThichPopulated
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi thêm món yêu thích',
            error: error.message
        });
    }
};

// Xóa món ăn khỏi danh sách yêu thích
const deleteMonYeuThich = async (req, res) => {
    try {
        const { id } = req.params;
        
        const monYeuThich = await MonYeuThich.findByIdAndDelete(id);
        
        if (!monYeuThich) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy món yêu thích'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Xóa món yêu thích thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa món yêu thích',
            error: error.message
        });
    }
};

// Xóa món yêu thích theo userId và monAnId
const deleteMonYeuThichByUserAndMon = async (req, res) => {
    try {
        const { userId, monAnId } = req.params;
        
        const monYeuThich = await MonYeuThich.findOneAndDelete({
            nguoiDungId: userId,
            monAnId: monAnId
        });
        
        if (!monYeuThich) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy món yêu thích'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Xóa món yêu thích thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa món yêu thích',
            error: error.message
        });
    }
};

// Kiểm tra món ăn đã được yêu thích chưa
const checkMonYeuThich = async (req, res) => {
    try {
        const { userId, monAnId } = req.params;
        
        const monYeuThich = await MonYeuThich.findOne({
            nguoiDungId: userId,
            monAnId: monAnId
        });

        res.status(200).json({
            success: true,
            isFavorite: !!monYeuThich,
            data: monYeuThich
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi kiểm tra món yêu thích',
            error: error.message
        });
    }
};

module.exports = {
    getMonYeuThichByUserId,
    addMonYeuThich,
    deleteMonYeuThich,
    deleteMonYeuThichByUserAndMon,
    checkMonYeuThich
};

