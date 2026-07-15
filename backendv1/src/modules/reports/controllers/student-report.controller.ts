// src/modules/reports/controllers/student-report.controller.ts

import { Request, Response, NextFunction } from 'express';
import { StudentReportService } from '../services/student-report.service.js';
import {
  studentResultQuerySchema,
  studentAttendanceQuerySchema,
  validate,
} from '../validators/student-report.validator.js';
import { AppError } from '../../../middleware/error.middleware.js';
import { getParamId, getParamString } from '../../../utils/param.util.js';
import { prisma } from '../../../config/prisma.js';

const studentReportService = new StudentReportService();

export class StudentReportController {
  /**
   * Tổng quan học tập của tôi
   * GET /api/reports/student/dashboard
   */
  async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
        
      const userId = getParamId((req as any).user?.userId);
      console.log(req)
      const hocVien = await prisma.hocvien.findUnique({
            where: { TaiKhoanID: userId },
          });

      if (!hocVien) {
        throw new AppError('Không tìm thấy thông tin học viên', 401);
      }
      const hocvienId = Number(hocVien.HocVienID)

      const result = await studentReportService.getDashboard(hocvienId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Kết quả học tập của tôi
   * GET /api/reports/student/results
   */
  async getResults(req: Request, res: Response, next: NextFunction) {
    try {
      const hocVienId = (req as any).user?.hocVienId;
      const query = validate(studentResultQuerySchema, req.query);

      if (!hocVienId) {
        throw new AppError('Không tìm thấy thông tin học viên', 401);
      }

      const result = await studentReportService.getResults(hocVienId, query.lopHocId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lịch sử điểm danh
   * GET /api/reports/student/attendance
   */
  async getAttendanceHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const hocVienId = (req as any).user?.hocVienId;
      const query = validate(studentAttendanceQuerySchema, req.query);

      if (!hocVienId) {
        throw new AppError('Không tìm thấy thông tin học viên', 401);
      }

      const result = await studentReportService.getAttendanceHistory(
        hocVienId,
        query.fromDate,
        query.toDate
      );

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}