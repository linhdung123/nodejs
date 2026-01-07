const express = require('express');
const router = express.Router();
const {
    getMonYeuThichByUserId,
    addMonYeuThich,
    deleteMonYeuThich,
    deleteMonYeuThichByUserAndMon,
    checkMonYeuThich
} = require('../Controllers/monYeuThich.controller');
const { authenticate, isUserOrAdmin, isOwnerOrAdmin } = require('../Middleware/auth.middleware');

// Lấy tất cả món yêu thích của một người dùng (chỉ chính mình hoặc admin)
router.get('/user/:userId', authenticate, isOwnerOrAdmin, getMonYeuThichByUserId);

// Kiểm tra món ăn đã được yêu thích chưa (chỉ chính mình hoặc admin)
router.get('/check/:userId/:monAnId', authenticate, isOwnerOrAdmin, checkMonYeuThich);

// Thêm món ăn vào danh sách yêu thích (cần đăng nhập)
router.post('/', authenticate, isUserOrAdmin, addMonYeuThich);

// Xóa món yêu thích theo ID (cần đăng nhập)
router.delete('/:id', authenticate, isUserOrAdmin, deleteMonYeuThich);

// Xóa món yêu thích theo userId và monAnId (chỉ chính mình hoặc admin)
router.delete('/user/:userId/mon/:monAnId', authenticate, isOwnerOrAdmin, deleteMonYeuThichByUserAndMon);

module.exports = router;

