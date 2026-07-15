// src/modules/lophoc/validators/lophoc.validator.ts

import { z } from 'zod';
import { validate } from '../../../utils/zod-helper.js';

export { validate };

// =============================================
// ZOD SCHEMAS
// =============================================

/**
 * Schema cơ bản (không có refine)
 */
const baseLopHocSchema = z.object({
  DotKhaiGiangID: z.number().min(1, 'Đợt khai giảng không được để trống'),
  KhoaHocID: z.number().min(1, 'Khóa học không được để trống'),
  GiaoVienID: z.number().min(1, 'Giáo viên không được để trống'),
  TenLopHoc: z
    .string()
    .min(1, 'Tên lớp học không được để trống')
    .max(200, 'Tên lớp học không được vượt quá 200 ký tự'),
  HinhThucHoc: z.enum(['ONLLINE', 'OFFLINE']),
  HocPhi: z.number().min(0, 'Học phí phải là số không âm').optional().default(0),
  SiSoToiDa: z.number().min(1, 'Sĩ số tối đa phải lớn hơn 0').optional().default(30),
  NgayBatDau: z.coerce.date({ message: 'Ngày bắt đầu không hợp lệ' }),
  NgayKetThuc: z.coerce.date({ message: 'Ngày kết thúc không hợp lệ' }),
  TrangThai: z
    .enum(['SAP_KHAI_GIANG', 'DANG_HOC', 'DA_KET_THUC', 'DA_HUY'])
    .optional()
    .default('SAP_KHAI_GIANG'),
});

/**
 * Schema tạo lớp học (có refine)
 */
export const createLopHocSchema = baseLopHocSchema.refine(
  (data) => data.NgayBatDau < data.NgayKetThuc,
  { message: 'Ngày bắt đầu phải trước ngày kết thúc', path: ['NgayBatDau'] }
);

/**
 * Schema cập nhật lớp học (dùng partial trên base, không có refine)
 */
export const updateLopHocSchema = baseLopHocSchema.partial();

/**
 * Schema query danh sách lớp học
 */
export const lopHocQuerySchema = z.object({
  page: z.coerce.number().min(1, 'Page phải lớn hơn 0').default(1),
  limit: z.coerce.number().min(1, 'Limit phải lớn hơn 0').max(100, 'Limit tối đa 100').default(10),
  search: z.string().optional(),
  dotKhaiGiang: z.coerce.number().optional(),
  khoaHoc: z.coerce.number().optional(),
  giaoVien: z.coerce.number().optional(),
  hinhThucHoc: z.enum(['ONLLINE', 'OFFLINE']).optional(),
  status: z.enum(['SAP_KHAI_GIANG', 'DANG_HOC', 'DA_KET_THUC', 'DA_HUY', 'ALL']).default('ALL'),
  sort_by: z
    .enum(['CreatedAt', 'TenLopHoc', 'NgayBatDau', 'NgayKetThuc'])
    .default('CreatedAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});