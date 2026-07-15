// prisma/seeds/module9_bailam.seed.ts

import {
  PrismaClient,
  bailam_TrangThai,
} from "../../src/generated/prisma/client.js";

export async function seedModule9BaiLam(
  db: InstanceType<typeof PrismaClient>
): Promise<void> {
  console.log("🌱 [Prisma 7] Đang nạp dữ liệu: Module 9 - Bài Làm...");

  // ==================================================
  // 1. Lấy danh sách bài kiểm tra
  // ==================================================

  const baiKiemTras = await db.baikiemtra.findMany({
    include: {
      phanbaihoc: {
        include: {
          baihoc: {
            include: {
              khoahoc: true,
            },
          },
        },
      },
      baikiemtra_cauhoi: {
        include: {
          cauhoi: {
            include: {
              dapan: true,
            },
          },
        },
      },
    },
    take: 10, // Giới hạn 10 bài kiểm tra
  });

  if (baiKiemTras.length === 0) {
    console.warn("⚠️ Không có bài kiểm tra nào để tạo bài làm!");
    return;
  }

  console.log(` Tìm thấy ${baiKiemTras.length} bài kiểm tra`);

  // ==================================================
  // 2. Lấy danh sách học viên đã đăng ký lớp
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
      lophoc: true,
    },
    take: 30,
  });

  if (hocVienLopHocs.length === 0) {
    console.warn("⚠️ Không có học viên nào đã đăng ký lớp!");
    return;
  }

  console.log(` Tìm thấy ${hocVienLopHocs.length} học viên đã đăng ký lớp`);

  // ==================================================
  // 3. Tạo bài làm cho học viên
  // ==================================================

  let totalBaiLam = 0;
  let totalBaiLamChiTiet = 0;

  for (const baiKiemTra of baiKiemTras) {
    // Lấy danh sách câu hỏi của bài kiểm tra
    const cauHois = baiKiemTra.baikiemtra_cauhoi || [];

    if (cauHois.length === 0) {
      console.log(`  ⏭️ Bỏ qua bài kiểm tra ${baiKiemTra.TenBaiKiemTra} (không có câu hỏi)`);
      continue;
    }

    console.log(`\n📝 Đang tạo bài làm cho: ${baiKiemTra.TenBaiKiemTra}`);

    // Chọn 3-5 học viên làm bài kiểm tra này
    const soLuongHocVien = Math.min(
      Math.floor(Math.random() * 3) + 3,
      hocVienLopHocs.length
    );

    const shuffledHocViens = hocVienLopHocs.sort(() => 0.5 - Math.random());
    const selectedHocViens = shuffledHocViens.slice(0, soLuongHocVien);

    for (const hvLop of selectedHocViens) {
      // Kiểm tra đã làm bài chưa
      const existing = await db.bailam.findFirst({
        where: {
          BaiKiemTraID: baiKiemTra.BaiKiemTraID,
          HocVienID: hvLop.HocVienID,
          LopHocID: hvLop.LopHocID,
        },
      });

      if (existing) continue;

      // Thời gian bắt đầu làm bài (ngẫu nhiên trong 7 ngày qua)
      const thoiGianBatDau = new Date();
      thoiGianBatDau.setDate(thoiGianBatDau.getDate() - Math.floor(Math.random() * 7));

      // Thời gian làm bài (ngẫu nhiên 30-90 phút)
      const thoiGianLam = Math.floor(Math.random() * 60) + 30; // 30-90 phút

      // Thời gian nộp bài
      const thoiGianNop = new Date(thoiGianBatDau);
      thoiGianNop.setMinutes(thoiGianNop.getMinutes() + thoiGianLam);

      // Tính điểm
      let tongDiem = 0;
      let maxDiem = 0;

      // Danh sách chi tiết bài làm
      const chiTietBaiLam = [];

      for (const cauHoiItem of cauHois) {
        const cauHoi = cauHoiItem.cauhoi;
        if (!cauHoi) continue;

        const dapAns = cauHoi.dapan || [];
        maxDiem += 1; // Mỗi câu 1 điểm

        // Random chọn đáp án
        let selectedDapAn = null;
        let laDung = false;
        let noiDungTraLoi = null;

        // Xác định loại câu hỏi để tạo câu trả lời phù hợp
        switch (cauHoi.LoaiCauHoi) {
          case "TRAC_NGHIEM_MOT_DAP_AN":
          case "DUNG_SAI":
          case "TRAC_NGHIEM_NHIEU_DAP_AN": {
            // Chọn ngẫu nhiên 1 đáp án
            const dapAnDung = dapAns.filter((d) => d.LaDapAnDung === true);
            const dapAnSai = dapAns.filter((d) => d.LaDapAnDung !== true);

            // 70% chọn đúng, 30% chọn sai
            let selected;
            if (Math.random() > 0.3 && dapAnDung.length > 0) {
              selected = dapAnDung[Math.floor(Math.random() * dapAnDung.length)];
              laDung = true;
            } else if (dapAnSai.length > 0) {
              selected = dapAnSai[Math.floor(Math.random() * dapAnSai.length)];
              laDung = false;
            } else {
              selected = dapAns[Math.floor(Math.random() * dapAns.length)];
              laDung = selected?.LaDapAnDung || false;
            }
            selectedDapAn = selected?.DapAnID || null;
            break;
          }

          case "DIEN_VAO_CHO_TRONG": {
            // Chọn từ đúng hoặc sai
            const dapAnDung = dapAns.filter((d) => d.LaDapAnDung === true);
            if (dapAnDung.length > 0 && Math.random() > 0.3) {
              const selected = dapAnDung[Math.floor(Math.random() * dapAnDung.length)];
              noiDungTraLoi = selected.NoiDungText;
              laDung = true;
            } else {
              noiDungTraLoi = `Sai ${Math.random().toString(36).substring(7)}`;
              laDung = false;
            }
            break;
          }

          case "SAP_XEP": {
            // Sắp xếp đúng hoặc sai
            const sorted = [...dapAns].sort((a, b) => (a.ThuTuHienThi || 0) - (b.ThuTuHienThi || 0));
            if (Math.random() > 0.3) {
              noiDungTraLoi = sorted.map((d) => d.NoiDungText).join(" ");
              laDung = true;
            } else {
              const shuffled = [...sorted].sort(() => 0.5 - Math.random());
              noiDungTraLoi = shuffled.map((d) => d.NoiDungText).join(" ");
              laDung = false;
            }
            break;
          }

          case "NOI_CAP": {
            // Nối đúng hoặc sai
            const dapAnTrai = dapAns.filter((d) => d.GiaTriKhop !== null);
            if (dapAnTrai.length > 0 && Math.random() > 0.3) {
              const selected = dapAnTrai[Math.floor(Math.random() * dapAnTrai.length)];
              const dapAnPhai = dapAns.find((d) => d.NoiDungText === selected.GiaTriKhop);
              if (dapAnPhai) {
                noiDungTraLoi = `${selected.NoiDungText} → ${dapAnPhai.NoiDungText}`;
                laDung = true;
              }
            } else {
              noiDungTraLoi = "Nối sai";
              laDung = false;
            }
            break;
          }

          default: {
            // Mặc định
            noiDungTraLoi = "Câu trả lời mẫu";
            laDung = Math.random() > 0.3;
            break;
          }
        }

        // Cộng điểm nếu đúng
        if (laDung) tongDiem++;

        chiTietBaiLam.push({
          CauHoiID: cauHoi.CauHoiID,
          DapAnID: selectedDapAn,
          NoiDungTraLoi: noiDungTraLoi,
          LaDung: laDung,
        });
      }

      // Tạo bài làm
      const baiLam = await db.bailam.create({
        data: {
          BaiKiemTraID: baiKiemTra.BaiKiemTraID,
          HocVienID: hvLop.HocVienID,
          LopHocID: hvLop.LopHocID,
          ThoiGianBatDau: thoiGianBatDau,
          ThoiGianNop: thoiGianNop,
          TongDiem: tongDiem,
          TrangThai: Math.random() > 0.9 ? bailam_TrangThai.DANG_LAM : bailam_TrangThai.DA_NOP,
        },
      });

      totalBaiLam++;

      // Tạo chi tiết bài làm
      for (const chiTiet of chiTietBaiLam) {
        await db.bailam_chitiet.create({
          data: {
            BaiLamID: baiLam.BaiLamID,
            CauHoiID: chiTiet.CauHoiID,
            DapAnID: chiTiet.DapAnID,
            NoiDungTraLoi: chiTiet.NoiDungTraLoi,
            LaDung: chiTiet.LaDung,
          },
        });
        totalBaiLamChiTiet++;
      }

      console.log(
        `   Học viên ${hvLop.hocvien?.taikhoan?.HoVaTen || "Unknown"} đã làm bài, điểm: ${tongDiem}/${maxDiem}`
      );
    }
  }

  console.log("\n Hoàn thành: Module 9 - Bài Làm.");
  console.log(`📊 Tổng kết:`);
  console.log(`   - ${totalBaiLam} bài làm`);
  console.log(`   - ${totalBaiLamChiTiet} chi tiết bài làm`);
}