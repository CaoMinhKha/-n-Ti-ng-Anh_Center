// src/modules/auth/services/auth.service.ts

import { prisma } from '../../../config/prisma.js';
import { hashPassword, comparePassword } from '../utils/bcrypt.util.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.util.js';
import { AppError } from '../../../middleware/error.middleware.js';
import { OTPService } from './otp.service.js';
import { sendOTPEmail, sendWelcomeEmail, sendPasswordResetSuccessEmail } from './email.service.js';
import {
  RegisterDto,
  LoginDto,
  VerifyEmailDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
  RefreshTokenDto,
} from '../dto/index.js';

const otpService = new OTPService();

export class AuthService {
  /**
   * Đăng ký tài khoản học viên mới
   */
//   async register(data: RegisterDto) {
//     const { email, password, hoVaTen, ngaySinh, gioiTinh } = data;

//     // Kiểm tra email đã tồn tại
//     const existingUser = await prisma.taikhoan.findUnique({
//       where: { Email: email },
//     });

//     if (existingUser) {
//       throw new AppError('Email đã được sử dụng', 409);
//     }

//     // Hash mật khẩu
//     const hashedPassword = await hashPassword(password);

//     // Tạo tài khoản với role HOC_VIEN
//     const user = await prisma.taikhoan.create({
//       data: {
//         Email: email,
//         MatKhauHash: hashedPassword,
//         HoVaTen: hoVaTen,
//         NgaySinh: ngaySinh || null,
//         GioiTinh: gioiTinh || 'KHAC',
//         VaiTro: 'HOC_VIEN',
//         TrangThai: 'CHO_XAC_THUC',
//       },
//     });

//     // Tạo bản ghi học viên
//     const lastStudent = await prisma.hocvien.findFirst({
//       orderBy: { HocVienID: 'desc' },
//       select: { MaHocVien: true },
//     });

//     let nextNumber = 1;
//     if (lastStudent?.MaHocVien) {
//       const num = parseInt(lastStudent.MaHocVien.replace('HV', ''));
//       if (!isNaN(num)) nextNumber = num + 1;
//     }
//     const maHocVien = `HV${String(nextNumber).padStart(6, '0')}`;

//     await prisma.hocvien.create({
//       data: {
//         TaiKhoanID: user.TaiKhoanID,
//         MaHocVien: maHocVien,
//       },
//     });

//     // Tạo OTP
//     const otp = await otpService.createOTP(user.TaiKhoanID, 'DANG_KY');

//     // Gửi email OTP
//     await sendOTPEmail(email, otp, 'DANG_KY');

//     return {
//       message: 'Đăng ký thành công. Vui lòng kiểm tra email để xác thực.',
//       userId: user.TaiKhoanID,
//       email: user.Email,
//     };
//   }
 /**
   * Đăng ký tài khoản học viên mới
   */
  async register(data: RegisterDto) {
    try {
      console.log('📝 [Register] Bắt đầu đăng ký:', data.email);

      const { email, password, hoVaTen, ngaySinh, gioiTinh } = data;

      // Kiểm tra email đã tồn tại
      console.log('🔍 [Register] Kiểm tra email tồn tại...');
      const existingUser = await prisma.taikhoan.findUnique({
        where: { Email: email },
      });

      if (existingUser) {
        console.log('❌ [Register] Email đã tồn tại:', email);
        throw new AppError('Email đã được sử dụng', 409);
      }

      // Hash mật khẩu
      console.log('🔐 [Register] Hash mật khẩu...');
      const hashedPassword = await hashPassword(password);

      // Tạo tài khoản
      console.log('👤 [Register] Tạo tài khoản...');
      const user = await prisma.taikhoan.create({
        data: {
          Email: email,
          MatKhauHash: hashedPassword,
          HoVaTen: hoVaTen,
          NgaySinh: ngaySinh || null,
          GioiTinh: gioiTinh || 'KHAC',
          VaiTro: 'HOC_VIEN',
          TrangThai: 'CHO_XAC_THUC',
        },
      });
      console.log(' [Register] Đã tạo tài khoản ID:', user.TaiKhoanID);

      // Tạo bản ghi học viên
      console.log('📚 [Register] Tạo bản ghi học viên...');
      const lastStudent = await prisma.hocvien.findFirst({
        orderBy: { HocVienID: 'desc' },
        select: { MaHocVien: true },
      });

      let nextNumber = 1;
      if (lastStudent?.MaHocVien) {
        const num = parseInt(lastStudent.MaHocVien.replace('HV', ''));
        if (!isNaN(num)) nextNumber = num + 1;
      }
      const maHocVien = `HV${String(nextNumber).padStart(6, '0')}`;

      await prisma.hocvien.create({
        data: {
          TaiKhoanID: user.TaiKhoanID,
          MaHocVien: maHocVien,
        },
      });
      console.log(' [Register] Đã tạo học viên mã:', maHocVien);

      // Tạo OTP
      console.log('📧 [Register] Tạo OTP...');
      const otp = await otpService.createOTP(user.TaiKhoanID, 'DANG_KY');
      console.log(' [Register] OTP đã tạo:', otp);

      // Gửi email OTP
      console.log('📨 [Register] Gửi email OTP...');
      await sendOTPEmail(email, otp, 'DANG_KY');
      console.log(' [Register] Đã gửi email OTP');

      return {
        message: 'Đăng ký thành công. Vui lòng kiểm tra email để xác thực.',
        userId: user.TaiKhoanID,
        email: user.Email,
      };
    } catch (error) {
      console.error('❌ [Register] Lỗi:', error);
      throw error;
    }
  }

  /**
   * Xác thực email
   */
  async verifyEmail(data: VerifyEmailDto) {
    const { email, otp } = data;

    // Tìm user
    const user = await prisma.taikhoan.findUnique({
      where: { Email: email },
    });

    if (!user) {
      throw new AppError('Email không tồn tại', 404);
    }

    if (user.EmailVerifiedAt) {
      throw new AppError('Email đã được xác thực', 400);
    }

    // Xác thực OTP
    await otpService.verifyOTP(user.TaiKhoanID, otp, 'DANG_KY');

    // Cập nhật user
    await prisma.taikhoan.update({
      where: { TaiKhoanID: user.TaiKhoanID },
      data: {
        EmailVerifiedAt: new Date(),
        TrangThai: 'HOAT_DONG',
      },
    });

    // Gửi email chào mừng
    await sendWelcomeEmail(email, user.HoVaTen);

    return {
      message: 'Xác thực email thành công',
    };
  }

  /**
   * Gửi lại OTP
   */
  async resendOTP(email: string, type: 'DANG_KY' | 'QUEN_MAT_KHAU') {
    // Tìm user
    const user = await prisma.taikhoan.findUnique({
      where: { Email: email },
    });

    if (!user) {
      throw new AppError('Email không tồn tại', 404);
    }

    if (type === 'DANG_KY' && user.EmailVerifiedAt) {
      throw new AppError('Email đã được xác thực', 400);
    }

    // Tạo OTP mới
    const otp = await otpService.createOTP(user.TaiKhoanID, type);

    // Gửi email
    await sendOTPEmail(email, otp, type);

    return {
      message: 'Đã gửi lại mã OTP. Vui lòng kiểm tra email.',
    };
  }

  /**
   * Đăng nhập
   */
  async login(data: LoginDto) {
    const { email, password } = data;

    // Tìm user
    const user = await prisma.taikhoan.findUnique({
      where: { Email: email },
    });
    

    if (!user) {
      throw new AppError('Email hoặc mật khẩu không đúng', 401);
    }

    // Kiểm tra mật khẩu
    const isValid = await comparePassword(password, user.MatKhauHash);
    if (!isValid) {
      throw new AppError('Email hoặc mật khẩu không đúng', 401);
    }

    // Kiểm tra trạng thái
    if (user.TrangThai === 'KHOA') {
      throw new AppError('Tài khoản đã bị khóa', 403);
    }

    if (user.TrangThai === 'CHO_XAC_THUC' && !user.EmailVerifiedAt) {
      throw new AppError('Email chưa được xác thực. Vui lòng kiểm tra email.', 403);
    }

    // Tạo token
    const accessToken = generateAccessToken({
      userId: user.TaiKhoanID,
      email: user.Email,
      role: user.VaiTro,
    });

    const refreshToken = generateRefreshToken({
      userId: user.TaiKhoanID,
    });

    // Lưu refresh token
    await prisma.taikhoan.update({
      where: { TaiKhoanID: user.TaiKhoanID },
      data: {
        RefreshToken: refreshToken,
        RefreshTokenExpireAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.TaiKhoanID,
        email: user.Email,
        hoVaTen: user.HoVaTen,
        vaiTro: user.VaiTro,
        avatarUrl: user.AvatarUrl,
      },
    };
  }

  /**
   * Làm mới Access Token
   */
  async refreshToken(data: RefreshTokenDto) {
    const { refreshToken } = data;

    // Xác thực refresh token
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      throw new AppError('Refresh token không hợp lệ', 401);
    }

    // Tìm user
    const user = await prisma.taikhoan.findUnique({
      where: { TaiKhoanID: decoded.userId },
    });

    if (!user) {
      throw new AppError('User không tồn tại', 404);
    }

    // Kiểm tra refresh token có khớp không
    if (user.RefreshToken !== refreshToken) {
      throw new AppError('Refresh token không hợp lệ', 401);
    }

    // Kiểm tra hạn
    if (user.RefreshTokenExpireAt && user.RefreshTokenExpireAt < new Date()) {
      throw new AppError('Refresh token đã hết hạn', 401);
    }

    // Tạo access token mới
    const newAccessToken = generateAccessToken({
      userId: user.TaiKhoanID,
      email: user.Email,
      role: user.VaiTro,
    });

    return {
      accessToken: newAccessToken,
    };
  }

  /**
   * Đăng xuất
   */
  async logout(userId: number) {
    // Xóa refresh token
    await prisma.taikhoan.update({
      where: { TaiKhoanID: userId },
      data: {
        RefreshToken: null,
        RefreshTokenExpireAt: null,
      },
    });

    return {
      message: 'Đăng xuất thành công',
    };
  }

  /**
   * Quên mật khẩu
   */
  async forgotPassword(data: ForgotPasswordDto) {
    const { email } = data;

    // Tìm user
    const user = await prisma.taikhoan.findUnique({
      where: { Email: email },
    });

    if (!user) {
      throw new AppError('Email không tồn tại', 404);
    }

    // Tạo OTP
    const otp = await otpService.createOTP(user.TaiKhoanID, 'QUEN_MAT_KHAU');

    // Gửi email
    await sendOTPEmail(email, otp, 'QUEN_MAT_KHAU');

    return {
      message: 'Đã gửi email đặt lại mật khẩu. Vui lòng kiểm tra email.',
    };
  }

  /**
   * Đặt lại mật khẩu
   */
  async resetPassword(data: ResetPasswordDto) {
    const { email, otp, newPassword } = data;

    // Tìm user
    const user = await prisma.taikhoan.findUnique({
      where: { Email: email },
    });

    if (!user) {
      throw new AppError('Email không tồn tại', 404);
    }

    // Xác thực OTP
    await otpService.verifyOTP(user.TaiKhoanID, otp, 'QUEN_MAT_KHAU');

    // Hash mật khẩu mới
    const hashedPassword = await hashPassword(newPassword);

    // Cập nhật mật khẩu
    await prisma.taikhoan.update({
      where: { TaiKhoanID: user.TaiKhoanID },
      data: {
        MatKhauHash: hashedPassword,
        RefreshToken: null,
        RefreshTokenExpireAt: null,
      },
    });

    // Gửi email thông báo
    await sendPasswordResetSuccessEmail(email);

    return {
      message: 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.',
    };
  }

  /**
   * Đổi mật khẩu (khi đã đăng nhập)
   */
  async changePassword(userId: number, data: ChangePasswordDto) {
    const { oldPassword, newPassword } = data;

    // Tìm user
    const user = await prisma.taikhoan.findUnique({
      where: { TaiKhoanID: userId },
    });

    if (!user) {
      throw new AppError('User không tồn tại', 404);
    }

    // Kiểm tra mật khẩu cũ
    const isValid = await comparePassword(oldPassword, user.MatKhauHash);
    if (!isValid) {
      throw new AppError('Mật khẩu cũ không đúng', 400);
    }

    // Hash mật khẩu mới
    const hashedPassword = await hashPassword(newPassword);

    // Cập nhật mật khẩu
    await prisma.taikhoan.update({
      where: { TaiKhoanID: userId },
      data: {
        MatKhauHash: hashedPassword,
      },
    });

    return {
      message: 'Đổi mật khẩu thành công',
    };
  }

/**
 * Lấy thông tin user hiện tại
 */
async getMe(userId: number) {
  const user = await prisma.taikhoan.findUnique({
    where: { TaiKhoanID: userId },
    select: {
      TaiKhoanID: true,
      Email: true,
      HoVaTen: true,
      NgaySinh: true,
      GioiTinh: true,
      AvatarUrl: true,
      VaiTro: true,
      TrangThai: true,
      EmailVerifiedAt: true,
      CreatedAt: true,
    },
  });

  if (!user) {
    throw new AppError('User không tồn tại', 404);
  }

  // Lấy thêm thông tin role cụ thể
  let roleInfo = null;
  if (user.VaiTro === 'HOC_VIEN') {
    const hocVien = await prisma.hocvien.findUnique({
      where: { TaiKhoanID: userId },
    });
    if (hocVien) {
      roleInfo = {
        maHocVien: hocVien.MaHocVien,
      };
    }
  } else if (user.VaiTro === 'GIAO_VIEN') {
    const giaoVien = await prisma.giaovien.findUnique({
      where: { TaiKhoanID: userId },
    });
    if (giaoVien) {
      roleInfo = {
        maGiaoVien: giaoVien.MaGiaoVien,
      };
    }
  }

  //  Trả về camelCase
  return {
    taiKhoanID: user.TaiKhoanID,
    email: user.Email,
    hoVaTen: user.HoVaTen,
    ngaySinh: user.NgaySinh,
    gioiTinh: user.GioiTinh,
    avatarUrl: user.AvatarUrl,
    vaiTro: user.VaiTro,
    trangThai: user.TrangThai,
    emailVerifiedAt: user.EmailVerifiedAt,
    createdAt: user.CreatedAt,
    roleInfo,
  };}
}