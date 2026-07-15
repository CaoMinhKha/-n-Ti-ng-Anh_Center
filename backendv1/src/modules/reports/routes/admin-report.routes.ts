// src/modules/reports/routes/admin-report.routes.ts

import { Router } from 'express';
import { AdminReportController } from '../controllers/admin-report.controller.js';
import { authMiddleware, roleMiddleware } from '../../auth/middleware/auth.middleware.js';

const router = Router();
const controller = new AdminReportController();

// ==================================================
// Tất cả API đều yêu cầu Admin
// ==================================================

/**
 * @swagger
 * /api/reports/admin/dashboard:
 *   get:
 *     summary: Tổng quan hệ thống (Dashboard)
 *     tags: [Reports - Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dữ liệu dashboard
 */
router.get(
  '/dashboard',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  controller.getDashboard
);

/**
 * @swagger
 * /api/reports/admin/revenue:
 *   get:
 *     summary: Doanh thu theo thời gian
 *     tags: [Reports - Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema: { type: string, enum: [month, quarter, year] }
 *       - in: query
 *         name: year
 *         schema: { type: integer }
 *       - in: query
 *         name: month
 *         schema: { type: integer }
 *       - in: query
 *         name: quarter
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Dữ liệu doanh thu
 */
router.get(
  '/revenue',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  controller.getRevenue
);

/**
 * @swagger
 * /api/reports/admin/students:
 *   get:
 *     summary: Thống kê học viên
 *     tags: [Reports - Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [HOAT_DONG, KHOA, CHO_XAC_THUC, ALL] }
 *       - in: query
 *         name: trinhDo
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Thống kê học viên
 */
router.get(
  '/students',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  controller.getStudentReport
);

/**
 * @swagger
 * /api/reports/admin/classes:
 *   get:
 *     summary: Thống kê lớp học
 *     tags: [Reports - Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [SAP_KHAI_GIANG, DANG_HOC, DA_KET_THUC, DA_HUY, ALL] }
 *     responses:
 *       200:
 *         description: Thống kê lớp học
 */
router.get(
  '/classes',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  controller.getClassReport
);

export default router;