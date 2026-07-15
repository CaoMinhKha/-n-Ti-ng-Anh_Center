// src/modules/khoahoc/validators/phanbaihoc.validator.ts

import { z } from 'zod';
import { validate } from '../../../utils/zod-helper.js';

export { validate };

export const createPhanBaiHocSchema = z.object({
  tenPhanBaiHoc: z
    .string()
    .min(1, 'Tên phần bài học không được để trống')
    .max(200, 'Tên phần bài học không được vượt quá 200 ký tự'),
  loaiPhanBaiHocID: z
    .number()
    .min(1, 'Loại phần bài học không được để trống'),
  tieuDe: z
    .string()
    .nullable()  //  Cho phép null
    .optional(),
  videoUrl: z
    .string()
    .url('Video URL không hợp lệ')
    .nullable()  //  Cho phép null
    .optional(),
  thuTuHienThi: z
    .number()
    .min(0, 'Thứ tự hiển thị phải là số không âm')
    .optional(),
  trangThai: z
    .enum(['AN', 'HIEN'])
    .optional()
    .default('HIEN'),
});

export const updatePhanBaiHocSchema = createPhanBaiHocSchema.partial();