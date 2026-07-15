// src/modules/lichhoc/validators/phonghoc.validator.ts

import { z } from 'zod';
import { validate } from '../../../utils/zod-helper.js';

export { validate };

// =============================================
// PHÒNG HỌC
// =============================================

export const createPhongHocSchema = z.object({
  MaPhong: z
    .string()
    .min(1, 'Mã phòng không được để trống')
    .max(20, 'Mã phòng không được vượt quá 20 ký tự')
    .regex(/^[A-Z0-9]+$/, 'Mã phòng chỉ chứa chữ hoa và số'),
  TenPhong: z
    .string()
    .min(1, 'Tên phòng không được để trống')
    .max(100, 'Tên phòng không được vượt quá 100 ký tự'),
  SucChua: z.number().min(1, 'Sức chứa phải lớn hơn 0'),
  ToaNha: z.string().nullable().optional(),
  TrangThai: z
    .enum(['TRONG', 'DANG_SU_DUNG', 'BAO_TRI'])
    .optional()
    .default('TRONG'),
});

export const updatePhongHocSchema = createPhongHocSchema.partial();

export const phongHocQuerySchema = z.object({
  page: z.coerce.number().min(1, 'Page phải lớn hơn 0').default(1),
  limit: z.coerce.number().min(1, 'Limit phải lớn hơn 0').max(100, 'Limit tối đa 100').default(10),
  search: z.string().optional(),
  status: z.enum(['TRONG', 'DANG_SU_DUNG', 'BAO_TRI', 'ALL']).default('ALL'),
  sort_by: z
    .enum(['CreatedAt', 'MaPhong', 'TenPhong', 'SucChua'])
    .default('CreatedAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});