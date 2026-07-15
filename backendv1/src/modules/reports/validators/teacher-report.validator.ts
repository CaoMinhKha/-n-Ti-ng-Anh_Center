// src/modules/reports/validators/teacher-report.validator.ts

import { z } from 'zod';
import { validate } from '../../../utils/zod-helper.js';

export { validate };

export const classResultQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export const attendanceQuerySchema = z.object({
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
});