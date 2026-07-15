// src/modules/reports/controllers/teacher-report.controller.ts

import { Request, Response, NextFunction } from 'express';
import { TeacherReportService } from '../services/teacher-report.service.js';
import {
  classResultQuerySchema,
  attendanceQuerySchema,
  validate,
} from '../validators/teacher-report.validator.js';
import { AppError } from '../../../middleware/error.middleware.js';
import { getParamId, getParamString } from '../../../utils/param.util.js';

const teacherReportService = new TeacherReportService();

export class TeacherReportController {
  /**
   * Tổng quan lớp học của tôi
   * GET /api/reports/teacher/dashboard
   */
  async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const giaoVienId = (req as any).user?.giaoVienId;

      if (!giaoVienId) {
        throw new AppError('Không tìm thấy thông tin giáo viên', 401);
      }

      const result = await teacherReportService.getDashboard(giaoVienId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Kết quả học tập của lớp
   * GET /api/reports/teacher/class-results/:lopHocId
   */
  async getClassResults(req: Request, res: Response, next: NextFunction) {
    try {
      const giaoVienId = (req as any).user?.giaoVienId;
      const lopHocId = getParamId(req.params.lopHocId);
      const query = validate(classResultQuerySchema, req.query);

      if (!giaoVienId) {
        throw new AppError('Không tìm thấy thông tin giáo viên', 401);
      }

      const result = await teacherReportService.getClassResults(
        giaoVienId,
        lopHocId,
        query.page,
        query.limit
      );

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Thống kê điểm danh lớp
   * GET /api/reports/teacher/attendance/:lopHocId
   */
  async getAttendanceReport(req: Request, res: Response, next: NextFunction) {
    try {
      const giaoVienId = (req as any).user?.giaoVienId;
      const lopHocId = getParamId(req.params.lopHocId);
      const query = validate(attendanceQuerySchema, req.query);

      if (!giaoVienId) {
        throw new AppError('Không tìm thấy thông tin giáo viên', 401);
      }

      const result = await teacherReportService.getAttendanceReport(
        giaoVienId,
        lopHocId,
        query.fromDate,
        query.toDate
      );

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}