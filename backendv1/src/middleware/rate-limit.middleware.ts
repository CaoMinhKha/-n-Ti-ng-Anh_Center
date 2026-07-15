// src/middleware/rate-limit.middleware.ts

import rateLimit from 'express-rate-limit';

/**
 * Giới hạn request cho API đăng nhập (chống brute force)
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // Tối đa 5 lần
  message: {
    error: 'Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau 15 phút.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Giới hạn request cho API đăng ký
 */
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 giờ
  max: 10, // Tối đa 10 lần
  message: {
    error: 'Quá nhiều yêu cầu đăng ký. Vui lòng thử lại sau 1 giờ.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Giới hạn request cho API OTP
 */
export const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 phút
  max: 100, // Tối đa 3 lần
  message: {
    error: 'Quá nhiều yêu cầu OTP. Vui lòng thử lại sau 5 phút.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});