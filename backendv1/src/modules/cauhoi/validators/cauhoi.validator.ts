// src/modules/cauhoi/validators/cauhoi.validator.ts

import { z } from 'zod';
import { validate } from '../../../utils/zod-helper.js';

export { validate };

const CAU_HOI_TYPES = [
  'TRAC_NGHIEM_MOT_DAP_AN',
  'DUNG_SAI',
  'TRAC_NGHIEM_NHIEU_DAP_AN',
  'DIEN_VAO_CHO_TRONG',
  'NOI_CAP',
  'SAP_XEP',
  'PHAN_LOAI',
  'DOC_HIEU',
  'NGHE_HIEU',
  'XEM_HINH',
  'TINH_HUONG',
] as const;

const TYPES_NEED_DULIEUPHU = ['NOI_CAP', 'PHAN_LOAI'];

/**
 * Schema cơ bản cho câu hỏi (không có refine)
 */
const baseCauHoiSchema = z.object({
  loaiCauHoi: z.enum(CAU_HOI_TYPES),
  cauHoiChaID: z.number().nullable().optional(),
  tieuDe: z.string().nullable().optional(),
  noiDungText: z.string().nullable().optional(),
  noiDungUrl: z.string().url('URL không hợp lệ').nullable().optional(),
  duLieuPhu: z.any().nullable().optional(),
  thuTuHienThi: z.number().min(0, 'Thứ tự hiển thị phải là số không âm').optional(),
  trangThai: z.enum(['AN', 'HIEN']).optional().default('HIEN'),
});

/**
 * Schema tạo câu hỏi (có refine)
 */
export const createCauHoiSchema = baseCauHoiSchema.refine(
  (data) => {
    if (data.loaiCauHoi && TYPES_NEED_DULIEUPHU.includes(data.loaiCauHoi)) {
      return data.duLieuPhu && Array.isArray(data.duLieuPhu) && data.duLieuPhu.length > 0;
    }
    return true;
  },
  {
    message: 'Câu hỏi loại này cần có duLieuPhu là mảng không rỗng',
    path: ['duLieuPhu'],
  }
);

/**
 * Schema cập nhật câu hỏi (dùng partial trên base schema, không có refine)
 */
export const updateCauHoiSchema = baseCauHoiSchema.partial();

/**
 * Schema query danh sách câu hỏi
 */
export const cauHoiQuerySchema = z.object({
  page: z.coerce.number().min(1, 'Page phải lớn hơn 0').default(1),
  limit: z.coerce.number().min(1, 'Limit phải lớn hơn 0').max(100, 'Limit tối đa 100').default(10),
  search: z.string().optional(),
  loai: z.enum(CAU_HOI_TYPES).optional(),
  status: z.enum(['AN', 'HIEN', 'ALL']).default('ALL'),
  sort_by: z
    .enum(['createdAt', 'loaiCauHoi', 'noiDungText', 'thuTuHienThi'])
    .default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});