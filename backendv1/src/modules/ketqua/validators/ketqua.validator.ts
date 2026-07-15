// src/modules/ketqua/validators/ketqua.validator.ts

import { z } from 'zod';
import { validate } from '../../../utils/zod-helper.js';

export { validate };

// =============================================
// ZOD SCHEMAS
// =============================================

const XEP_LOAI = ['XUAT_SAC', 'GIOI', 'KHA', 'TRUNG_BINH', 'KHONG_DAT'] as const;
const TRANG_THAI_TIEN_DO = ['CHUA_BAT_DAU', 'DANG_HOC', 'HOAN_THANH'] as const;

/**
 * Schema tạo kết quả học tập
 */
export const createKetQuaSchema = z.object({
  HocVienID: z.number().min(1, 'Học viên không được để trống'),
  LopHocID: z.number().min(1, 'Lớp học không được để trống'),
  DiemChuyenCan: z
    .number()
    .min(0, 'Điểm chuyên cần phải từ 0 đến 10')
    .max(10, 'Điểm chuyên cần phải từ 0 đến 10')
    .optional()
    .default(0),
  DiemBaiTap: z
    .number()
    .min(0, 'Điểm bài tập phải từ 0 đến 10')
    .max(10, 'Điểm bài tập phải từ 0 đến 10')
    .optional()
    .default(0),
  DiemKiemTra: z
    .number()
    .min(0, 'Điểm kiểm tra phải từ 0 đến 10')
    .max(10, 'Điểm kiểm tra phải từ 0 đến 10')
    .optional()
    .default(0),
  TongDiem: z
    .number()
    .min(0, 'Tổng điểm phải từ 0 đến 10')
    .max(10, 'Tổng điểm phải từ 0 đến 10')
    .optional(),
  XepLoai: z.enum(XEP_LOAI).optional(),
});

/**
 * Schema cập nhật kết quả học tập
 */
export const updateKetQuaSchema = createKetQuaSchema.partial();

/**
 * Schema query danh sách kết quả học tập
 */
export const ketQuaQuerySchema = z.object({
  page: z.coerce.number().min(1, 'Page phải lớn hơn 0').default(1),
  limit: z.coerce.number().min(1, 'Limit phải lớn hơn 0').max(100, 'Limit tối đa 100').default(10),
  hocVien: z.coerce.number().optional(),
  lopHoc: z.coerce.number().optional(),
  xepLoai: z.enum([...XEP_LOAI, 'ALL']).default('ALL'),
  sort_by: z
    .enum(['CreatedAt', 'TongDiem', 'DiemChuyenCan', 'DiemBaiTap', 'DiemKiemTra'])
    .default('CreatedAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

/**
 * Schema query danh sách tiến độ học tập
 */
export const tienDoQuerySchema = z.object({
  page: z.coerce.number().min(1, 'Page phải lớn hơn 0').default(1),
  limit: z.coerce.number().min(1, 'Limit phải lớn hơn 0').max(100, 'Limit tối đa 100').default(10),
  hocVien: z.coerce.number().optional(),
  lopHoc: z.coerce.number().optional(),
  phanBaiHoc: z.coerce.number().optional(),
  status: z.enum([...TRANG_THAI_TIEN_DO, 'ALL']).default('ALL'),
  sort_by: z
    .enum(['CreatedAt', 'TongSoCauHoiDung', 'TongSoCauHoi'])
    .default('CreatedAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});