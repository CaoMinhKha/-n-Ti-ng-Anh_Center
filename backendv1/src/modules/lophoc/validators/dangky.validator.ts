// src/modules/lophoc/validators/dangky.validator.ts

import { z } from 'zod';
import { validate } from '../../../utils/zod-helper.js';

export { validate };

// =============================================
// ĐĂNG KÝ HỌC VIÊN
// =============================================

/**
 * Schema đăng ký học viên vào lớp
 */
export const dangKyHocVienSchema = z.object({
  HocVienID: z.number().min(1, 'Học viên không được để trống'),
  HocPhi: z.number().min(0, 'Học phí phải là số không âm').optional(),
});

/**
 * Schema duyệt đăng ký
 */
export const duyetDangKySchema = z.object({
  trangThai: z.enum(['DA_DUYET', 'TU_CHOI']),
});