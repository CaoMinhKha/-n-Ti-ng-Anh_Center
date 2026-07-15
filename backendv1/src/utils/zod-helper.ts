// src/utils/zod-helper.ts

import { z } from 'zod';
import { AppError } from '../middleware/error.middleware.js';

/**
 * Lấy error messages từ Zod
 */
function getZodErrorMessage(error: z.ZodError): string {
  const messages = error.issues.map((issue) => {
    const path = issue.path.join('.');
    return path ? `${path}: ${issue.message}` : issue.message;
  });
  return messages.join('; ');
}

/**
 * Validate dữ liệu với Zod schema
 */
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = getZodErrorMessage(error);
      throw new AppError(message, 400);
    }
    throw error;
  }
}

/**
 * Transform sort_by từ frontend sang Prisma field
 */
export const sortByMapping = {
  // Danh mục
  'created_at': 'CreatedAt',
  'ten_danh_muc': 'TenDanhMuc',
  'thu_tu_hien_thi': 'ThuTuHienThi',
  // Tài khoản
  'email': 'Email',
  'ho_va_ten': 'HoVaTen',
  'vai_tro': 'VaiTro',
  'trang_thai': 'TrangThai',
  // Khóa học
  'ten_khoa_hoc': 'TenKhoaHoc',
  'hoc_phi': 'HocPhi',
  // ... thêm các mapping khác khi cần
} as const;

export type SortByKey = keyof typeof sortByMapping;