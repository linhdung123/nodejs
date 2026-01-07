const MonAn = require('../Models/MonAn');
const ChuDe = require('../Models/ChuDe');
const NguoiDung = require('../Models/NguoiDung');

// Lấy tất cả món ăn
const getAllMonAn = async (req, res) => {
    try {
        const { chuDeId, nguoiTao, trangThai } = req.query;
        const filter = {};
        
        if (chuDeId) filter.chuDeId = chuDeId;
        if (nguoiTao) filter.nguoiTao = nguoiTao;
        if (trangThai) filter.trangThai = trangThai;

        const monAns = await MonAn.find(filter)
            .populate('chuDeId', 'tenChuDe moTa')
            .populate('nguoiTao', 'tenDangNhap email vaiTro')
            .sort({ ngayTao: -1 });

        res.status(200).json({
            success: true,
            data: monAns
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách món ăn',
            error: error.message
        });
    }
};

// Lấy món ăn theo ID
const getMonAnById = async (req, res) => {
    try {
        const monAn = await MonAn.findById(req.params.id)
            .populate('chuDeId', 'tenChuDe moTa')
            .populate('nguoiTao', 'tenDangNhap email vaiTro');

        if (!monAn) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy món ăn'
            });
        }

        res.status(200).json({
            success: true,
            data: monAn
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin món ăn',
            error: error.message
        });
    }
};

// Tạo món ăn mới
const createMonAn = async (req, res) => {
    try {
        const { tenMon, moTa, hinhAnh, videoHuongDan, chuDeId, nguyenLieu, huongDan, trangThai } = req.body;
        const nguoiTao = req.userId; // Lấy từ middleware authenticate
        
        if (!tenMon || !chuDeId) {
            return res.status(400).json({
                success: false,
                message: 'Tên món và chủ đề là bắt buộc'
            });
        }

        // Kiểm tra chủ đề tồn tại
        const chuDe = await ChuDe.findById(chuDeId);
        if (!chuDe) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy chủ đề'
            });
        }

        const monAn = new MonAn({
            tenMon,
            moTa,
            hinhAnh,
            videoHuongDan,
            chuDeId,
            nguoiTao,
            nguyenLieu: nguyenLieu || [],
            huongDan: huongDan || [],
            trangThai: trangThai || 'active'
        });

        await monAn.save();
        const monAnPopulated = await MonAn.findById(monAn._id)
            .populate('chuDeId', 'tenChuDe moTa')
            .populate('nguoiTao', 'tenDangNhap email vaiTro');

        res.status(201).json({
            success: true,
            message: 'Tạo món ăn thành công',
            data: monAnPopulated
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tạo món ăn',
            error: error.message
        });
    }
};

// Cập nhật món ăn
const updateMonAn = async (req, res) => {
    try {
        const { tenMon, moTa, hinhAnh, videoHuongDan, chuDeId, nguyenLieu, huongDan, trangThai } = req.body;
        const userId = req.userId;
        const vaiTro = req.user.vaiTro;
        
        // Tìm món ăn để kiểm tra quyền
        const monAnExist = await MonAn.findById(req.params.id);
        if (!monAnExist) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy món ăn'
            });
        }

        // Kiểm tra quyền: chỉ người tạo hoặc admin mới được cập nhật
        if (monAnExist.nguoiTao.toString() !== userId && vaiTro !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Bạn chỉ có thể cập nhật món ăn của chính mình'
            });
        }

        const updateData = {};
        
        if (tenMon) updateData.tenMon = tenMon;
        if (moTa !== undefined) updateData.moTa = moTa;
        if (hinhAnh !== undefined) updateData.hinhAnh = hinhAnh;
        if (videoHuongDan !== undefined) updateData.videoHuongDan = videoHuongDan;
        if (chuDeId) {
            const chuDe = await ChuDe.findById(chuDeId);
            if (!chuDe) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy chủ đề'
                });
            }
            updateData.chuDeId = chuDeId;
        }
        if (nguyenLieu) updateData.nguyenLieu = nguyenLieu;
        if (huongDan) updateData.huongDan = huongDan;
        if (trangThai !== undefined) updateData.trangThai = trangThai;

        const monAn = await MonAn.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        )
        .populate('chuDeId', 'tenChuDe moTa')
        .populate('nguoiTao', 'tenDangNhap email vaiTro');

        res.status(200).json({
            success: true,
            message: 'Cập nhật món ăn thành công',
            data: monAn
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật món ăn',
            error: error.message
        });
    }
};

// Xóa món ăn
const deleteMonAn = async (req, res) => {
    try {
        const userId = req.userId;
        const vaiTro = req.user.vaiTro;
        
        const monAn = await MonAn.findById(req.params.id);
        
        if (!monAn) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy món ăn'
            });
        }

        // Kiểm tra quyền: chỉ người tạo hoặc admin mới được xóa
        if (monAn.nguoiTao.toString() !== userId && vaiTro !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Bạn chỉ có thể xóa món ăn của chính mình'
            });
        }

        await MonAn.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Xóa món ăn thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa món ăn',
            error: error.message
        });
    }
};

module.exports = {
    getAllMonAn,
    getMonAnById,
    createMonAn,
    updateMonAn,
    deleteMonAn
};

