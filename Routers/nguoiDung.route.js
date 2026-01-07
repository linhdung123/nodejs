const express = require('express');
const router = express.Router();
const {
    getAllNguoiDung,
    getNguoiDungById,
    createNguoiDung,
    updateNguoiDung,
    deleteNguoiDung,
    login
} = require('../Controllers/nguoiDung.controller');
const { authenticate, isAdmin, isOwnerOrAdmin } = require('../Middleware/auth.middleware');

// Đăng nhập (public)
router.post('/login', login);

// Đăng ký (public)
router.post('/register', createNguoiDung);

// Lấy tất cả người dùng (chỉ admin)
router.get('/', authenticate, isAdmin, getAllNguoiDung);

// Lấy người dùng theo ID (user có thể xem chính mình, admin xem tất cả)
router.get('/:id', authenticate, getNguoiDungById);

// Cập nhật người dùng (chỉ chính mình hoặc admin)
router.put('/:id', authenticate, isOwnerOrAdmin, updateNguoiDung);

// Xóa người dùng (chỉ admin)
router.delete('/:id', authenticate, isAdmin, deleteNguoiDung);

module.exports = router;

