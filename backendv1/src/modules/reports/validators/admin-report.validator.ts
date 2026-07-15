// src/modules/reports/validators/admin-report.validator.ts

import { z } from 'zod';
import { validate } from '../../../utils/zod-helper.js';

export { validate };

export const revenueQuerySchema = z.object({
  period: z.enum(['month', 'quarter', 'year']).default('month'),
  year: z.coerce.number().min(2020).max(2100).default(new Date().getFullYear()),
  month: z.coerce.number().min(1).max(12).optional(),
  quarter: z.coerce.number().min(1).max(4).optional(),
});

export const studentReportQuerySchema = z.object({
  trinhDo: z.string().optional(),
  status: z.enum(['HOAT_DONG', 'KHOA', 'CHO_XAC_THUC', 'ALL']).default('ALL'),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
});

export const classReportQuerySchema = z.object({
  status: z.enum(['SAP_KHAI_GIANG', 'DANG_HOC', 'DA_KET_THUC', 'DA_HUY', 'ALL']).default('ALL'),
  khoaHoc: z.coerce.number().optional(),
  giaoVien: z.coerce.number().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
});