// prisma/seeds/module8_diemdanh.seed.ts

import {
  PrismaClient,
  hocvien_diemdanh_TrangThaiDiemDanh,
  madiemdanh_TrangThai,
} from "../../src/generated/prisma/client.js";

export async function seedModule8DiemDanh(
  db: InstanceType<typeof PrismaClient>
): Promise<void> {
  console.log("🌱 [Prisma 7] Đang nạp dữ liệu: Module 8 - Điểm Danh...");

  // ==================================================
  // 1. Lấy danh sách các buổi học
  // ==================================================

  const buoiHocs = await db.buoihoc.findMany({
    where: {
      NgayHoc: {
        lte: new Date(), // Lấy các buổi học từ quá khứ đến hiện tại
      },
    },
    include: {
      lophoc: {
        include: {
          hocvien_lophoc: {
            where: {
              TrangThai: "DA_DUYET",
            },
            include: {
              hocvien: true,
            },
          },
        },
      },
      cahoc: true,
    },
    orderBy: {
      NgayHoc: "asc",
    },
    take: 20, // Giới hạn 20 buổi học
  });

  if (buoiHocs.length === 0) {
    console.warn("⚠️ Không có buổi học nào để điểm danh!");
    return;
  }

  console.log(` Tìm thấy ${buoiHocs.length} buổi học để điểm danh`);

  // ==================================================
  // 2. Lấy danh sách giáo viên
  // ==================================================

  const giaoViens = await db.giaovien.findMany({
    include: {
      taikhoan: true,
    },
  });

  if (giaoViens.length === 0) {
    console.warn("⚠️ Không có giáo viên nào để tạo mã điểm danh!");
    return;
  }

  console.log(` Tìm thấy ${giaoViens.length} giáo viên`);

  // ==================================================
  // 3. Tạo điểm danh cho các buổi học
  // ==================================================

  let totalDiemDanh = 0;
  let totalMaDiemDanh = 0;

  for (const buoiHoc of buoiHocs) {
    const hocViens = buoiHoc.lophoc?.hocvien_lophoc || [];

    if (hocViens.length === 0) {
      console.log(`  ⏭️ Bỏ qua buổi học ${buoiHoc.NgayHoc.toLocaleDateString()} (không có học viên)`);
      continue;
    }

    console.log(`\n📝 Đang điểm danh buổi học: ${buoiHoc.NgayHoc.toLocaleDateString()}`);

    // ==================================================
    // 3.1. Tạo mã điểm danh cho buổi học
    // ==================================================

    // Chọn ngẫu nhiên 1 giáo viên
    const giaoVien = giaoViens[Math.floor(Math.random() * giaoViens.length)];

    // Tạo mã điểm danh
    const maDiemDanh = await db.madiemdanh.create({
      data: {
        BuoiHocID: buoiHoc.BuoiHocID,
        GiaoVienID: giaoVien.GiaoVienID,
        NoiDungMaDiemDanh: `MDD${String(buoiHoc.BuoiHocID).padStart(6, '0')}${Date.now().toString().slice(-4)}`,
        ThoiGianHetHan: new Date(Date.now() + 15 * 60 * 1000), // Hết hạn sau 15 phút
        TrangThai:
          buoiHoc.NgayHoc < new Date()
            ? madiemdanh_TrangThai.HET_HAN
            : madiemdanh_TrangThai.DANG_HOAT_DONG,
      },
    });
    totalMaDiemDanh++;
    console.log(`   Đã tạo mã điểm danh: ${maDiemDanh.NoiDungMaDiemDanh}`);

    // ==================================================
    // 3.2. Điểm danh học viên
    // ==================================================

    // Các trạng thái điểm danh có thể
    const trangThaiList = [
      hocvien_diemdanh_TrangThaiDiemDanh.CO_MAT,
      hocvien_diemdanh_TrangThaiDiemDanh.CO_MAT,
      hocvien_diemdanh_TrangThaiDiemDanh.CO_MAT,
      hocvien_diemdanh_TrangThaiDiemDanh.CO_MAT,
      hocvien_diemdanh_TrangThaiDiemDanh.CO_MAT,
      hocvien_diemdanh_TrangThaiDiemDanh.CO_MAT,
      hocvien_diemdanh_TrangThaiDiemDanh.VANG_CO_PHEP,
      hocvien_diemdanh_TrangThaiDiemDanh.VANG_KHONG_PHEP,
      hocvien_diemdanh_TrangThaiDiemDanh.DI_MUON,
    ];

    // Lấy tối đa 10 học viên để điểm danh (tránh tạo quá nhiều)
    const hocVienList = hocViens.slice(0, 10);

    for (const hvLop of hocVienList) {
      // Random trạng thái điểm danh
      const trangThai =
        trangThaiList[Math.floor(Math.random() * trangThaiList.length)];

      // Random thời gian check-in (nếu có mặt)
      let thoiGianCheckIn: Date | null = null;
      let ghiChu: string | null = null;

      if (trangThai === hocvien_diemdanh_TrangThaiDiemDanh.CO_MAT) {
        // Giả định học viên check-in trong khoảng 15 phút đầu buổi
        const checkInTime = new Date(buoiHoc.NgayHoc);
        checkInTime.setHours(
          buoiHoc.cahoc?.GioBatDau?.getHours() || 7,
          buoiHoc.cahoc?.GioBatDau?.getMinutes() || 30,
          Math.floor(Math.random() * 900) // 0-15 phút
        );
        thoiGianCheckIn = checkInTime;
      } else if (trangThai === hocvien_diemdanh_TrangThaiDiemDanh.DI_MUON) {
        const checkInTime = new Date(buoiHoc.NgayHoc);
        checkInTime.setHours(
          (buoiHoc.cahoc?.GioBatDau?.getHours() || 7) + 1,
          (buoiHoc.cahoc?.GioBatDau?.getMinutes() || 30) + Math.floor(Math.random() * 30),
          Math.floor(Math.random() * 60)
        );
        thoiGianCheckIn = checkInTime;
        ghiChu = "Đi muộn 15-30 phút";
      } else if (trangThai === hocvien_diemdanh_TrangThaiDiemDanh.VANG_CO_PHEP) {
        ghiChu = "Có phép (lý do gia đình)";
      } else if (trangThai === hocvien_diemdanh_TrangThaiDiemDanh.VANG_KHONG_PHEP) {
        ghiChu = "Không phép";
      }

      // Kiểm tra đã điểm danh chưa
      const existing = await db.hocvien_diemdanh.findFirst({
        where: {
          HocVienID: hvLop.HocVienID,
          BuoiHocID: buoiHoc.BuoiHocID,
        },
      });

      if (!existing) {
        await db.hocvien_diemdanh.create({
          data: {
            HocVienID: hvLop.HocVienID,
            BuoiHocID: buoiHoc.BuoiHocID,
            TrangThaiDiemDanh: trangThai,
            ThoiGianCheckIn: thoiGianCheckIn,
            GhiChu: ghiChu,
          },
        });
        totalDiemDanh++;
      }
    }

    console.log(`   Đã điểm danh ${Math.min(hocViens.length, 10)} học viên`);
  }

  // ==================================================
  // 4. Tạo thêm điểm danh cho buổi học hiện tại (nếu có)
  // ==================================================

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const buoiHocHomNay = await db.buoihoc.findFirst({
    where: {
      NgayHoc: today,
    },
    include: {
      lophoc: {
        include: {
          hocvien_lophoc: {
            where: {
              TrangThai: "DA_DUYET",
            },
            include: {
              hocvien: true,
            },
          },
        },
      },
      cahoc: true,
    },
  });

  if (buoiHocHomNay) {
    console.log(`\n📝 Đang tạo điểm danh cho buổi học hôm nay: ${today.toLocaleDateString()}`);

    const hocViens = buoiHocHomNay.lophoc?.hocvien_lophoc || [];

    if (hocViens.length > 0) {
      // Tạo mã điểm danh cho buổi học hôm nay
      const giaoVien = giaoViens[Math.floor(Math.random() * giaoViens.length)];

      await db.madiemdanh.create({
        data: {
          BuoiHocID: buoiHocHomNay.BuoiHocID,
          GiaoVienID: giaoVien.GiaoVienID,
          NoiDungMaDiemDanh: `MDD${String(buoiHocHomNay.BuoiHocID).padStart(6, '0')}${Date.now().toString().slice(-4)}`,
          ThoiGianHetHan: new Date(Date.now() + 15 * 60 * 1000),
          TrangThai: madiemdanh_TrangThai.DANG_HOAT_DONG,
        },
      });

      // Điểm danh một số học viên (giả sử đã có mặt)
      const hocVienList = hocViens.slice(0, 8);
      for (const hvLop of hocVienList) {
        const trangThai =
          Math.random() > 0.8
            ? hocvien_diemdanh_TrangThaiDiemDanh.DI_MUON
            : hocvien_diemdanh_TrangThaiDiemDanh.CO_MAT;

        const checkInTime = new Date();
        checkInTime.setHours(
          buoiHocHomNay.cahoc?.GioBatDau?.getHours() || 7,
          (buoiHocHomNay.cahoc?.GioBatDau?.getMinutes() || 30) + Math.floor(Math.random() * 15),
          Math.floor(Math.random() * 60)
        );

        await db.hocvien_diemdanh.create({
          data: {
            HocVienID: hvLop.HocVienID,
            BuoiHocID: buoiHocHomNay.BuoiHocID,
            TrangThaiDiemDanh: trangThai,
            ThoiGianCheckIn: checkInTime,
            GhiChu: trangThai === hocvien_diemdanh_TrangThaiDiemDanh.DI_MUON ? "Đi muộn" : null,
          },
        });
        totalDiemDanh++;
      }

      console.log(`   Đã tạo điểm danh cho ${Math.min(hocViens.length, 8)} học viên hôm nay`);
      console.log(`   Đã tạo mã điểm danh cho buổi học hôm nay`);
    }
  }

  console.log("\n Hoàn thành: Module 8 - Điểm Danh.");
  console.log(`📊 Tổng kết:`);
  console.log(`   - ${totalDiemDanh} lượt điểm danh`);
  console.log(`   - ${totalMaDiemDanh} mã điểm danh`);
}