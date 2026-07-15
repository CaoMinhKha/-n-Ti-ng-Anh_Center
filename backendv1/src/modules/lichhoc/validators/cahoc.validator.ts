// src/modules/lichhoc/validators/cahoc.validator.ts

import { z } from 'zod';
import { validate } from '../../../utils/zod-helper.js';

export { validate };

// =============================================
// CA HỌC
// =============================================

/**
 * Schema cơ bản (không có refine)
 */
const baseCaHocSchema = z.object({
  MaCa: z
    .string()
    .min(1, 'Mã ca không được để trống')
    .max(20, 'Mã ca không được vượt quá 20 ký tự')
    .regex(/^[A-Z0-9_]+$/, 'Mã ca chỉ chứa chữ hoa, số và dấu gạch dưới'),
  TenCa: z
    .string()
    .min(1, 'Tên ca không được để trống')
    .max(100, 'Tên ca không được vượt quá 100 ký tự'),
  GioBatDau: z
    .string()
    .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Giờ bắt đầu không hợp lệ. Định dạng HH:mm'),
  GioKetThuc: z
    .string()
    .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Giờ kết thúc không hợp lệ. Định dạng HH:mm'),
  TrangThai: z
    .enum(['HOAT_DONG', 'NGUNG_HOAT_DONG'])
    .optional()
    .default('HOAT_DONG'),
});

/**
 * Schema tạo ca học (có refine)
 */
export const createCaHocSchema = baseCaHocSchema.refine(
  (data) => data.GioBatDau < data.GioKetThuc,
  { message: 'Giờ bắt đầu phải trước giờ kết thúc', path: ['GioBatDau'] }
);

/**
 * Schema cập nhật ca học
 */
export const updateCaHocSchema = baseCaHocSchema.partial();