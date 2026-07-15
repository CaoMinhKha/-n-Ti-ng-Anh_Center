// module1_danhmuc.seed.ts

import {
  PrismaClient,
  danhmuc_TrangThai,
} from "../../src/generated/prisma/client";

// Định nghĩa interface để quản lý cấu trúc cây danh mục rõ ràng
interface SubCategoryInput {
  TenDanhMuc: string;
  MoTa: string;
  ThuTuHienThi: number;
}

interface MainCategoryInput {
  TenDanhMuc: string;
  MoTa: string;
  ThuTuHienThi: number;
  Subs: SubCategoryInput[];
}

export async function seedModule1DanhMuc(prisma: PrismaClient): Promise<void> {
  const startTime = Date.now();
  console.log("🌱 Seeding Module 1 - DanhMuc [Optimized V2]...");

  // 1. Khai báo Data Matrix tập trung - Dễ quản lý, bảo trì và mở rộng
  const categoriesData: MainCategoryInput[] = [
    {
      TenDanhMuc: "Trình độ",
      MoTa: "Danh mục trình độ khóa học",
      ThuTuHienThi: 1,
      Subs: [
        { TenDanhMuc: "A1", MoTa: "Trình độ A1", ThuTuHienThi: 1 },
        { TenDanhMuc: "A2", MoTa: "Trình độ A2", ThuTuHienThi: 2 },
        { TenDanhMuc: "B1", MoTa: "Trình độ B1", ThuTuHienThi: 3 },
        { TenDanhMuc: "B2", MoTa: "Trình độ B2", ThuTuHienThi: 4 },
        { TenDanhMuc: "C1", MoTa: "Trình độ C1", ThuTuHienThi: 5 },
        { TenDanhMuc: "C2", MoTa: "Trình độ C2", ThuTuHienThi: 6 },
      ],
    },
    {
      TenDanhMuc: "Nội dung học",
      MoTa: "Danh mục nội dung môn học",
      ThuTuHienThi: 2,
      Subs: [
        { TenDanhMuc: "Listening", MoTa: "Luyện kỹ năng nghe", ThuTuHienThi: 1 },
        { TenDanhMuc: "Reading", MoTa: "Luyện kỹ năng đọc", ThuTuHienThi: 2 },
        { TenDanhMuc: "Speaking", MoTa: "Luyện kỹ năng nói", ThuTuHienThi: 3 },
        { TenDanhMuc: "Writing", MoTa: "Luyện kỹ năng viết", ThuTuHienThi: 4 },
        { TenDanhMuc: "Grammar", MoTa: "Luyện ngữ pháp", ThuTuHienThi: 5 },
        { TenDanhMuc: "Vocabulary", MoTa: "Luyện từ vựng", ThuTuHienThi: 6 },
      ],
    },
  ];

  let totalMainCreated = 0;
  let totalSubCreated = 0;

  // 2. Thực thi xử lý tối ưu hóa hiệu năng & Đảm bảo tính tuần tự (Idempotence)
  for (const mainCat of categoriesData) {
    // Sử dụng upsert cho Danh mục cha để chạy bao nhiêu lần cũng không bị lỗi lặp
    const parent = await prisma.danhmuc.upsert({
      where: {
        TenDanhMuc: mainCat.TenDanhMuc,
      },
      update: {
        MoTa: mainCat.MoTa,
        ThuTuHienThi: mainCat.ThuTuHienThi,
      },
      create: {
        TenDanhMuc: mainCat.TenDanhMuc,
        MoTa: mainCat.MoTa,
        ThuTuHienThi: mainCat.ThuTuHienThi,
        TrangThai: danhmuc_TrangThai.HOAT_DONG,
      },
    });
    totalMainCreated++;

    // Chuẩn bị mảng dữ liệu cho danh mục con để dùng Bulk Insert (createMany)
    const subCategoriesPayload = mainCat.Subs.map((sub) => ({
      TenDanhMuc: sub.TenDanhMuc,
      MoTa: sub.MoTa,
      ThuTuHienThi: sub.ThuTuHienThi,
      DanhMucChaID: parent.DanhMucID,
      TrangThai: danhmuc_TrangThai.HOAT_DONG,
    }));

    // Tối ưu hóa hiệu năng bằng createMany kết hợp skipDuplicates thay vì chạy vòng lặp create lẻ tẻ
    const result = await prisma.danhmuc.createMany({
      data: subCategoriesPayload,
      skipDuplicates: true, // Quy tắc an toàn: Không crash khi chạy lại seed lần sau
    });
    
    totalSubCreated += result.count;
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(` Hoàn thành Module 1 trong ${duration}s!`);
  console.log(`   - Danh mục gốc: Đảm bảo tồn tại ${totalMainCreated} danh mục.`);
  console.log(`   - Danh mục con: Đã nạp mới/bỏ qua trùng lặp ${totalSubCreated} mục.`);
}