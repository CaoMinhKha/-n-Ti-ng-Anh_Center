// src/modules/auth/services/otp.service.ts

import { prisma } from '../../../config/prisma.js';
import { generateOTP, getOTPExpiry } from '../utils/otp.util.js';
import { AppError } from '../../../middleware/error.middleware.js';

export class OTPService {
  /**
   * Tạo OTP mới cho user
   */
  async createOTP(
    taiKhoanID: number,
    loaiOTP: 'DANG_KY' | 'QUEN_MAT_KHAU'
  ): Promise<string> {
    // Vô hiệu hóa các OTP cũ chưa dùng
    await prisma.otp_xacthuc.updateMany({
      where: {
        TaiKhoanID: taiKhoanID,
        LoaiOTP: loaiOTP,
        DaSuDung: false,
        VoHieuHoa: false,
      },
      data: {
        VoHieuHoa: true,
      },
    });

    // Tạo OTP mới
    const otp = generateOTP();
    const expiry = getOTPExpiry(5); // 5 phút

    await prisma.otp_xacthuc.create({
      data: {
        TaiKhoanID: taiKhoanID,
        LoaiOTP: loaiOTP,
        MaOTP: otp,
        NgayHetHan: expiry,
        DaSuDung: false,
        VoHieuHoa: false,
      },
    });

    return otp;
  }

  /**
   * Xác thực OTP
   */
  async verifyOTP(
    taiKhoanID: number,
    otp: string,
    loaiOTP: 'DANG_KY' | 'QUEN_MAT_KHAU'
  ): Promise<boolean> {
    const otpRecord = await prisma.otp_xacthuc.findFirst({
      where: {
        TaiKhoanID: taiKhoanID,
        LoaiOTP: loaiOTP,
        MaOTP: otp,
        DaSuDung: false,
        VoHieuHoa: false,
        NgayHetHan: {
          gt: new Date(),
        },
      },
    });

    if (!otpRecord) {
      throw new AppError('Mã OTP không hợp lệ hoặc đã hết hạn', 400);
    }

    // Đánh dấu OTP đã dùng
    await prisma.otp_xacthuc.update({
      where: { OtpID: otpRecord.OtpID },
      data: { DaSuDung: true },
    });

    return true;
  }

  /**
   * Vô hiệu hóa tất cả OTP của user
   */
  async invalidateAllOTP(taiKhoanID: number): Promise<void> {
    await prisma.otp_xacthuc.updateMany({
      where: {
        TaiKhoanID: taiKhoanID,
        DaSuDung: false,
        VoHieuHoa: false,
      },
      data: {
        VoHieuHoa: true,
      },
    });
  }

  /**
   * Kiểm tra user có OTP hợp lệ không
   */
  async hasValidOTP(
    taiKhoanID: number,
    loaiOTP: 'DANG_KY' | 'QUEN_MAT_KHAU'
  ): Promise<boolean> {
    const count = await prisma.otp_xacthuc.count({
      where: {
        TaiKhoanID: taiKhoanID,
        LoaiOTP: loaiOTP,
        DaSuDung: false,
        VoHieuHoa: false,
        NgayHetHan: {
          gt: new Date(),
        },
      },
    });

    return count > 0;
  }
}