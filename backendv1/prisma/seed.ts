// prisma/seed.ts
// npx prisma migrate reset
// npx prisma db seed
import { prisma } from "../src/config/prisma.js";
// BẮT BUỘC phải viết rõ đuôi .ts ở cuối đường dẫn khi dùng Type Module
import { seedModule1DanhMuc } from "./seeds/module1_danhmuc.seed.js";
import { seedModule2TaiKhoan } from "./seeds/module2_taikhoan.seed.js";
import { seedModule3KhoaHoc } from "./seeds/module3_khoahoc.seed.js";
import { seedModule4CauHoi } from "./seeds/module4_cauhoi.seed.js";
import { seedModule5DotKhaiGiang } from "./seeds/module5_dotkhaigiang.seed.js";
import { seedModule6LopHoc } from "./seeds/module6_lophoc.seed.js";
import { seedModule7LichHoc } from "./seeds/module7_lichhoc.seed.js";
import { seedModule8DiemDanh } from "./seeds/module8_diemdanh.seed.js";
import { seedModule9BaiLam } from "./seeds/module9_bailam.seed.js";
import { seedModule10KetQuaHocTap } from "./seeds/module10_ketquahoctap.seed.js";







async function main() {
console.log("🚀 Bắt đầu nạp dữ liệu cho toàn bộ hệ thống...\n");

    console.log("📦 Module 1: Danh Mục");
    await seedModule1DanhMuc(prisma);

    console.log("\n📦 Module 2: Tài Khoản");
    await seedModule2TaiKhoan(prisma);

    console.log("\n📦 Module 3: Khóa Học");
    await seedModule3KhoaHoc(prisma);

    console.log("\n📦 Module 4: Câu Hỏi và Đáp Án");
    await seedModule4CauHoi(prisma);

    console.log("\n📦 Module 5: Đợt Khai Giảng");
    await seedModule5DotKhaiGiang(prisma);

    console.log("\n📦 Module 6: Lớp Học");
    await seedModule6LopHoc(prisma);

    console.log("\n📦 Module 7: Lịch Học");
    await seedModule7LichHoc(prisma);

    console.log("\n📦 Module 8: Điểm Danh");
    await seedModule8DiemDanh(prisma);

    console.log("\n📦 Module 9: Bài Làm");
    await seedModule9BaiLam(prisma);

    console.log("\n📦 Module 10: Kết Quả Học Tập");
    await seedModule10KetQuaHocTap(prisma);

    console.log("\n Hoàn thành nạp dữ liệu cho tất cả các module!");
    console.log("🎉 Hệ thống đã sẵn sàng để chạy!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Lỗi xảy ra khi chạy Seed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
