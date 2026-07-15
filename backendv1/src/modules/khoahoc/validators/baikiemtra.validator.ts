// src/modules/khoahoc/validators/baikiemtra.validator.ts

import { z } from 'zod';
import { validate } from '../../../utils/zod-helper.js';

export { validate };

// =============================================
// BÀI KIỂM TRA
// =============================================

export const createBaiKiemTraSchema = z.object({
  tenBaiKiemTra: z
    .string()
    .min(1, 'Tên bài kiểm tra không được để trống')
    .max(200, 'Tên bài kiểm tra không được vượt quá 200 ký tự'),
  thoiGianBatDau: z
    .coerce.date()
    .optional()
    .nullable(),
  thoiGianLamBai: z
    .number()
    .min(1, 'Thời gian làm bài phải lớn hơn 0 phút'),
  diemDat: z
    .number()
    .min(0, 'Điểm đạt không được là số âm')
    .optional()
    .default(0),
  diemMax: z
    .number()
    .min(0, 'Điểm tối đa không được là số âm')
    .optional()
    .default(100),
  trangThai: z
    .enum(['AN', 'HIEN'])
    .optional()
    .default('HIEN'),
});

export const updateBaiKiemTraSchema = createBaiKiemTraSchema.partial();