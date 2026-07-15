// prisma/seeds/module10_ketquahoctap.seed.ts

import {
  PrismaClient,
  ketquahoctap_XepLoai,
  tiendohoctap_TrangThai,
} from "../../src/generated/prisma/client.js";

export async function seedModule10KetQuaHocTap(
  db: InstanceType<typeof PrismaClient>
): Promise<void> {
  console.log("🌱 [Prisma 7] Đang nạp dữ liệu: Module 10 - Kết Quả Học Tập...");

  // ==================================================
  // 1. Lấy danh sách học viên đã đăng ký lớp
  // ==================================================

  const hocVienLopHocs = await db.hocvien_lophoc.findMany({
    where: {
      TrangThai: "DA_DUYET",
    },
    include: {
      hocvien: {
        include: {
          taikhoan: true,
        },
      },
      lophoc: {
        include: {
          khoahoc: true,
        },
      },
    },
    take: 20,
  });

  if (hocVienLopHocs.length === 0) {
    console.warn("⚠️ Không có học viên nào đã đăng ký lớp!");
    return;
  }

  console.log(` Tìm thấy ${hocVienLopHocs.length} học viên đã đăng ký lớp`);

  // ==================================================
  // 2. Tạo Kết Quả Học Tập cho từng học viên
  // ==================================================

  let totalKetQua = 0;
  let totalTienDo = 0;

  for (const hvLop of hocVienLopHocs) {
    console.log(`\n📝 Đang tạo kết quả cho học viên: ${hvLop.hocvien?.taikhoan?.HoVaTen || "Unknown"}`);

    // ==================================================
    // 2.1. Tính điểm chuyên cần
    // ==================================================

    // Lấy số buổi học của lớp
    const buoiHocs = await db.buoihoc.findMany({
      where: {
        LopHocID: hvLop.LopHocID,
      },
    });

    // Lấy số buổi điểm danh của học viên
    const diemDanhs = await db.hocvien_diemdanh.findMany({
      where: {
        HocVienID: hvLop.HocVienID,
        BuoiHocID: {
          in: buoiHocs.map((b) => b.BuoiHocID),
        },
      },
    });

    const tongBuoi = buoiHocs.length || 1;
    const soBuoiCoMat = diemDanhs.filter(
      (d) => d.TrangThaiDiemDanh === "CO_MAT"
    ).length;
    const soBuoiDiMuon = diemDanhs.filter(
      (d) => d.TrangThaiDiemDanh === "DI_MUON"
    ).length;

    // Điểm chuyên cần: 10 điểm nếu đi đủ, trừ 0.5 điểm mỗi buổi vắng, 0.25 điểm mỗi buổi đi muộn
    let diemChuyenCan = 10;
    const soBuoiVang = tongBuoi - soBuoiCoMat - soBuoiDiMuon;
    diemChuyenCan -= soBuoiVang * 0.5;
    diemChuyenCan -= soBuoiDiMuon * 0.25;
    diemChuyenCan = Math.max(0, Math.min(10, diemChuyenCan));

    // ==================================================
    // 2.2. Tính điểm bài tập (dựa trên bài làm)
    // ==================================================

    const baiLams = await db.bailam.findMany({
      where: {
        HocVienID: hvLop.HocVienID,
        LopHocID: hvLop.LopHocID,
        TrangThai: "DA_NOP",
      },
    });

    let diemBaiTap = 0;
    if (baiLams.length > 0) {
      const tongDiemBaiLam = baiLams.reduce((sum, b) => sum + (b.TongDiem?.toNumber() || 0), 0);
      diemBaiTap = (tongDiemBaiLam / baiLams.length) * 10; // Quy đổi sang thang điểm 10
      diemBaiTap = Math.min(10, diemBaiTap);
    }

    // ==================================================
    // 2.3. Tính điểm kiểm tra
    // ==================================================

    // Lấy các bài kiểm tra của lớp
    const baiKiemTras = await db.baikiemtra.findMany({
      where: {
        phanbaihoc: {
          baihoc: {
            khoahoc: {
              KhoaHocID: hvLop.lophoc?.KhoaHocID,
            },
          },
        },
      },
    });

    let diemKiemTra = 0;
    if (baiKiemTras.length > 0) {
      // Lấy điểm các bài kiểm tra của học viên
      const diemCacBaiKT = await db.bailam.findMany({
        where: {
          HocVienID: hvLop.HocVienID,
          LopHocID: hvLop.LopHocID,
          BaiKiemTraID: {
            in: baiKiemTras.map((b) => b.BaiKiemTraID),
          },
          TrangThai: "DA_NOP",
        },
      });

      if (diemCacBaiKT.length > 0) {
        const tongDiemKT = diemCacBaiKT.reduce((sum, b) => sum + (b.TongDiem?.toNumber() || 0), 0);
        diemKiemTra = (tongDiemKT / diemCacBaiKT.length) * 10; // Quy đổi sang thang điểm 10
        diemKiemTra = Math.min(10, diemKiemTra);
      }
    }

    // ==================================================
    // 2.4. Tính tổng điểm và xếp loại
    // ==================================================

    const tongDiem = (diemChuyenCan + diemBaiTap + diemKiemTra) / 3;

    let xepLoai: ketquahoctap_XepLoai;
    if (tongDiem >= 9) xepLoai = ketquahoctap_XepLoai.XUAT_SAC;
    else if (tongDiem >= 8) xepLoai = ketquahoctap_XepLoai.GIOI;
    else if (tongDiem >= 6.5) xepLoai = ketquahoctap_XepLoai.KHA;
    else if (tongDiem >= 5) xepLoai = ketquahoctap_XepLoai.TRUNG_BINH;
    else xepLoai = ketquahoctap_XepLoai.KHONG_DAT;

    // ==================================================
    // 2.5. Tạo Kết Quả Học Tập
    // ==================================================

    const ketQua = await db.ketquahoctap.upsert({
      where: {
        HocVienID_LopHocID: {
          HocVienID: hvLop.HocVienID,
          LopHocID: hvLop.LopHocID,
        },
      },
      update: {
        DiemChuyenCan: diemChuyenCan,
        DiemBaiTap: diemBaiTap,
        DiemKiemTra: diemKiemTra,
        TongDiem: tongDiem,
        XepLoai: xepLoai,
        NgayCapNhat: new Date(),
      },
      create: {
        HocVienID: hvLop.HocVienID,
        LopHocID: hvLop.LopHocID,
        DiemChuyenCan: diemChuyenCan,
        DiemBaiTap: diemBaiTap,
        DiemKiemTra: diemKiemTra,
        TongDiem: tongDiem,
        XepLoai: xepLoai,
        NgayCapNhat: new Date(),
      },
    });

    totalKetQua++;
    console.log(
      `   Điểm: CC=${diemChuyenCan.toFixed(1)}, BT=${diemBaiTap.toFixed(1)}, KT=${diemKiemTra.toFixed(1)}, Tổng=${tongDiem.toFixed(1)}, Xếp loại: ${xepLoai}`
    );

    // ==================================================
    // 3. Tạo Tiến Độ Học Tập cho từng phần bài học
    // ==================================================

    // Lấy danh sách phần bài học của khóa học
    const phanBaiHocs = await db.phanbaihoc.findMany({
      where: {
        baihoc: {
          khoahoc: {
            KhoaHocID: hvLop.lophoc?.KhoaHocID,
          },
        },
      },
      include: {
        baihoc: true,
      },
    });

    for (const phanBai of phanBaiHocs) {
      // Lấy số câu hỏi của phần bài học
      const cauHois = await db.phanbaihoc_cauhoi.findMany({
        where: {
          PhanBaiHocID: phanBai.PhanBaiHocID,
        },
        include: {
          cauhoi: true,
        },
      });

      const tongSoCauHoi = cauHois.length;

      // Lấy số câu hỏi đã làm đúng của học viên
      let tongSoCauHoiDung = 0;
      if (tongSoCauHoi > 0) {
        const cauHoiIDs = cauHois.map((c) => c.CauHoiID);

        const baiLamChiTiets = await db.bailam_chitiet.findMany({
          where: {
            CauHoiID: {
              in: cauHoiIDs,
            },
            bailam: {
              HocVienID: hvLop.HocVienID,
              LopHocID: hvLop.LopHocID,
            },
          },
        });

        tongSoCauHoiDung = baiLamChiTiets.filter((b) => b.LaDung === true).length;
      }

      // Xác định trạng thái tiến độ
      let trangThai: tiendohoctap_TrangThai;
      let ngayBatDau: Date | null = null;
      let ngayHoanThanh: Date | null = null;

      if (tongSoCauHoiDung >= tongSoCauHoi && tongSoCauHoi > 0) {
        trangThai = tiendohoctap_TrangThai.HOAN_THANH;
        ngayHoanThanh = new Date();
      } else if (tongSoCauHoiDung > 0) {
        trangThai = tiendohoctap_TrangThai.DANG_HOC;
        ngayBatDau = new Date();
      } else {
        trangThai = tiendohoctap_TrangThai.CHUA_BAT_DAU;
      }

      // Tạo tiến độ học tập
      await db.tiendohoctap.upsert({
        where: {
          HocVienID_LopHocID_PhanBaiHocID: {
            HocVienID: hvLop.HocVienID,
            LopHocID: hvLop.LopHocID,
            PhanBaiHocID: phanBai.PhanBaiHocID,
          },
        },
        update: {
          TongSoCauHoi: tongSoCauHoi,
          TongSoCauHoiDung: tongSoCauHoiDung,
          TrangThai: trangThai,
          NgayBatDau: ngayBatDau,
          NgayHoanThanh: ngayHoanThanh,
        },
        create: {
          HocVienID: hvLop.HocVienID,
          LopHocID: hvLop.LopHocID,
          PhanBaiHocID: phanBai.PhanBaiHocID,
          TongSoCauHoi: tongSoCauHoi,
          TongSoCauHoiDung: tongSoCauHoiDung,
          TrangThai: trangThai,
          NgayBatDau: ngayBatDau,
          NgayHoanThanh: ngayHoanThanh,
        },
      });

      totalTienDo++;

      if (tongSoCauHoi > 0) {
        const phanTram = ((tongSoCauHoiDung / tongSoCauHoi) * 100).toFixed(0);
        console.log(
          `    📚 ${phanBai.TenPhanBaiHoc}: ${tongSoCauHoiDung}/${tongSoCauHoi} (${phanTram}%) - ${trangThai}`
        );
      }
    }
  }

  console.log("\n Hoàn thành: Module 10 - Kết Quả Học Tập.");
  console.log(`📊 Tổng kết:`);
  console.log(`   - ${totalKetQua} kết quả học tập`);
  console.log(`   - ${totalTienDo} tiến độ học tập`);
}