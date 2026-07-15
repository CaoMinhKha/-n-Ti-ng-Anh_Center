// prisma/seeds/module6_lophoc.seed.ts (SỬA LẠI)

import {
  PrismaClient,
  lophoc_HinhThucHoc,
  lophoc_TrangThai,
  hocvien_lophoc_TrangThai,
} from "../../src/generated/prisma/client.js";

export async function seedModule6LopHoc(
  db: InstanceType<typeof PrismaClient>
): Promise<void> {
  console.log("🌱 [Prisma 7] Đang nạp dữ liệu: Module 6 - Lớp Học...");

  // ==================================================
  // 1. Lấy dữ liệu liên quan
  // ==================================================

  // Lấy danh sách đợt khai giảng
  const dotKhaiGiangs = await db.dotkhaigiang.findMany({
    orderBy: { NgayMoDangKy: "asc" },
  });

  if (dotKhaiGiangs.length === 0) {
    throw new Error("❌ Không tìm thấy đợt khai giảng nào. Vui lòng chạy Module 5 trước!");
  }

  // Lấy danh sách khóa học
 const khoaHocs = await db.khoahoc.findMany({
  include: {  
    trinhdo: true,
  },
});

  if (khoaHocs.length === 0) {
    throw new Error("❌ Không tìm thấy khóa học nào. Vui lòng chạy Module 3 trước!");
  }

  // Lấy danh sách giáo viên (lấy đúng mã giáo viên từ database)
  const giaoViens = await db.giaovien.findMany({
    include: {
      taikhoan: true,
    },
  });

  if (giaoViens.length === 0) {
    throw new Error("❌ Không tìm thấy giáo viên nào. Vui lòng chạy Module 2 trước!");
  }

  // Lấy danh sách học viên
  const hocViens = await db.hocvien.findMany({
    include: {
      taikhoan: true,
    },
  });

  if (hocViens.length === 0) {
    throw new Error("❌ Không tìm thấy học viên nào. Vui lòng chạy Module 2 trước!");
  }

  console.log(` Tìm thấy ${dotKhaiGiangs.length} đợt khai giảng`);
  console.log(` Tìm thấy ${khoaHocs.length} khóa học`);
  console.log(` Tìm thấy ${giaoViens.length} giáo viên`);
  console.log(` Tìm thấy ${hocViens.length} học viên`);

  // Hiển thị danh sách giáo viên để debug
  console.log("\n📋 Danh sách giáo viên:");
  for (const gv of giaoViens) {
    console.log(`   - ${gv.MaGiaoVien}: ${gv.taikhoan?.HoVaTen}`);
  }

  // ==================================================
  // 2. Tạo Lớp Học
  // ==================================================

  // Lấy mã giáo viên thực tế từ database
  const gv1 = giaoViens[0]?.MaGiaoVien; // Giáo viên 1
  const gv2 = giaoViens[1]?.MaGiaoVien; // Giáo viên 2

  if (!gv1 || !gv2) {
    throw new Error("❌ Không đủ giáo viên để tạo lớp!");
  }

  const lopHocData = [
    // ===== Các lớp A1 =====
    {
      tenLopHoc: "Lớp A1 - Sáng T2-T4 (Tháng 1)",
      dotKhaiGiang: "DK2024-01",
      khoaHoc: "Tiếng Anh Cơ Bản A1",
      giaoVien: gv1, // Dùng mã giáo viên thực tế
      hinhThucHoc: lophoc_HinhThucHoc.OFFLINE,
      hocPhi: 1500000,
      siSoToiDa: 30,
      ngayBatDau: new Date("2024-01-20"),
      ngayKetThuc: new Date("2024-04-20"),
      trangThai: lophoc_TrangThai.DA_KET_THUC,
    },
    {
      tenLopHoc: "Lớp A1 - Chiều T3-T5 (Tháng 3)",
      dotKhaiGiang: "DK2024-03",
      khoaHoc: "Tiếng Anh Cơ Bản A1",
      giaoVien: gv2,
      hinhThucHoc: lophoc_HinhThucHoc.OFFLINE,
      hocPhi: 1500000,
      siSoToiDa: 25,
      ngayBatDau: new Date("2024-03-20"),
      ngayKetThuc: new Date("2024-06-20"),
      trangThai: lophoc_TrangThai.DANG_HOC,
    },
    {
      tenLopHoc: "Lớp A1 - Online Tối (Tháng 5)",
      dotKhaiGiang: "DK2024-05",
      khoaHoc: "Tiếng Anh Cơ Bản A1",
      giaoVien: gv1,
      hinhThucHoc: lophoc_HinhThucHoc.ONLLINE,
      hocPhi: 1500000,
      siSoToiDa: 20,
      ngayBatDau: new Date("2024-05-20"),
      ngayKetThuc: new Date("2024-08-20"),
      trangThai: lophoc_TrangThai.DANG_HOC,
    },
    {
      tenLopHoc: "Lớp A1 - Sáng T7 (Tháng 7)",
      dotKhaiGiang: "DK2024-07",
      khoaHoc: "Tiếng Anh Cơ Bản A1",
      giaoVien: gv2,
      hinhThucHoc: lophoc_HinhThucHoc.OFFLINE,
      hocPhi: 1500000,
      siSoToiDa: 25,
      ngayBatDau: new Date("2024-07-20"),
      ngayKetThuc: new Date("2024-10-20"),
      trangThai: lophoc_TrangThai.SAP_KHAI_GIANG,
    },
    {
      tenLopHoc: "Lớp A1 - Online (Tháng 9)",
      dotKhaiGiang: "DK2024-09",
      khoaHoc: "Tiếng Anh Cơ Bản A1",
      giaoVien: gv1,
      hinhThucHoc: lophoc_HinhThucHoc.ONLLINE,
      hocPhi: 1500000,
      siSoToiDa: 20,
      ngayBatDau: new Date("2024-09-20"),
      ngayKetThuc: new Date("2024-12-20"),
      trangThai: lophoc_TrangThai.SAP_KHAI_GIANG,
    },

    // ===== Các lớp A2 =====
    {
      tenLopHoc: "Lớp A2 - Sáng T2-T4 (Tháng 2)",
      dotKhaiGiang: "DK2024-02",
      khoaHoc: "Tiếng Anh Giao Tiếp A2",
      giaoVien: gv1,
      hinhThucHoc: lophoc_HinhThucHoc.OFFLINE,
      hocPhi: 2000000,
      siSoToiDa: 30,
      ngayBatDau: new Date("2024-02-20"),
      ngayKetThuc: new Date("2024-05-20"),
      trangThai: lophoc_TrangThai.DA_KET_THUC,
    },
    {
      tenLopHoc: "Lớp A2 - Tối T3-T5 (Tháng 4)",
      dotKhaiGiang: "DK2024-04",
      khoaHoc: "Tiếng Anh Giao Tiếp A2",
      giaoVien: gv2,
      hinhThucHoc: lophoc_HinhThucHoc.OFFLINE,
      hocPhi: 2000000,
      siSoToiDa: 25,
      ngayBatDau: new Date("2024-04-20"),
      ngayKetThuc: new Date("2024-07-20"),
      trangThai: lophoc_TrangThai.DANG_HOC,
    },
    {
      tenLopHoc: "Lớp A2 - Online Sáng (Tháng 6)",
      dotKhaiGiang: "DK2024-06",
      khoaHoc: "Tiếng Anh Giao Tiếp A2",
      giaoVien: gv1,
      hinhThucHoc: lophoc_HinhThucHoc.ONLLINE,
      hocPhi: 2000000,
      siSoToiDa: 20,
      ngayBatDau: new Date("2024-06-20"),
      ngayKetThuc: new Date("2024-09-20"),
      trangThai: lophoc_TrangThai.DANG_HOC,
    },
    {
      tenLopHoc: "Lớp A2 - Sáng T7 (Tháng 8)",
      dotKhaiGiang: "DK2024-08",
      khoaHoc: "Tiếng Anh Giao Tiếp A2",
      giaoVien: gv2,
      hinhThucHoc: lophoc_HinhThucHoc.OFFLINE,
      hocPhi: 2000000,
      siSoToiDa: 25,
      ngayBatDau: new Date("2024-08-20"),
      ngayKetThuc: new Date("2024-11-20"),
      trangThai: lophoc_TrangThai.SAP_KHAI_GIANG,
    },

    // ===== Các lớp A3 =====
    {
      tenLopHoc: "Lớp A3 - Tối T2-T4 (Tháng 3)",
      dotKhaiGiang: "DK2024-03",
      khoaHoc: "Tiếng Anh Nâng Cao A3",
      giaoVien: gv1,
      hinhThucHoc: lophoc_HinhThucHoc.OFFLINE,
      hocPhi: 2500000,
      siSoToiDa: 25,
      ngayBatDau: new Date("2024-03-20"),
      ngayKetThuc: new Date("2024-06-20"),
      trangThai: lophoc_TrangThai.DA_KET_THUC,
    },
    {
      tenLopHoc: "Lớp A3 - Online Tối (Tháng 6)",
      dotKhaiGiang: "DK2024-06",
      khoaHoc: "Tiếng Anh Nâng Cao A3",
      giaoVien: gv2,
      hinhThucHoc: lophoc_HinhThucHoc.ONLLINE,
      hocPhi: 2500000,
      siSoToiDa: 20,
      ngayBatDau: new Date("2024-06-20"),
      ngayKetThuc: new Date("2024-09-20"),
      trangThai: lophoc_TrangThai.DANG_HOC,
    },
    {
      tenLopHoc: "Lớp A3 - Sáng T7 (Tháng 9)",
      dotKhaiGiang: "DK2024-09",
      khoaHoc: "Tiếng Anh Nâng Cao A3",
      giaoVien: gv1,
      hinhThucHoc: lophoc_HinhThucHoc.OFFLINE,
      hocPhi: 2500000,
      siSoToiDa: 20,
      ngayBatDau: new Date("2024-09-20"),
      ngayKetThuc: new Date("2024-12-20"),
      trangThai: lophoc_TrangThai.SAP_KHAI_GIANG,
    },
  ];

  const createdLopHocs = [];

  for (const item of lopHocData) {
    // Tìm đợt khai giảng
    const dotKhaiGiang = dotKhaiGiangs.find((d) => d.MaDot === item.dotKhaiGiang);
    if (!dotKhaiGiang) {
      console.warn(`⚠️ Không tìm thấy đợt khai giảng ${item.dotKhaiGiang}, bỏ qua lớp ${item.tenLopHoc}`);
      continue;
    }

    // Tìm khóa học
    const khoaHoc = khoaHocs.find((k) => k.TenKhoaHoc === item.khoaHoc);
    if (!khoaHoc) {
      console.warn(`⚠️ Không tìm thấy khóa học ${item.khoaHoc}, bỏ qua lớp ${item.tenLopHoc}`);
      continue;
    }

    // Tìm giáo viên (dùng mã thực tế)
    const giaoVien = giaoViens.find((g) => g.MaGiaoVien === item.giaoVien);
    if (!giaoVien) {
      console.warn(`⚠️ Không tìm thấy giáo viên ${item.giaoVien}, bỏ qua lớp ${item.tenLopHoc}`);
      continue;
    }

    const lopHoc = await db.lophoc.upsert({
      where: {
        TenLopHoc: item.tenLopHoc,
      },
      update: {
        DotKhaiGiangID: dotKhaiGiang.DotKhaiGiangID,
        KhoaHocID: khoaHoc.KhoaHocID,
        GiaoVienID: giaoVien.GiaoVienID,
        HinhThucHoc: item.hinhThucHoc,
        HocPhi: item.hocPhi,
        SiSoToiDa: item.siSoToiDa,
        NgayBatDau: item.ngayBatDau,
        NgayKetThuc: item.ngayKetThuc,
        TrangThai: item.trangThai,
      },
      create: {
        DotKhaiGiangID: dotKhaiGiang.DotKhaiGiangID,
        KhoaHocID: khoaHoc.KhoaHocID,
        GiaoVienID: giaoVien.GiaoVienID,
        TenLopHoc: item.tenLopHoc,
        HinhThucHoc: item.hinhThucHoc,
        HocPhi: item.hocPhi,
        SiSoToiDa: item.siSoToiDa,
        NgayBatDau: item.ngayBatDau,
        NgayKetThuc: item.ngayKetThuc,
        TrangThai: item.trangThai,
      },
    });

    createdLopHocs.push(lopHoc);
    console.log(` Đã tạo lớp: ${lopHoc.TenLopHoc}`);
  }

  // ==================================================
  // 3. Đăng ký học viên vào lớp
  // ==================================================

  console.log(`\n📝 Đang đăng ký học viên vào các lớp...`);

  // Lấy danh sách học viên (lấy 20 học viên đầu)
  const hocVienList = hocViens.slice(0, 20);

  // Đăng ký học viên vào các lớp đang mở hoặc sắp khai giảng
  const lopHocsDangMo = await db.lophoc.findMany({
    where: {
      TrangThai: {
        in: [lophoc_TrangThai.DANG_HOC, lophoc_TrangThai.SAP_KHAI_GIANG],
      },
    },
  });

  if (lopHocsDangMo.length === 0) {
    console.warn("⚠️ Không có lớp nào đang mở hoặc sắp khai giảng để đăng ký!");
  }

  let totalDangKy = 0;

  for (const lopHoc of lopHocsDangMo) {
    // Chọn ngẫu nhiên 5-10 học viên cho mỗi lớp
    const soLuong = Math.min(Math.floor(Math.random() * 6) + 5, hocVienList.length);
    const hocVienChon = hocVienList.slice(0, soLuong);

    for (const hocVien of hocVienChon) {
      // Kiểm tra đã đăng ký chưa
      const existing = await db.hocvien_lophoc.findFirst({
        where: {
          HocVienID: hocVien.HocVienID,
          LopHocID: lopHoc.LopHocID,
        },
      });

      if (!existing) {
        await db.hocvien_lophoc.create({
          data: {
            HocVienID: hocVien.HocVienID,
            LopHocID: lopHoc.LopHocID,
            HocPhi: lopHoc.HocPhi || 0,
            NgayDangKy: new Date(),
            DongHocPhi: Math.random() > 0.3,
            TrangThai:
              lopHoc.TrangThai === lophoc_TrangThai.DANG_HOC
                ? hocvien_lophoc_TrangThai.DA_DUYET
                : hocvien_lophoc_TrangThai.CHO_DUYET,
          },
        });
        totalDangKy++;
      }
    }

    console.log(`   Đã đăng ký ${soLuong} học viên cho lớp: ${lopHoc.TenLopHoc}`);
  }

  console.log(`\n Hoàn thành: Module 6 - Lớp Học.`);
  console.log(`📊 Tổng kết:`);
  console.log(`   - ${createdLopHocs.length} lớp học`);
  console.log(`   - ${totalDangKy} lượt đăng ký học viên`);
}