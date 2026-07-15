// prisma/seeds/module7_lichhoc.seed.ts

import {
  PrismaClient,
  lichhoc_TrangThai,
  buoihoc_TrangThai,
  cahoc_TrangThai,
  phonghoc_TrangThai,
} from "../../src/generated/prisma/client.js";

export async function seedModule7LichHoc(
  db: InstanceType<typeof PrismaClient>
): Promise<void> {
  console.log("🌱 [Prisma 7] Đang nạp dữ liệu: Module 7 - Lịch Học...");

  // ==================================================
  // 1. Tạo Ca Học
  // ==================================================

  const caHocData = [
    {
      MaCa: "SANG",
      TenCa: "Ca sáng",
      GioBatDau: new Date("1970-01-01T07:30:00"),
      GioKetThuc: new Date("1970-01-01T09:30:00"),
      TrangThai: cahoc_TrangThai.HOAT_DONG,
    },
    {
      MaCa: "CHIEU",
      TenCa: "Ca chiều",
      GioBatDau: new Date("1970-01-01T14:00:00"),
      GioKetThuc: new Date("1970-01-01T16:00:00"),
      TrangThai: cahoc_TrangThai.HOAT_DONG,
    },
    {
      MaCa: "TOI",
      TenCa: "Ca tối",
      GioBatDau: new Date("1970-01-01T18:30:00"),
      GioKetThuc: new Date("1970-01-01T20:30:00"),
      TrangThai: cahoc_TrangThai.HOAT_DONG,
    },
  ];

  const createdCaHocs = [];

  for (const item of caHocData) {
    const caHoc = await db.cahoc.upsert({
      where: { MaCa: item.MaCa },
      update: {
        TenCa: item.TenCa,
        GioBatDau: item.GioBatDau,
        GioKetThuc: item.GioKetThuc,
        TrangThai: item.TrangThai,
      },
      create: {
        MaCa: item.MaCa,
        TenCa: item.TenCa,
        GioBatDau: item.GioBatDau,
        GioKetThuc: item.GioKetThuc,
        TrangThai: item.TrangThai,
      },
    });
    createdCaHocs.push(caHoc);
    console.log(` Đã tạo ca học: ${caHoc.TenCa} (${caHoc.MaCa})`);
  }

  // ==================================================
  // 2. Tạo Phòng Học
  // ==================================================

  const phongHocData = [
    { MaPhong: "P101", TenPhong: "Phòng 101", SucChua: 30, ToaNha: "Tòa A", TrangThai: phonghoc_TrangThai.TRONG },
    { MaPhong: "P102", TenPhong: "Phòng 102", SucChua: 25, ToaNha: "Tòa A", TrangThai: phonghoc_TrangThai.TRONG },
    { MaPhong: "P103", TenPhong: "Phòng 103", SucChua: 20, ToaNha: "Tòa A", TrangThai: phonghoc_TrangThai.TRONG },
    { MaPhong: "P201", TenPhong: "Phòng 201", SucChua: 35, ToaNha: "Tòa B", TrangThai: phonghoc_TrangThai.TRONG },
    { MaPhong: "P202", TenPhong: "Phòng 202", SucChua: 25, ToaNha: "Tòa B", TrangThai: phonghoc_TrangThai.TRONG },
    { MaPhong: "P203", TenPhong: "Phòng 203", SucChua: 20, ToaNha: "Tòa B", TrangThai: phonghoc_TrangThai.TRONG },
    { MaPhong: "Online", TenPhong: "Phòng học Online", SucChua: 50, ToaNha: "Online", TrangThai: phonghoc_TrangThai.TRONG },
  ];

  const createdPhongHocs = [];

  for (const item of phongHocData) {
    const phongHoc = await db.phonghoc.upsert({
      where: { MaPhong: item.MaPhong },
      update: {
        TenPhong: item.TenPhong,
        SucChua: item.SucChua,
        ToaNha: item.ToaNha,
        TrangThai: item.TrangThai,
      },
      create: {
        MaPhong: item.MaPhong,
        TenPhong: item.TenPhong,
        SucChua: item.SucChua,
        ToaNha: item.ToaNha,
        TrangThai: item.TrangThai,
      },
    });
    createdPhongHocs.push(phongHoc);
    console.log(` Đã tạo phòng học: ${phongHoc.TenPhong} (${phongHoc.MaPhong})`);
  }

  // ==================================================
  // 3. Lấy danh sách lớp học và tạo Lịch học
  // ==================================================

  const lopHocs = await db.lophoc.findMany({
    where: {
      TrangThai: {
        in: ["SAP_KHAI_GIANG", "DANG_HOC"],
      },
    },
  });

  if (lopHocs.length === 0) {
    console.warn("⚠️ Không có lớp học nào đang mở hoặc sắp khai giảng!");
  }

  console.log(`\n📚 Đang tạo lịch học cho ${lopHocs.length} lớp...`);

  // Map để lưu lịch học đã tạo
  const lichHocMap: Record<string, any> = {};

  for (const lopHoc of lopHocs) {
    // Xác định lịch học dựa trên tên lớp
    let thuTrongTuan = 2; // Mặc định thứ 2
    let maCa = "SANG";
    let maPhong = "P101";

    if (lopHoc.TenLopHoc.includes("Sáng")) {
      maCa = "SANG";
    } else if (lopHoc.TenLopHoc.includes("Chiều")) {
      maCa = "CHIEU";
    } else if (lopHoc.TenLopHoc.includes("Tối")) {
      maCa = "TOI";
    }

    if (lopHoc.TenLopHoc.includes("T2-T4")) {
      thuTrongTuan = 2; // Thứ 2
    } else if (lopHoc.TenLopHoc.includes("T3-T5")) {
      thuTrongTuan = 3; // Thứ 3
    } else if (lopHoc.TenLopHoc.includes("T7")) {
      thuTrongTuan = 7; // Thứ 7
    }

    if (lopHoc.TenLopHoc.includes("Online")) {
      maPhong = "Online";
    } else if (lopHoc.TenLopHoc.includes("P101")) {
      maPhong = "P101";
    } else if (lopHoc.TenLopHoc.includes("P102")) {
      maPhong = "P102";
    } else if (lopHoc.TenLopHoc.includes("P201")) {
      maPhong = "P201";
    }

    // Tìm ca học
    const caHoc = createdCaHocs.find((c) => c.MaCa === maCa);
    if (!caHoc) continue;

    // Tìm phòng học
    const phongHoc = createdPhongHocs.find((p) => p.MaPhong === maPhong);
    if (!phongHoc) continue;

    // Tạo lịch học
    const lichHocKey = `${lopHoc.LopHocID}_${thuTrongTuan}`;

    if (!lichHocMap[lichHocKey]) {
      const lichHoc = await db.lichhoc.create({
        data: {
          LopHocID: lopHoc.LopHocID,
          ThuTrongTuan: thuTrongTuan,
          CaHocID: caHoc.CaHocID,
          PhongHocID: phongHoc.PhongHocID,
          NgayApDung: lopHoc.NgayBatDau,
          NgayKetThuc: lopHoc.NgayKetThuc,
          TrangThai: lichhoc_TrangThai.HOAT_DONG,
        },
      });
      lichHocMap[lichHocKey] = lichHoc;
      console.log(`   Đã tạo lịch học: ${lopHoc.TenLopHoc} - Thứ ${thuTrongTuan} - ${caHoc.TenCa} - ${phongHoc.TenPhong}`);
    }

    // ==================================================
    // 4. Tạo Buổi học từ Lịch học
    // ==================================================

    const lichHoc = lichHocMap[lichHocKey];
    if (!lichHoc) continue;

    // Tạo các buổi học từ ngày bắt đầu đến ngày kết thúc
    const startDate = new Date(lopHoc.NgayBatDau);
    const endDate = new Date(lopHoc.NgayKetThuc);

    let currentDate = new Date(startDate);
    let buoiHocCount = 0;

    while (currentDate <= endDate) {
      // Kiểm tra xem ngày hiện tại có đúng thứ trong tuần không
      if (currentDate.getDay() === thuTrongTuan) {
        // Kiểm tra buổi học đã tồn tại chưa
        const existingBuoiHoc = await db.buoihoc.findFirst({
          where: {
            LopHocID: lopHoc.LopHocID,
            LichHocID: lichHoc.LichHocID,
            CaHocID: caHoc.CaHocID,
            NgayHoc: currentDate,
          },
        });

        if (!existingBuoiHoc) {
          // Xác định trạng thái buổi học
          let trangThai: buoihoc_TrangThai = buoihoc_TrangThai.CHUA_HOC;
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          if (currentDate < today) {
            trangThai = buoihoc_TrangThai.DA_HOC;
          } else if (currentDate.getTime() === today.getTime()) {
            trangThai = buoihoc_TrangThai.DANG_HOC;
          }

          await db.buoihoc.create({
            data: {
              LopHocID: lopHoc.LopHocID,
              LichHocID: lichHoc.LichHocID,
              CaHocID: caHoc.CaHocID,
              PhongHocID: phongHoc.PhongHocID,
              NgayHoc: currentDate,
              TrangThai: trangThai,
            },
          });
          buoiHocCount++;
        }
      }

      // Tăng ngày lên 1
      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (buoiHocCount > 0) {
      console.log(`    📅 Đã tạo ${buoiHocCount} buổi học cho ${lopHoc.TenLopHoc}`);
    }
  }

  console.log("\n Hoàn thành: Module 7 - Lịch Học.");
  console.log(`📊 Tổng kết:`);
  console.log(`   - ${createdCaHocs.length} ca học`);
  console.log(`   - ${createdPhongHocs.length} phòng học`);
  console.log(`   - ${Object.keys(lichHocMap).length} lịch học`);
}