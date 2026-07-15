// src/modules/diemdanh/validators/diemdanh.validator.ts

import { z } from 'zod';
import { validate } from '../../../utils/zod-helper.js';

export { validate };

// =============================================
// ZOD SCHEMAS
// =============================================

const TRANG_THAI_DIEM_DANH = ['CO_MAT', 'VANG_CO_PHEP', 'VANG_KHONG_PHEP', 'DI_MUON'] as const;
const TRANG_THAI_MA_DIEM_DANH = ['DANG_HOAT_DONG', 'HET_HAN', 'DA_DONG'] as const;

/**
 * Schema tạo điểm danh
 */
export const createDiemDanhSchema = z.object({
  HocVienID: z.number().min(1, 'Học viên không được để trống'),
  BuoiHocID: z.number().min(1, 'Buổi học không được để trống'),
  TrangThaiDiemDanh: z.enum(TRANG_THAI_DIEM_DANH),
  ThoiGianCheckIn: z.coerce.date({ message: 'Thời gian check-in không hợp lệ' }).optional(),
  GhiChu: z.string().nullable().optional(),
});

/**
 * Schema cập nhật điểm danh
 */
export const updateDiemDanhSchema = z.object({
  TrangThaiDiemDanh: z.enum(TRANG_THAI_DIEM_DANH).optional(),
  ThoiGianCheckIn: z.coerce.date({ message: 'Thời gian check-in không hợp lệ' }).optional(),
  GhiChu: z.string().nullable().optional(),
});

/**
 * Schema query danh sách điểm danh
 */
export const diemDanhQuerySchema = z.object({
  page: z.coerce.number().min(1, 'Page phải lớn hơn 0').default(1),
  limit: z.coerce.number().min(1, 'Limit phải lớn hơn 0').max(100, 'Limit tối đa 100').default(10),
  buoiHoc: z.coerce.number().optional(),
  hocVien: z.coerce.number().optional(),
  status: z.enum([...TRANG_THAI_DIEM_DANH, 'ALL']).default('ALL'),
  sort_by: z
    .enum(['CreatedAt', 'ThoiGianCheckIn'])
    .default('CreatedAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

/**
 * Schema tạo mã điểm danh
 */
export const createMaDiemDanhSchema = z.object({
  BuoiHocID: z.number().min(1, 'Buổi học không được để trống'),
  GiaoVienID: z.number().min(1, 'Giáo viên không được để trống'),
  ThoiGianHetHan: z.coerce.date({ message: 'Thời gian hết hạn không hợp lệ' }).optional(),
  TrangThai: z.enum(TRANG_THAI_MA_DIEM_DANH).optional().default('DANG_HOAT_DONG'),
});

/**
 * Schema xác thực mã điểm danh
 */
export const verifyMaDiemDanhSchema = z.object({
  maCode: z.string().min(1, 'Mã điểm danh không được để trống'),
});