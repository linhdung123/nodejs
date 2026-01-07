const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const NguoiDung = require('./Models/NguoiDung');
const ChuDe = require('./Models/ChuDe');
const MonAn = require('./Models/MonAn');
const MonYeuThich = require('./Models/MonYeuThich');

// Kết nối database
async function connectDB() {
    try {
        await mongoose.connect("mongodb://localhost:27017/congthucnauan");
        console.log("✅ Đã kết nối database");
    } catch (error) {
        console.error("❌ Lỗi kết nối database:", error);
        process.exit(1);
    }
}

// Xóa dữ liệu cũ (optional)
async function clearDatabase() {
    try {
        await NguoiDung.deleteMany({});
        await ChuDe.deleteMany({});
        await MonAn.deleteMany({});
        await MonYeuThich.deleteMany({});
        console.log("🗑️  Đã xóa dữ liệu cũ");
    } catch (error) {
        console.error("Lỗi khi xóa dữ liệu:", error);
    }
}

// Tạo dữ liệu mẫu
async function seedData() {
    try {
        console.log("🌱 Bắt đầu tạo dữ liệu mẫu...\n");

        // 1. Tạo người dùng
        console.log("👤 Đang tạo người dùng...");
        const hashedPassword = await bcrypt.hash('123456', 10);
        
        const admin = await NguoiDung.create({
            tenDangNhap: 'admin',
            email: 'admin@example.com',
            matKhau: hashedPassword,
            vaiTro: 'admin',
            trangThai: 'active'
        });

        const user1 = await NguoiDung.create({
            tenDangNhap: 'user1',
            email: 'user1@example.com',
            matKhau: hashedPassword,
            vaiTro: 'user',
            trangThai: 'active'
        });

        const user2 = await NguoiDung.create({
            tenDangNhap: 'user2',
            email: 'user2@example.com',
            matKhau: hashedPassword,
            vaiTro: 'user',
            trangThai: 'active'
        });

        console.log(`✅ Đã tạo ${await NguoiDung.countDocuments()} người dùng\n`);

        // 2. Tạo chủ đề
        console.log("📂 Đang tạo chủ đề...");
        const chuDe1 = await ChuDe.create({
            tenChuDe: 'Món Việt Nam',
            moTa: 'Các món ăn truyền thống Việt Nam'
        });

        const chuDe2 = await ChuDe.create({
            tenChuDe: 'Món Á',
            moTa: 'Các món ăn châu Á'
        });

        const chuDe3 = await ChuDe.create({
            tenChuDe: 'Món Âu',
            moTa: 'Các món ăn phương Tây'
        });

        const chuDe4 = await ChuDe.create({
            tenChuDe: 'Đồ uống',
            moTa: 'Các loại đồ uống và thức uống'
        });

        console.log(`✅ Đã tạo ${await ChuDe.countDocuments()} chủ đề\n`);

        // 3. Tạo món ăn
        console.log("🍜 Đang tạo món ăn...");
        
        const monAn1 = await MonAn.create({
            tenMon: 'Phở Bò',
            moTa: 'Món phở bò truyền thống Việt Nam với nước dùng đậm đà',
            hinhAnh: 'https://example.com/pho-bo.jpg',
            videoHuongDan: 'https://example.com/video/pho-bo.mp4',
            chuDeId: chuDe1._id,
            nguoiTao: admin._id,
            nguyenLieu: [
                { ten: 'Bánh phở', soLuong: '200g' },
                { ten: 'Thịt bò', soLuong: '150g' },
                { ten: 'Hành tây', soLuong: '1 củ' },
                { ten: 'Gừng', soLuong: '1 nhánh' },
                { ten: 'Xương bò', soLuong: '500g' },
                { ten: 'Hành lá', soLuong: '50g' },
                { ten: 'Rau thơm', soLuong: '30g' }
            ],
            huongDan: [
                {
                    buoc: 1,
                    moTa: 'Rửa sạch xương bò, cho vào nồi với nước lạnh, đun sôi và vớt bọt',
                    hinhAnh: 'https://example.com/buoc1.jpg'
                },
                {
                    buoc: 2,
                    moTa: 'Thêm hành tây, gừng đã nướng vào nồi, ninh nhỏ lửa trong 2-3 giờ',
                    hinhAnh: 'https://example.com/buoc2.jpg'
                },
                {
                    buoc: 3,
                    moTa: 'Nêm nếm gia vị cho vừa ăn, lọc nước dùng',
                    hinhAnh: 'https://example.com/buoc3.jpg'
                },
                {
                    buoc: 4,
                    moTa: 'Luộc bánh phở trong nước sôi, xếp vào tô',
                    hinhAnh: 'https://example.com/buoc4.jpg'
                },
                {
                    buoc: 5,
                    moTa: 'Xếp thịt bò lên trên, thêm hành lá, rau thơm và chan nước dùng nóng',
                    hinhAnh: 'https://example.com/buoc5.jpg'
                }
            ],
            trangThai: 'active'
        });

        const monAn2 = await MonAn.create({
            tenMon: 'Bánh Mì Thịt Nướng',
            moTa: 'Bánh mì Việt Nam với thịt nướng thơm ngon',
            hinhAnh: 'https://example.com/banh-mi.jpg',
            chuDeId: chuDe1._id,
            nguoiTao: user1._id,
            nguyenLieu: [
                { ten: 'Bánh mì', soLuong: '1 ổ' },
                { ten: 'Thịt heo', soLuong: '100g' },
                { ten: 'Pate', soLuong: '20g' },
                { ten: 'Đồ chua', soLuong: '30g' },
                { ten: 'Rau mùi', soLuong: '10g' },
                { ten: 'Ớt', soLuong: '1 quả' }
            ],
            huongDan: [
                {
                    buoc: 1,
                    moTa: 'Ướp thịt heo với gia vị trong 30 phút',
                    hinhAnh: 'https://example.com/banhmi-buoc1.jpg'
                },
                {
                    buoc: 2,
                    moTa: 'Nướng thịt trên than hoa hoặc chảo',
                    hinhAnh: 'https://example.com/banhmi-buoc2.jpg'
                },
                {
                    buoc: 3,
                    moTa: 'Cắt bánh mì, phết pate bên trong',
                    hinhAnh: 'https://example.com/banhmi-buoc3.jpg'
                },
                {
                    buoc: 4,
                    moTa: 'Xếp thịt nướng, đồ chua, rau mùi và ớt vào bánh mì',
                    hinhAnh: 'https://example.com/banhmi-buoc4.jpg'
                }
            ],
            trangThai: 'active'
        });

        const monAn3 = await MonAn.create({
            tenMon: 'Sushi California',
            moTa: 'Sushi cuộn California với cua và bơ',
            hinhAnh: 'https://example.com/sushi.jpg',
            chuDeId: chuDe2._id,
            nguoiTao: user2._id,
            nguyenLieu: [
                { ten: 'Cơm sushi', soLuong: '200g' },
                { ten: 'Rong biển', soLuong: '1 lá' },
                { ten: 'Cua', soLuong: '50g' },
                { ten: 'Bơ', soLuong: '30g' },
                { ten: 'Dưa chuột', soLuong: '20g' },
                { ten: 'Mayonnaise', soLuong: '10g' }
            ],
            huongDan: [
                {
                    buoc: 1,
                    moTa: 'Trải rong biển lên mành tre',
                    hinhAnh: 'https://example.com/sushi-buoc1.jpg'
                },
                {
                    buoc: 2,
                    moTa: 'Phủ cơm sushi lên rong biển',
                    hinhAnh: 'https://example.com/sushi-buoc2.jpg'
                },
                {
                    buoc: 3,
                    moTa: 'Xếp cua, bơ, dưa chuột lên giữa',
                    hinhAnh: 'https://example.com/sushi-buoc3.jpg'
                },
                {
                    buoc: 4,
                    moTa: 'Cuộn chặt và cắt thành từng miếng',
                    hinhAnh: 'https://example.com/sushi-buoc4.jpg'
                }
            ],
            trangThai: 'active'
        });

        const monAn4 = await MonAn.create({
            tenMon: 'Pasta Carbonara',
            moTa: 'Mì Ý sốt kem với thịt xông khói',
            hinhAnh: 'https://example.com/pasta.jpg',
            chuDeId: chuDe3._id,
            nguoiTao: admin._id,
            nguyenLieu: [
                { ten: 'Mì spaghetti', soLuong: '200g' },
                { ten: 'Thịt xông khói', soLuong: '100g' },
                { ten: 'Trứng gà', soLuong: '2 quả' },
                { ten: 'Parmesan', soLuong: '50g' },
                { ten: 'Kem tươi', soLuong: '100ml' },
                { ten: 'Tỏi', soLuong: '2 tép' }
            ],
            huongDan: [
                {
                    buoc: 1,
                    moTa: 'Luộc mì spaghetti trong nước sôi có muối',
                    hinhAnh: 'https://example.com/pasta-buoc1.jpg'
                },
                {
                    buoc: 2,
                    moTa: 'Chiên thịt xông khói với tỏi',
                    hinhAnh: 'https://example.com/pasta-buoc2.jpg'
                },
                {
                    buoc: 3,
                    moTa: 'Đánh trứng với kem và phô mai',
                    hinhAnh: 'https://example.com/pasta-buoc3.jpg'
                },
                {
                    buoc: 4,
                    moTa: 'Trộn mì với thịt xông khói, thêm hỗn hợp trứng kem',
                    hinhAnh: 'https://example.com/pasta-buoc4.jpg'
                }
            ],
            trangThai: 'active'
        });

        const monAn5 = await MonAn.create({
            tenMon: 'Sinh Tố Bơ',
            moTa: 'Sinh tố bơ mát lạnh, bổ dưỡng',
            hinhAnh: 'https://example.com/sinh-to-bo.jpg',
            chuDeId: chuDe4._id,
            nguoiTao: user1._id,
            nguyenLieu: [
                { ten: 'Bơ chín', soLuong: '1 quả' },
                { ten: 'Sữa tươi', soLuong: '200ml' },
                { ten: 'Sữa đặc', soLuong: '2 thìa' },
                { ten: 'Đá viên', soLuong: '100g' }
            ],
            huongDan: [
                {
                    buoc: 1,
                    moTa: 'Bỏ vỏ bơ, lấy phần thịt',
                    hinhAnh: 'https://example.com/sinhto-buoc1.jpg'
                },
                {
                    buoc: 2,
                    moTa: 'Cho bơ, sữa tươi, sữa đặc vào máy xay',
                    hinhAnh: 'https://example.com/sinhto-buoc2.jpg'
                },
                {
                    buoc: 3,
                    moTa: 'Thêm đá viên và xay nhuyễn',
                    hinhAnh: 'https://example.com/sinhto-buoc3.jpg'
                },
                {
                    buoc: 4,
                    moTa: 'Đổ ra ly và thưởng thức',
                    hinhAnh: 'https://example.com/sinhto-buoc4.jpg'
                }
            ],
            trangThai: 'active'
        });

        console.log(`✅ Đã tạo ${await MonAn.countDocuments()} món ăn\n`);

        // 4. Tạo món yêu thích
        console.log("❤️  Đang tạo món yêu thích...");
        
        await MonYeuThich.create({
            nguoiDungId: user1._id,
            monAnId: monAn1._id
        });

        await MonYeuThich.create({
            nguoiDungId: user1._id,
            monAnId: monAn3._id
        });

        await MonYeuThich.create({
            nguoiDungId: user2._id,
            monAnId: monAn2._id
        });

        await MonYeuThich.create({
            nguoiDungId: user2._id,
            monAnId: monAn4._id
        });

        await MonYeuThich.create({
            nguoiDungId: user2._id,
            monAnId: monAn5._id
        });

        console.log(`✅ Đã tạo ${await MonYeuThich.countDocuments()} món yêu thích\n`);

        console.log("🎉 Hoàn thành tạo dữ liệu mẫu!");
        console.log("\n📊 Tóm tắt:");
        console.log(`   - Người dùng: ${await NguoiDung.countDocuments()}`);
        console.log(`   - Chủ đề: ${await ChuDe.countDocuments()}`);
        console.log(`   - Món ăn: ${await MonAn.countDocuments()}`);
        console.log(`   - Món yêu thích: ${await MonYeuThich.countDocuments()}`);
        console.log("\n🔑 Tài khoản mẫu:");
        console.log("   Admin: tenDangNhap='admin', matKhau='123456'");
        console.log("   User1: tenDangNhap='user1', matKhau='123456'");
        console.log("   User2: tenDangNhap='user2', matKhau='123456'");

    } catch (error) {
        console.error("❌ Lỗi khi tạo dữ liệu:", error);
    }
}

// Chạy script
async function run() {
    await connectDB();
    await clearDatabase();
    await seedData();
    await mongoose.connection.close();
    console.log("\n✅ Đã đóng kết nối database");
    process.exit(0);
}

run();

