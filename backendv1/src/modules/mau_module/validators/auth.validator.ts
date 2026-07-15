// src/modules/auth/validators/auth.validator.ts

import { AppError } from '../../../middleware/error.middleware.js';
import { RegisterDto,  } from '../../auth/dto/register.dto.js';
import {  LoginDto} from '../../auth/dto/login.dto.js';
import {  VerifyEmailDto } from '../../auth/dto/verify-email.dto.js';

/**
 * Validate email
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password (ít nhất 6 ký tự)
 */
export function validatePassword(password: string): boolean {
  return password.length >= 6;
}

/**
 * Validate tên (không được để trống)
 */
export function validateName(name: string): boolean {
  return name.trim().length > 0;
}

/**
 * Validate OTP (6 chữ số)
 */
export function validateOTP(otp: string): boolean {
  return /^\d{6}$/.test(otp);
}

/**
 * Validate Register
 */
export function validateRegister(data: RegisterDto): void {
  if (!data.email || !validateEmail(data.email)) {
    throw new AppError('Email không hợp lệ', 400);
  }

  if (!data.password || !validatePassword(data.password)) {
    throw new AppError('Mật khẩu phải có ít nhất 6 ký tự', 400);
  }

  if (!data.hoVaTen || !validateName(data.hoVaTen)) {
    throw new AppError('Họ và tên không được để trống', 400);
  }
}

/**
 * Validate Login
 */
export function validateLogin(data: LoginDto): void {
  if (!data.email || !validateEmail(data.email)) {
    throw new AppError('Email không hợp lệ', 400);
  }

  if (!data.password) {
    throw new AppError('Mật khẩu không được để trống', 400);
  }
}

/**
 * Validate Verify Email
 */
export function validateVerifyEmail(data: VerifyEmailDto): void {
  if (!data.email || !validateEmail(data.email)) {
    throw new AppError('Email không hợp lệ', 400);
  }

  if (!data.otp || !validateOTP(data.otp)) {
    throw new AppError('Mã OTP phải là 6 chữ số', 400);
  }
}

/**
 * Validate Forgot Password
 */
export function validateForgotPassword(email: string): void {
  if (!email || !validateEmail(email)) {
    throw new AppError('Email không hợp lệ', 400);
  }
}

/**
 * Validate Reset Password
 */
export function validateResetPassword(
  email: string,
  otp: string,
  newPassword: string
): void {
  if (!email || !validateEmail(email)) {
    throw new AppError('Email không hợp lệ', 400);
  }

  if (!otp || !validateOTP(otp)) {
    throw new AppError('Mã OTP phải là 6 chữ số', 400);
  }

  if (!newPassword || !validatePassword(newPassword)) {
    throw new AppError('Mật khẩu phải có ít nhất 6 ký tự', 400);
  }
}