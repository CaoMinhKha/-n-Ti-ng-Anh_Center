// src/modules/lichhoc/validators/lichhoc.validator.ts

import { z } from 'zod';
import { validate } from '../../../utils/zod-helper.js';

export { validate };

// =============================================
// LỊCH HỌC
// =============================================

/**
 * Schema cơ bản (không có refine)
 */
const baseLichHocSchema = z.object({
  LopHocID: z.number().min(1, 'Lớp học không được để trống'),
  ThuTrongTuan: z
    .number()
    .min(1, 'Thứ trong tuần từ 1-7 (1=CN)')
    .max(7, 'Thứ trong tuần từ 1-7 (1=CN)'),
  CaHocID: z.number().min(1, 'Ca học không được để trống'),
  PhongHocID: z.number().nullable().optional(),
  NgayApDung: z.coerce.date({ message: 'Ngày áp dụng không hợp lệ' }),
  NgayKetThuc: z.coerce.date({ message: 'Ngày kết thúc không hợp lệ' }),
  TrangThai: z
    .enum(['HOAT_DONG', 'TAM_DUNG'])
    .optional()
    .default('HOAT_DONG'),
});

/**
 * Schema tạo lịch học (có refine)
 */
export const createLichHocSchema = baseLichHocSchema.refine(
  (data) => data.NgayApDung < data.NgayKetThuc,
  { message: 'Ngày áp dụng phải trước ngày kết thúc', path: ['NgayApDung'] }
);

/**
 * Schema cập nhật lịch học
 */
export const updateLichHocSchema = baseLichHocSchema.partial();

/**
 * Schema query danh sách lịch học
 */
export const lichHocQuerySchema = z.object({
  page: z.coerce.number().min(1, 'Page phải lớn hơn 0').default(1),
  limit: z.coerce.number().min(1, 'Limit phải lớn hơn 0').max(100, 'Limit tối đa 100').default(10),
  lopHoc: z.coerce.number().optional(),
  caHoc: z.coerce.number().optional(),
  thuTrongTuan: z.coerce.number().min(1).max(7).optional(),
  status: z.enum(['HOAT_DONG', 'TAM_DUNG', 'ALL']).default('ALL'),
  sort_by: z
    .enum(['CreatedAt', 'ThuTrongTuan', 'NgayApDung', 'NgayKetThuc'])
    .default('CreatedAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});