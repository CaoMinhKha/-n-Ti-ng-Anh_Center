// src/modules/reports/validators/student-report.validator.ts

import { z } from 'zod';
import { validate } from '../../../utils/zod-helper.js';

export { validate };

export const studentResultQuerySchema = z.object({
  lopHocId: z.coerce.number().optional(),
});

export const studentAttendanceQuerySchema = z.object({
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
}); 