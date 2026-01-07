// Helper functions để emit socket events từ controllers

/**
 * Emit event khi có món ăn mới được tạo
 */
const emitMonAnCreated = (io, monAnData) => {
    io.emit('mon_an_created', {
        message: 'Có món ăn mới được thêm!',
        data: monAnData,
        timestamp: new Date()
    });
};

/**
 * Emit event khi món ăn được cập nhật
 */
const emitMonAnUpdated = (io, monAnData) => {
    io.emit('mon_an_updated', {
        message: 'Món ăn đã được cập nhật',
        data: monAnData,
        timestamp: new Date()
    });
};

/**
 * Emit event khi món ăn bị xóa
 */
const emitMonAnDeleted = (io, monAnId) => {
    io.emit('mon_an_deleted', {
        message: 'Món ăn đã bị xóa',
        data: { id: monAnId },
        timestamp: new Date()
    });
};

/**
 * Emit event khi có món yêu thích mới
 */
const emitMonYeuThichAdded = (io, monYeuThichData) => {
    io.emit('mon_yeu_thich_added', {
        message: 'Có người dùng mới yêu thích món ăn',
        data: monYeuThichData,
        timestamp: new Date()
    });
};

/**
 * Emit event khi món yêu thích bị xóa
 */
const emitMonYeuThichDeleted = (io, monYeuThichId) => {
    io.emit('mon_yeu_thich_deleted', {
        message: 'Món yêu thích đã bị xóa',
        data: { id: monYeuThichId },
        timestamp: new Date()
    });
};

/**
 * Gửi thông báo đến một user cụ thể
 */
const emitToUser = (io, userId, event, data) => {
    io.to(`user_${userId}`).emit(event, data);
};

/**
 * Gửi thông báo đến tất cả admin
 */
const emitToAdmins = (io, event, data) => {
    io.to('admin_room').emit(event, data);
};

module.exports = {
    emitMonAnCreated,
    emitMonAnUpdated,
    emitMonAnDeleted,
    emitMonYeuThichAdded,
    emitMonYeuThichDeleted,
    emitToUser,
    emitToAdmins
};

