// src/modules/auth/utils/otp.util.ts

/**
 * Tạo mã OTP ngẫu nhiên 6 chữ số
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Kiểm tra OTP có hợp lệ không (đúng 6 chữ số)
 */
export function isValidOTP(otp: string): boolean {
  return /^\d{6}$/.test(otp);
}

/**
 * Lấy thời gian hết hạn OTP (mặc định 5 phút)
 */
export function getOTPExpiry(minutes: number = 5): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}