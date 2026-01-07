const ChuDe = require('../Models/ChuDe');

// Lấy tất cả chủ đề
const getAllChuDe = async (req, res) => {
    try {
        const chuDes = await ChuDe.find().sort({ ngayTao: -1 });
        res.status(200).json({
            success: true,
            data: chuDes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách chủ đề',
            error: error.message
        });
    }
};

// Lấy chủ đề theo ID
const getChuDeById = async (req, res) => {
    try {
        const chuDe = await ChuDe.findById(req.params.id);
        if (!chuDe) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy chủ đề'
            });
        }
        res.status(200).json({
            success: true,
            data: chuDe
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin chủ đề',
            error: error.message
        });
    }
};

// Tạo chủ đề mới
const createChuDe = async (req, res) => {
    try {
        const { tenChuDe, moTa } = req.body;
        
        if (!tenChuDe) {
            return res.status(400).json({
                success: false,
                message: 'Tên chủ đề là bắt buộc'
            });
        }

        const chuDe = new ChuDe({
            tenChuDe,
            moTa
        });

        await chuDe.save();

        res.status(201).json({
            success: true,
            message: 'Tạo chủ đề thành công',
            data: chuDe
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tạo chủ đề',
            error: error.message
        });
    }
};

// Cập nhật chủ đề
const updateChuDe = async (req, res) => {
    try {
        const { tenChuDe, moTa } = req.body;
        const updateData = {};
        
        if (tenChuDe) updateData.tenChuDe = tenChuDe;
        if (moTa !== undefined) updateData.moTa = moTa;

        const chuDe = await ChuDe.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!chuDe) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy chủ đề'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Cập nhật chủ đề thành công',
            data: chuDe
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật chủ đề',
            error: error.message
        });
    }
};

// Xóa chủ đề
const deleteChuDe = async (req, res) => {
    try {
        const chuDe = await ChuDe.findByIdAndDelete(req.params.id);
        
        if (!chuDe) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy chủ đề'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Xóa chủ đề thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa chủ đề',
            error: error.message
        });
    }
};

module.exports = {
    getAllChuDe,
    getChuDeById,
    createChuDe,
    updateChuDe,
    deleteChuDe
};

