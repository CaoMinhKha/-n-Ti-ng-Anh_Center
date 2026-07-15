// prisma/seeds/module5_dotkhaigiang.seed.ts

import {
  PrismaClient,
  dotkhaigiang_TrangThai,
} from "../../src/generated/prisma/client.js";

export async function seedModule5DotKhaiGiang(
  db: InstanceType<typeof PrismaClient>
): Promise<void> {
  console.log("🌱 [Prisma 7] Đang nạp dữ liệu: Module 5 - Đợt Khai Giảng...");

  // ==================================================
  // Dữ liệu Đợt Khai Giảng
  // ==================================================

  const dotKhaiGiangData = [
    {
      MaDot: "DK2024-01",
      TenDot: "Đợt khai giảng tháng 1/2024",
      NgayMoDangKy: new Date("2024-01-01"),
      NgayDongDangKy: new Date("2024-01-15"),
      MoTa: "Đợt khai giảng đầu năm 2024",
      TrangThai: dotkhaigiang_TrangThai.DA_DONG,
    },
    {
      MaDot: "DK2024-02",
      TenDot: "Đợt khai giảng tháng 2/2024",
      NgayMoDangKy: new Date("2024-02-01"),
      NgayDongDangKy: new Date("2024-02-15"),
      MoTa: "Đợt khai giảng tháng 2/2024",
      TrangThai: dotkhaigiang_TrangThai.DA_DONG,
    },
    {
      MaDot: "DK2024-03",
      TenDot: "Đợt khai giảng tháng 3/2024",
      NgayMoDangKy: new Date("2024-03-01"),
      NgayDongDangKy: new Date("2024-03-15"),
      MoTa: "Đợt khai giảng tháng 3/2024",
      TrangThai: dotkhaigiang_TrangThai.DA_DONG,
    },
    {
      MaDot: "DK2024-04",
      TenDot: "Đợt khai giảng tháng 4/2024",
      NgayMoDangKy: new Date("2024-04-01"),
      NgayDongDangKy: new Date("2024-04-15"),
      MoTa: "Đợt khai giảng tháng 4/2024",
      TrangThai: dotkhaigiang_TrangThai.DA_DONG,
    },
    {
      MaDot: "DK2024-05",
      TenDot: "Đợt khai giảng tháng 5/2024",
      NgayMoDangKy: new Date("2024-05-01"),
      NgayDongDangKy: new Date("2024-05-15"),
      MoTa: "Đợt khai giảng tháng 5/2024",
      TrangThai: dotkhaigiang_TrangThai.DA_DONG,
    },
    {
      MaDot: "DK2024-06",
      TenDot: "Đợt khai giảng tháng 6/2024",
      NgayMoDangKy: new Date("2024-06-01"),
      NgayDongDangKy: new Date("2024-06-15"),
      MoTa: "Đợt khai giảng tháng 6/2024",
      TrangThai: dotkhaigiang_TrangThai.DA_DONG,
    },
    {
      MaDot: "DK2024-07",
      TenDot: "Đợt khai giảng tháng 7/2024",
      NgayMoDangKy: new Date("2024-07-01"),
      NgayDongDangKy: new Date("2024-07-15"),
      MoTa: "Đợt khai giảng tháng 7/2024",
      TrangThai: dotkhaigiang_TrangThai.DANG_MO,
    },
    {
      MaDot: "DK2024-08",
      TenDot: "Đợt khai giảng tháng 8/2024",
      NgayMoDangKy: new Date("2024-08-01"),
      NgayDongDangKy: new Date("2024-08-15"),
      MoTa: "Đợt khai giảng tháng 8/2024",
      TrangThai: dotkhaigiang_TrangThai.SAP_MO,
    },
    {
      MaDot: "DK2024-09",
      TenDot: "Đợt khai giảng tháng 9/2024",
      NgayMoDangKy: new Date("2024-09-01"),
      NgayDongDangKy: new Date("2024-09-15"),
      MoTa: "Đợt khai giảng tháng 9/2024",
      TrangThai: dotkhaigiang_TrangThai.SAP_MO,
    },
    {
      MaDot: "DK2024-10",
      TenDot: "Đợt khai giảng tháng 10/2024",
      NgayMoDangKy: new Date("2024-10-01"),
      NgayDongDangKy: new Date("2024-10-15"),
      MoTa: "Đợt khai giảng tháng 10/2024",
      TrangThai: dotkhaigiang_TrangThai.SAP_MO,
    },
    {
      MaDot: "DK2024-11",
      TenDot: "Đợt khai giảng tháng 11/2024",
      NgayMoDangKy: new Date("2024-11-01"),
      NgayDongDangKy: new Date("2024-11-15"),
      MoTa: "Đợt khai giảng tháng 11/2024",
      TrangThai: dotkhaigiang_TrangThai.SAP_MO,
    },
    {
      MaDot: "DK2024-12",
      TenDot: "Đợt khai giảng tháng 12/2024",
      NgayMoDangKy: new Date("2024-12-01"),
      NgayDongDangKy: new Date("2024-12-15"),
      MoTa: "Đợt khai giảng tháng 12/2024",
      TrangThai: dotkhaigiang_TrangThai.SAP_MO,
    },
  ];

  // ==================================================
  // Upsert dữ liệu
  // ==================================================

  for (const item of dotKhaiGiangData) {
    await db.dotkhaigiang.upsert({
      where: { MaDot: item.MaDot },
      update: {
        TenDot: item.TenDot,
        NgayMoDangKy: item.NgayMoDangKy,
        NgayDongDangKy: item.NgayDongDangKy,
        MoTa: item.MoTa,
        TrangThai: item.TrangThai,
      },
      create: {
        MaDot: item.MaDot,
        TenDot: item.TenDot,
        NgayMoDangKy: item.NgayMoDangKy,
        NgayDongDangKy: item.NgayDongDangKy,
        MoTa: item.MoTa,
        TrangThai: item.TrangThai,
      },
    });
  }

  console.log(` Đã tạo ${dotKhaiGiangData.length} đợt khai giảng`);
  console.log(" Hoàn thành: Module 5 - Đợt Khai Giảng.");
}