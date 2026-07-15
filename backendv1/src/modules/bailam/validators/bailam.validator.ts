// src/modules/bailam/validators/bailam.validator.ts

import { z } from 'zod';
import { validate } from '../../../utils/zod-helper.js';

export { validate };

// =============================================
// ZOD SCHEMAS
// =============================================

const TRANG_THAI_BAI_LAM = ['DANG_LAM', 'DA_NOP', 'HET_GIO'] as const;

/**
 * Schema tạo bài làm
 */
export const createBaiLamSchema = z.object({
  BaiKiemTraID: z.number().min(1, 'Bài kiểm tra không được để trống'),
  HocVienID: z.number().min(1, 'Học viên không được để trống'),
  LopHocID: z.number().min(1, 'Lớp học không được để trống'),
  ThoiGianBatDau: z.coerce.date({ message: 'Thời gian bắt đầu không hợp lệ' }),
  ThoiGianNop: z.coerce.date({ message: 'Thời gian nộp không hợp lệ' }).optional().nullable(),
  TongDiem: z.number().min(0, 'Tổng điểm không được là số âm').optional().default(0),
  TrangThai: z.enum(TRANG_THAI_BAI_LAM).optional().default('DANG_LAM'),
});

/**
 * Schema cập nhật bài làm
 */
export const updateBaiLamSchema = z.object({
  ThoiGianNop: z.coerce.date({ message: 'Thời gian nộp không hợp lệ' }).optional().nullable(),
  TongDiem: z.number().min(0, 'Tổng điểm không được là số âm').optional(),
  TrangThai: z.enum(TRANG_THAI_BAI_LAM).optional(),
});

/**
 * Schema query danh sách bài làm
 */
export const baiLamQuerySchema = z.object({
  page: z.coerce.number().min(1, 'Page phải lớn hơn 0').default(1),
  limit: z.coerce.number().min(1, 'Limit phải lớn hơn 0').max(100, 'Limit tối đa 100').default(10),
  baiKiemTra: z.coerce.number().optional(),
  hocVien: z.coerce.number().optional(),
  lopHoc: z.coerce.number().optional(),
  status: z.enum([...TRANG_THAI_BAI_LAM, 'ALL']).default('ALL'),
  sort_by: z
    .enum(['CreatedAt', 'ThoiGianNop', 'TongDiem'])
    .default('CreatedAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

/**
 * Schema tạo chi tiết bài làm
 */
export const createBaiLamChiTietSchema = z
  .object({
    CauHoiID: z.number().min(1, 'Câu hỏi không được để trống'),
    DapAnID: z.number().nullable().optional(),
    NoiDungTraLoi: z.string().nullable().optional(),
    LaDung: z.boolean().nullable().optional(),
  })
  .refine(
    (data) => data.DapAnID || data.NoiDungTraLoi,
    { message: 'Cần có đáp án hoặc nội dung trả lời', path: ['DapAnID'] }
  );

/**
 * Schema cập nhật chi tiết bài làm
 */
export const updateBaiLamChiTietSchema = z.object({
  DapAnID: z.number().nullable().optional(),
  NoiDungTraLoi: z.string().nullable().optional(),
  LaDung: z.boolean().nullable().optional(),
});