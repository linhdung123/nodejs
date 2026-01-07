const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect("mongodb://localhost:27017/congthucnauan", {
            // Các options để đảm bảo kết nối ổn định
            // Mongoose sẽ tự động tạo database và collections khi cần
        });

        console.log("✅ Kết nối database thành công!");
        console.log("📊 Database: congthucnauan");
        console.log("💡 Collections sẽ được tạo tự động khi có dữ liệu đầu tiên");
    }
    catch (err) {
        console.error("❌ Lỗi kết nối database:", err);
        process.exit(1); // Thoát ứng dụng nếu không kết nối được
    };
};

module.exports = { connect };