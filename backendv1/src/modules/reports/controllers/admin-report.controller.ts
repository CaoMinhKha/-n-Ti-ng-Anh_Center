// src/modules/reports/controllers/admin-report.controller.ts

import { Request, Response, NextFunction } from 'express';
import { AdminReportService } from '../services/admin-report.service.js';
import {
  revenueQuerySchema,
  studentReportQuerySchema,
  classReportQuerySchema,
  validate,
} from '../validators/admin-report.validator.js';

const adminReportService = new AdminReportService();

export class AdminReportController {
  /**
   * Tổng quan hệ thống (Dashboard)
   * GET /api/reports/admin/dashboard
   */
  async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await adminReportService.getDashboard();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Doanh thu theo thời gian
   * GET /api/reports/admin/revenue
   */
  async getRevenue(req: Request, res: Response, next: NextFunction) {
    try {
      const query = validate(revenueQuerySchema, req.query);
      const result = await adminReportService.getRevenue(query);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Thống kê học viên
   * GET /api/reports/admin/students
   */
  async getStudentReport(req: Request, res: Response, next: NextFunction) {
    try {
      const query = validate(studentReportQuerySchema, req.query);
      const result = await adminReportService.getStudentReport(query);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Thống kê lớp học
   * GET /api/reports/admin/classes
   */
  async getClassReport(req: Request, res: Response, next: NextFunction) {
    try {
      const query = validate(classReportQuerySchema, req.query);
      const result = await adminReportService.getClassReport(query);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}