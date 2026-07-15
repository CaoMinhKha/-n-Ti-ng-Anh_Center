// prisma/seeds/module2_taikhoan.seed.ts

import { 
  PrismaClient,
  taikhoan_VaiTro,
  taikhoan_TrangThai,
  taikhoan_GioiTinh,
  otp_xacthuc_LoaiOTP,
} from "../../src/generated/prisma/client.js";
import * as bcrypt from "bcrypt";

export async function seedModule2TaiKhoan(
  db: InstanceType<typeof PrismaClient>
): Promise<void> {
  console.log("🌱 [Prisma 7] Đang nạp dữ liệu: Module 2 - Tài Khoản...");

  const saltRounds = 10;

  // ==================================================
  // 1. Tạo tài khoản ADMIN
  // ==================================================
  const adminPasswordHash = await bcrypt.hash("Admin@123", saltRounds);
  
  const admin = await db.taikhoan.upsert({
    where: {
      Email: "admin@caothang.edu.vn",
    },
    update: {},
    create: {
      Email: "admin@caothang.edu.vn",
      MatKhauHash: adminPasswordHash,
      VaiTro: taikhoan_VaiTro.ADMIN,
      HoVaTen: "Nguyễn Văn Admin",
      NgaySinh: new Date("1990-01-15"),
      GioiTinh: taikhoan_GioiTinh.NAM,
      AvatarUrl: "https://avatar.example.com/admin.jpg",
      EmailVerifiedAt: new Date(),
      TrangThai: taikhoan_TrangThai.HOAT_DONG,
      IsDeleted: false,
    },
  });
  console.log(` Đã tạo Admin: ${admin.Email}`);

  // ==================================================
  // 2. Tạo 5 Giáo viên
  // ==================================================
  const teacherPasswordHash = await bcrypt.hash("Teacher@123", saltRounds);
  
  const teacherNames = [
    { fullName: "Lê Viết Hoàng Nguyên", gender: taikhoan_GioiTinh.NAM, dob: new Date("1985-03-15") },
    { fullName: "Nguyễn Thị Minh Tâm", gender: taikhoan_GioiTinh.NU, dob: new Date("1988-07-20") },
    { fullName: "Trần Văn Hùng", gender: taikhoan_GioiTinh.NAM, dob: new Date("1983-11-05") },
    { fullName: "Phạm Thị Thanh Hà", gender: taikhoan_GioiTinh.NU, dob: new Date("1990-09-12") },
    { fullName: "Hoàng Văn Đức", gender: taikhoan_GioiTinh.NAM, dob: new Date("1986-05-28") },
  ];

  for (let i = 0; i < teacherNames.length; i++) {
    const teacher = teacherNames[i];
    
    // Tạo email từ tên: lvhnguyen@caothang.edu.vn
    const nameParts = teacher.fullName.toLowerCase().split(" ");
    let emailPrefix = "";
    
    if (nameParts.length >= 3) {
      emailPrefix = nameParts[0][0] + nameParts[1][0] + nameParts[nameParts.length - 1];
    } else if (nameParts.length === 2) {
      emailPrefix = nameParts[0][0] + nameParts[1];
    } else {
      emailPrefix = nameParts[0];
    }
    
    const email = `${emailPrefix}@caothang.edu.vn`;
    const maGiaoVien = String(202400001 + i).padStart(9, "0");

    // Tạo tài khoản
    const account = await db.taikhoan.upsert({
      where: { Email: email },
      update: {},
      create: {
        Email: email,
        MatKhauHash: teacherPasswordHash,
        VaiTro: taikhoan_VaiTro.GIAO_VIEN,
        HoVaTen: teacher.fullName,
        NgaySinh: teacher.dob,
        GioiTinh: teacher.gender,
        AvatarUrl: `https://avatar.example.com/teacher_${i+1}.jpg`,
        EmailVerifiedAt: new Date(),
        TrangThai: taikhoan_TrangThai.HOAT_DONG,
        IsDeleted: false,
      },
    });

    // Tạo thông tin giáo viên
    await db.giaovien.upsert({
      where: { TaiKhoanID: account.TaiKhoanID },
      update: {},
      create: {
        TaiKhoanID: account.TaiKhoanID,
        MaGiaoVien: maGiaoVien,
      },
    });

    console.log(` Đã tạo Giáo viên ${i+1}: ${teacher.fullName} (${email}) - Mã: ${maGiaoVien}`);
  }

  // ==================================================
  // 3. Tạo 30 Học viên
  // ==================================================
  const studentPasswordHash = await bcrypt.hash("Student@123", saltRounds);
  
  const firstNames = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Võ", "Đặng", "Bùi"];
  const middleNames = ["Văn", "Thị", "Minh", "Thanh", "Ngọc", "Quốc", "Hữu", "Kim", "Anh", "Đức"];
  const lastNames = ["An", "Bình", "Cường", "Dũng", "Hà", "Hoa", "Hùng", "Khoa", "Lan", "Mai", 
                     "Nam", "Nguyên", "Phúc", "Quân", "Sơn", "Thảo", "Thu", "Trang", "Tuấn", "Vy"];

  for (let i = 0; i < 30; i++) {
    // Tạo tên ngẫu nhiên
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const middleName = middleNames[Math.floor(Math.random() * middleNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullName = `${firstName} ${middleName} ${lastName}`;
    
    const gender = Math.random() > 0.5 ? taikhoan_GioiTinh.NAM : taikhoan_GioiTinh.NU;
    
    const year = 2000 + Math.floor(Math.random() * 5);
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    const dob = new Date(year, month - 1, day);
    
    const mssv = String(2024000001 + i).padStart(10, "0");
    const email = `${mssv}@caothang.edu.vn`;

    // Tạo tài khoản
    const account = await db.taikhoan.upsert({
      where: { Email: email },
      update: {},
      create: {
        Email: email,
        MatKhauHash: studentPasswordHash,
        VaiTro: taikhoan_VaiTro.HOC_VIEN,
        HoVaTen: fullName,
        NgaySinh: dob,
        GioiTinh: gender,
        AvatarUrl: `https://avatar.example.com/student_${i+1}.jpg`,
        EmailVerifiedAt: new Date(),
        TrangThai: taikhoan_TrangThai.HOAT_DONG,
        IsDeleted: false,
      },
    });

    // Tạo thông tin học viên
    await db.hocvien.upsert({
      where: { TaiKhoanID: account.TaiKhoanID },
      update: {},
      create: {
        TaiKhoanID: account.TaiKhoanID,
        MaHocVien: mssv,
      },
    });

    if ((i + 1) % 5 === 0 || i === 29) {
      console.log(` Đã tạo ${i + 1}/30 học viên...`);
    }
  }

  // ==================================================
  // 4. Tạo OTP cho một số tài khoản
  // ==================================================
  
  // OTP cho Admin
  await db.otp_xacthuc.createMany({
    data: [
      {
        TaiKhoanID: admin.TaiKhoanID,
        LoaiOTP: otp_xacthuc_LoaiOTP.DANG_KY,
        MaOTP: "123456",
        DaSuDung: true,
        NgayHetHan: new Date(Date.now() + 5 * 60 * 1000),
        VoHieuHoa: false,
      },
      {
        TaiKhoanID: admin.TaiKhoanID,
        LoaiOTP: otp_xacthuc_LoaiOTP.QUEN_MAT_KHAU,
        MaOTP: "654321",
        DaSuDung: false,
        NgayHetHan: new Date(Date.now() + 5 * 60 * 1000),
        VoHieuHoa: false,
      },
    ],
    skipDuplicates: true,
  });

  // OTP cho Giáo viên đầu tiên
  const firstTeacher = await db.taikhoan.findFirst({
    where: { VaiTro: taikhoan_VaiTro.GIAO_VIEN },
  });

  if (firstTeacher) {
    await db.otp_xacthuc.createMany({
      data: [
        {
          TaiKhoanID: firstTeacher.TaiKhoanID,
          LoaiOTP: otp_xacthuc_LoaiOTP.DANG_KY,
          MaOTP: "111111",
          DaSuDung: true,
          NgayHetHan: new Date(Date.now() + 5 * 60 * 1000),
          VoHieuHoa: false,
        },
      ],
      skipDuplicates: true,
    });
  }

  // OTP cho Học viên đầu tiên
  const firstStudent = await db.taikhoan.findFirst({
    where: { VaiTro: taikhoan_VaiTro.HOC_VIEN },
  });

  if (firstStudent) {
    await db.otp_xacthuc.createMany({
      data: [
        {
          TaiKhoanID: firstStudent.TaiKhoanID,
          LoaiOTP: otp_xacthuc_LoaiOTP.DANG_KY,
          MaOTP: "333333",
          DaSuDung: true,
          NgayHetHan: new Date(Date.now() + 5 * 60 * 1000),
          VoHieuHoa: false,
        },
      ],
      skipDuplicates: true,
    });
  }

  // ==================================================
  // 5. Tạo tài khoản đặc biệt
  // ==================================================
  
  // 5.1 Tài khoản chưa xác thực
  const unverifiedPasswordHash = await bcrypt.hash("Unverified@123", saltRounds);
  const unverifiedMSSV = "2024000031";
  
  await db.taikhoan.upsert({
    where: { Email: `${unverifiedMSSV}@caothang.edu.vn` },
    update: {},
    create: {
      Email: `${unverifiedMSSV}@caothang.edu.vn`,
      MatKhauHash: unverifiedPasswordHash,
      VaiTro: taikhoan_VaiTro.HOC_VIEN,
      HoVaTen: "Nguyễn Văn Chưa Xác Thực",
      NgaySinh: new Date("2001-05-10"),
      GioiTinh: taikhoan_GioiTinh.NAM,
      EmailVerifiedAt: null,
      TrangThai: taikhoan_TrangThai.CHO_XAC_THUC,
      IsDeleted: false,
    },
  });

  // 5.2 Tài khoản bị khóa
  const lockedPasswordHash = await bcrypt.hash("Locked@123", saltRounds);
  const lockedMSSV = "2024000032";
  
  await db.taikhoan.upsert({
    where: { Email: `${lockedMSSV}@caothang.edu.vn` },
    update: {},
    create: {
      Email: `${lockedMSSV}@caothang.edu.vn`,
      MatKhauHash: lockedPasswordHash,
      VaiTro: taikhoan_VaiTro.HOC_VIEN,
      HoVaTen: "Trần Văn Bị Khóa",
      NgaySinh: new Date("1999-08-20"),
      GioiTinh: taikhoan_GioiTinh.NAM,
      EmailVerifiedAt: new Date(),
      TrangThai: taikhoan_TrangThai.KHOA,
      IsDeleted: false,
    },
  });

  // 5.3 Tài khoản đã xóa mềm
  const deletedPasswordHash = await bcrypt.hash("Deleted@123", saltRounds);
  const deletedMSSV = "2024000033";
  
  await db.taikhoan.upsert({
    where: { Email: `${deletedMSSV}@caothang.edu.vn` },
    update: {},
    create: {
      Email: `${deletedMSSV}@caothang.edu.vn`,
      MatKhauHash: deletedPasswordHash,
      VaiTro: taikhoan_VaiTro.HOC_VIEN,
      HoVaTen: "Lê Thị Đã Xóa",
      NgaySinh: new Date("2000-12-25"),
      GioiTinh: taikhoan_GioiTinh.NU,
      EmailVerifiedAt: new Date(),
      TrangThai: taikhoan_TrangThai.HOAT_DONG,
      IsDeleted: true,
    },
  });

  console.log(" Hoàn thành: Module 2 - Tài Khoản.");
}