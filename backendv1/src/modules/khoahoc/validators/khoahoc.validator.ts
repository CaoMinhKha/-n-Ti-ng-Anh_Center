// src/modules/khoahoc/validators/khoahoc.validator.ts

import { z } from 'zod';
import { validate } from '../../../utils/zod-helper.js';

export { validate };

// =============================================
// KHÓA HỌC
// =============================================

export const createKhoaHocSchema = z.object({
  tenKhoaHoc: z
    .string()
    .min(1, 'Tên khóa học không được để trống')
    .max(200, 'Tên khóa học không được vượt quá 200 ký tự'),
  trinhDoID: z
    .number()
    .min(1, 'Trình độ không được để trống'),
  hocPhi: z
    .number()
    .min(0, 'Học phí phải là số không âm')
    .optional()
    .default(0),
  moTa: z
    .string()
    .optional()
    .nullable(),
  trangThai: z
    .enum(['SAP_MO', 'DANG_MO', 'TAM_DUNG'])
    .optional()
    .default('DANG_MO'),
});

export const updateKhoaHocSchema = createKhoaHocSchema.partial();

export const khoaHocQuerySchema = z.object({
  page: z.coerce.number().min(1, 'Page phải lớn hơn 0').default(1),
  limit: z.coerce.number().min(1, 'Limit phải lớn hơn 0').max(100, 'Limit tối đa 100').default(10),
  search: z.string().optional(),
  trinhDo: z.string().optional(),
  status: z.enum(['SAP_MO', 'DANG_MO', 'TAM_DUNG', 'ALL']).default('ALL'),
  sort_by: z
    .enum(['createdAt', 'tenKhoaHoc', 'hocPhi', 'trangThai'])
    .default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});