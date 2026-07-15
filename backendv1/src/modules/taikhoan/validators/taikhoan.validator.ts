// src/modules/taikhoan/validators/taikhoan.validator.ts

import { z } from 'zod';
import { validate } from '../../../utils/zod-helper.js';

export { validate };

// =============================================
// Zod Schemas
// =============================================

/**
 * Schema tạo tài khoản (Admin tạo)
 */
export const createTaiKhoanSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  hoVaTen: z.string().min(1, 'Họ và tên không được để trống'),
  vaiTro: z.enum(['ADMIN', 'GIAO_VIEN', 'HOC_VIEN']),
  ngaySinh: z.coerce.date().nullable().optional(),
  gioiTinh: z.enum(['NAM', 'NU', 'KHAC']).optional(),
  avatarUrl: z.string().nullable().optional(),
});

/**
 * Schema cập nhật tài khoản
 */
export const updateTaiKhoanSchema = z.object({
  hoVaTen: z.string().min(1, 'Họ và tên không được để trống').optional(),
  ngaySinh: z.coerce.date().nullable().optional(),
  gioiTinh: z.enum(['NAM', 'NU', 'KHAC']).optional(),
  avatarUrl: z.string().nullable().optional(),
  vaiTro: z.enum(['ADMIN', 'GIAO_VIEN', 'HOC_VIEN']).optional(),
  trangThai: z.enum(['HOAT_DONG', 'KHOA', 'CHO_XAC_THUC']).optional(),
});

/**
 * Schema đặt lại mật khẩu (Admin)
 */
export const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự'),
});

/**
 * Schema khóa/Mở khóa tài khoản
 */
export const toggleStatusSchema = z.object({
  trangThai: z.enum(['HOAT_DONG', 'KHOA']),
});

/**
 * Schema query danh sách tài khoản
 *  Dùng camelCase để đồng bộ với DTO
 */
export const taiKhoanQuerySchema = z.object({
  page: z.coerce.number().min(1, 'Page phải lớn hơn 0').default(1),
  limit: z.coerce.number().min(1, 'Limit phải lớn hơn 0').max(100, 'Limit tối đa 100').default(10),
  search: z.string().optional(),
  role: z.enum(['ADMIN', 'GIAO_VIEN', 'HOC_VIEN', 'ALL']).default('ALL'),
  status: z.enum(['HOAT_DONG', 'KHOA', 'CHO_XAC_THUC', 'ALL']).default('ALL'),
  //  Sửa thành camelCase để đồng bộ với DTO và Service
  sort_by: z
    .enum(['createdAt', 'email', 'hoVaTen', 'vaiTro', 'trangThai'])
    .default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});