const http = require("http");
const db = require("./Config/data");
const mongoose = require("mongoose");
const express = require('express');
const { Server } = require('socket.io');
const test = require('./Routers/test.route');
const nguoiDungRoute = require('./Routers/nguoiDung.route');
const chuDeRoute = require('./Routers/chuDe.route');
const monAnRoute = require('./Routers/monAn.route');
const monYeuThichRoute = require('./Routers/monYeuThich.route');
const { authenticateSocket } = require('./Middleware/socket.middleware');

const app = express();
app.use(express.json());

// Routes
app.use('/api', test);
app.use('/api/nguoidung', nguoiDungRoute);
app.use('/api/chude', chuDeRoute);
app.use('/api/monan', monAnRoute);
app.use('/api/monyeuthich', monYeuThichRoute);

// Tạo HTTP server từ Express app
const server = http.createServer(app);

// Khởi tạo Socket.IO
const io = new Server(server, {
    cors: {
        origin: "*", // Cho phép tất cả origins (có thể cấu hình cụ thể hơn)
        methods: ["GET", "POST"]
    }
});

// Socket.IO middleware để xác thực
io.use(authenticateSocket);

// Xử lý kết nối Socket
io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.userId} (${socket.userRole})`);

    // Join room theo userId để gửi message riêng
    socket.join(`user_${socket.userId}`);

    // Join room admin nếu là admin
    if (socket.userRole === 'admin') {
        socket.join('admin_room');
    }

    // Event: Thông báo món ăn mới (chỉ admin mới có thể emit)
    socket.on('new_mon_an', async (data) => {
        if (socket.userRole === 'admin') {
            // Broadcast đến tất cả users
            io.emit('mon_an_created', {
                message: 'Có món ăn mới được thêm!',
                data: data
            });
        }
    });

    // Event: Thông báo món ăn được cập nhật
    socket.on('update_mon_an', (data) => {
        io.emit('mon_an_updated', {
            message: 'Món ăn đã được cập nhật',
            data: data
        });
    });

    // Event: Thông báo món ăn bị xóa
    socket.on('delete_mon_an', (data) => {
        io.emit('mon_an_deleted', {
            message: 'Món ăn đã bị xóa',
            data: data
        });
    });

    // Event: Thông báo món yêu thích mới
    socket.on('new_mon_yeu_thich', (data) => {
        // Gửi thông báo đến tất cả users
        io.emit('mon_yeu_thich_added', {
            message: 'Có người dùng mới yêu thích món ăn',
            data: data
        });
    });

    // Event: Chat message (ví dụ)
    socket.on('chat_message', (data) => {
        // Broadcast message đến tất cả users
        io.emit('chat_message', {
            userId: socket.userId,
            userName: socket.userName,
            message: data.message,
            timestamp: new Date()
        });
    });

    // Event: Typing indicator
    socket.on('typing', (data) => {
        socket.broadcast.emit('user_typing', {
            userId: socket.userId,
            userName: socket.userName,
            isTyping: data.isTyping
        });
    });

    // Event: Disconnect
    socket.on('disconnect', () => {
        console.log(`❌ User disconnected: ${socket.userId}`);
    });
});

// Export io để sử dụng trong controllers nếu cần
app.set('io', io);

server.listen(8080, () => {
    console.log("✅ Server đang chạy tại http://localhost:8080");
    console.log("✅ Socket.IO đã sẵn sàng tại ws://localhost:8080");
});

db.connect();
