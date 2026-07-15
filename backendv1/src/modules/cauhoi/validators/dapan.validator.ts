// src/modules/cauhoi/validators/dapan.validator.ts

import { z } from 'zod';
import { validate } from '../../../utils/zod-helper.js';

export { validate };

export const createDapAnSchema = z.object({
  noiDungText: z.string().min(1, 'Nội dung đáp án không được để trống'),
  noiDungUrl: z.string().url('URL không hợp lệ').nullable().optional(),
  laDapAnDung: z.boolean().default(false),
  thuTuHienThi: z.number().min(0, 'Thứ tự hiển thị phải là số không âm').optional(),
  giaTriKhop: z.string().nullable().optional(),
});

export const updateDapAnSchema = createDapAnSchema.partial();