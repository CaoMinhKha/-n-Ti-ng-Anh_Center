// src/modules/danhmuc/validators/danhmuc.validator.ts

import { z } from 'zod';
import { validate } from '../../../utils/zod-helper.js';

export { validate };

// =============================================
// Zod Schemas
// =============================================

/**
 * Schema tạo danh mục
 */
export const createDanhMucSchema = z.object({
  tenDanhMuc: z
    .string()
    .min(1, 'Tên danh mục không được để trống')
    .max(100, 'Tên danh mục không được vượt quá 100 ký tự'),
  moTa: z
    .string()
    .max(1000, 'Mô tả không được vượt quá 1000 ký tự')
    .optional(),
  thuTuHienThi: z
    .number()
    .min(0, 'Thứ tự hiển thị phải là số không âm')
    .optional()
    .default(0),
  danhMucChaId: z
    .number()
    .nullable()
    .optional()
    .default(null),
  trangThai: z
    .enum(['HOAT_DONG', 'NGUNG_HOAT_DONG'])
    .optional()
    .default('HOAT_DONG'),
});

/**
 * Schema cập nhật danh mục (tất cả fields optional)
 */
export const updateDanhMucSchema = createDanhMucSchema.partial();

/**
 * Schema query danh sách danh mục
 *  Dùng camelCase để đồng bộ với DTO
 */
export const danhMucQuerySchema = z.object({
  page: z.coerce.number().min(1, 'Page phải lớn hơn 0').default(1),
  limit: z.coerce.number().min(1, 'Limit phải lớn hơn 0').max(100, 'Limit tối đa 100').default(10),
  search: z.string().optional(),
  type: z.string().optional(),
  status: z.enum(['HOAT_DONG', 'NGUNG_HOAT_DONG', 'ALL']).default('ALL'),
  sort_by: z
    .enum(['createdAt', 'tenDanhMuc', 'thuTuHienThi', 'updatedAt'])
    .default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});