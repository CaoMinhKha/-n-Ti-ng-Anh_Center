// src/modules/auth/validators/auth.validator.ts

import { z } from 'zod';
import { validate } from '../../../utils/zod-helper.js';

export { validate };

// =============================================
// Zod Schemas
// =============================================

/**
 * Schema đăng ký tài khoản
 */
export const registerSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  hoVaTen: z.string().min(1, 'Họ và tên không được để trống'),
  ngaySinh: z.coerce.date().optional(),
  gioiTinh: z.enum(['NAM', 'NU', 'KHAC']).optional(),
});

/**
 * Schema đăng nhập
 */
export const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(1, 'Mật khẩu không được để trống'),
});

/**
 * Schema xác thực email
 */
export const verifyEmailSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  otp: z.string().regex(/^\d{6}$/, 'Mã OTP phải là 6 chữ số'),
});

/**
 * Schema gửi lại OTP
 */
export const resendOtpSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  type: z.enum(['DANG_KY', 'QUEN_MAT_KHAU']),
});

/**
 * Schema quên mật khẩu
 */
export const forgotPasswordSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
});

/**
 * Schema đặt lại mật khẩu
 */
export const resetPasswordSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  otp: z.string().regex(/^\d{6}$/, 'Mã OTP phải là 6 chữ số'),
  newPassword: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự'),
});

/**
 * Schema đổi mật khẩu
 */
export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Mật khẩu cũ không được để trống'),
  newPassword: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự'),
});

/**
 * Schema refresh token
 */
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token không được để trống'),
});