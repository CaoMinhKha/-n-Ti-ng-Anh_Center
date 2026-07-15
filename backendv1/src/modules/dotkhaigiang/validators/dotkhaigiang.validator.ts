// src/modules/dotkhaigiang/validators/dotkhaigiang.validator.ts

import { z } from 'zod';
import { validate } from '../../../utils/zod-helper.js';

export { validate };

// =============================================
// Zod Schemas
// =============================================

/**
 * Schema cơ bản (không có refine)
 */
const baseDotKhaiGiangSchema = z.object({
  MaDot: z
    .string()
    .min(1, 'Mã đợt không được để trống')
    .max(30, 'Mã đợt không được vượt quá 30 ký tự')
    .regex(/^[A-Z0-9\-]+$/, 'Mã đợt chỉ chứa chữ hoa, số và dấu gạch ngang'),
  TenDot: z
    .string()
    .min(1, 'Tên đợt không được để trống')
    .max(200, 'Tên đợt không được vượt quá 200 ký tự'),
  NgayMoDangKy: z.coerce.date({ message: 'Ngày mở đăng ký không hợp lệ' }),
  NgayDongDangKy: z.coerce.date({ message: 'Ngày đóng đăng ký không hợp lệ' }),
  MoTa: z.string().nullable().optional(),
  TrangThai: z.enum(['SAP_MO', 'DANG_MO', 'DA_DONG']).optional().default('SAP_MO'),
});

/**
 * Schema tạo đợt khai giảng (có refine)
 */
export const createDotKhaiGiangSchema = baseDotKhaiGiangSchema.refine(
  (data) => data.NgayMoDangKy < data.NgayDongDangKy,
  { message: 'Ngày mở đăng ký phải trước ngày đóng đăng ký', path: ['NgayMoDangKy'] }
);

/**
 * Schema cập nhật đợt khai giảng (dùng partial trên base, không có refine)
 */
export const updateDotKhaiGiangSchema = baseDotKhaiGiangSchema.partial();

/**
 * Schema query danh sách đợt khai giảng
 */
export const dotKhaiGiangQuerySchema = z.object({
  page: z.coerce.number().min(1, 'Page phải lớn hơn 0').default(1),
  limit: z.coerce.number().min(1, 'Limit phải lớn hơn 0').max(100, 'Limit tối đa 100').default(10),
  search: z.string().optional(),
  status: z.enum(['SAP_MO', 'DANG_MO', 'DA_DONG', 'ALL']).default('ALL'),
  sort_by: z
    .enum(['CreatedAt', 'MaDot', 'TenDot', 'NgayMoDangKy'])
    .default('CreatedAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});