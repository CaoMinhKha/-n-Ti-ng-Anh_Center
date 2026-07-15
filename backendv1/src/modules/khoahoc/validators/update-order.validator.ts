// src/modules/khoahoc/validators/update-order.validator.ts

import { z } from 'zod';
import { validate } from '../../../utils/zod-helper.js';

export { validate };

// =============================================
// CẬP NHẬT THỨ TỰ
// =============================================

export const updateBaiHocOrderSchema = z.object({
  orders: z
    .array(
      z.object({
        baiHocID: z.number().min(1, 'baiHocID không hợp lệ'),
        thuTuHienThi: z.number().min(0, 'Thứ tự hiển thị phải là số không âm'),
      })
    )
    .min(1, 'orders là mảng không được để trống'),
});

export const updatePhanBaiHocOrderSchema = z.object({
  orders: z
    .array(
      z.object({
        phanBaiHocID: z.number().min(1, 'phanBaiHocID không hợp lệ'),
        thuTuHienThi: z.number().min(0, 'Thứ tự hiển thị phải là số không âm'),
      })
    )
    .min(1, 'orders là mảng không được để trống'),
});