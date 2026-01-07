const express = require('express');
const router = express.Router();
const {
    getAllMonAn,
    getMonAnById,
    createMonAn,
    updateMonAn,
    deleteMonAn
} = require('../Controllers/monAn.controller');
const { authenticate, isUserOrAdmin } = require('../Middleware/auth.middleware');

// Lấy tất cả món ăn (public - có thể filter theo chuDeId, nguoiTao, trangThai)
// GET /api/monan?chuDeId=xxx&nguoiTao=yyy&trangThai=active
router.get('/', getAllMonAn);

// Lấy món ăn theo ID (public)
router.get('/:id', getMonAnById);

// Tạo món ăn mới (cần đăng nhập)
router.post('/', authenticate, isUserOrAdmin, createMonAn);

// Cập nhật món ăn (chỉ người tạo hoặc admin)
router.put('/:id', authenticate, isUserOrAdmin, updateMonAn);

// Xóa món ăn (chỉ người tạo hoặc admin)
router.delete('/:id', authenticate, isUserOrAdmin, deleteMonAn);

module.exports = router;

