const express = require('express');
const router = express.Router();
const {
    getAllChuDe,
    getChuDeById,
    createChuDe,
    updateChuDe,
    deleteChuDe
} = require('../Controllers/chuDe.controller');
const { authenticate, isAdmin } = require('../Middleware/auth.middleware');

// Lấy tất cả chủ đề (public)
router.get('/', getAllChuDe);

// Lấy chủ đề theo ID (public)
router.get('/:id', getChuDeById);

// Tạo chủ đề mới (chỉ admin)
router.post('/', authenticate, isAdmin, createChuDe);

// Cập nhật chủ đề (chỉ admin)
router.put('/:id', authenticate, isAdmin, updateChuDe);

// Xóa chủ đề (chỉ admin)
router.delete('/:id', authenticate, isAdmin, deleteChuDe);

module.exports = router;

