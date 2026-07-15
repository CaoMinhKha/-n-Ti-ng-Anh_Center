// src/modules/khoahoc/validators/baihoc.validator.ts

import { z } from 'zod';
import { validate } from '../../../utils/zod-helper.js';

export { validate };

// =============================================
// BÀI HỌC
// =============================================

export const createBaiHocSchema = z.object({
  tenBaiHoc: z
    .string()
    .min(1, 'Tên bài học không được để trống')
    .max(200, 'Tên bài học không được vượt quá 200 ký tự'),
  moTa: z
    .string()
    .optional()
    .nullable(),
  thuTuHienThi: z
    .number()
    .min(0, 'Thứ tự hiển thị phải là số không âm')
    .optional(), //  Không bắt buộc
  trangThai: z
    .enum(['AN', 'HIEN'])
    .optional()
    .default('HIEN'),
});

export const updateBaiHocSchema = createBaiHocSchema.partial();

export const baiHocQuerySchema = z.object({
  page: z.coerce.number().min(1, 'Page phải lớn hơn 0').default(1),
  limit: z.coerce.number().min(1, 'Limit phải lớn hơn 0').max(100, 'Limit tối đa 100').default(10),
  search: z.string().optional(),
  status: z.enum(['AN', 'HIEN', 'ALL']).default('ALL'),
  sort_by: z
    .enum(['createdAt', 'tenBaiHoc', 'thuTuHienThi'])
    .default('thuTuHienThi'),
  order: z.enum(['asc', 'desc']).default('asc'),
});