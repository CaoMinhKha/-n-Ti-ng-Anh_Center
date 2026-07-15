// src/modules/reports/routes/student-report.routes.ts

import { Router } from 'express';
import { StudentReportController } from '../controllers/student-report.controller.js';
import { authMiddleware, roleMiddleware } from '../../auth/middleware/auth.middleware.js';

const router = Router();
const controller = new StudentReportController();

// ==================================================
// Tất cả API đều yêu cầu Học viên
// ==================================================

/**
 * @swagger
 * /api/reports/student/dashboard:
 *   get:
 *     summary: Tổng quan học tập của tôi
 *     tags: [Reports - Student]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dữ liệu dashboard học viên
 */
router.get(
  '/dashboard',
  authMiddleware,
  roleMiddleware(['HOC_VIEN']),
  controller.getDashboard
);

/**
 * @swagger
 * /api/reports/student/results:
 *   get:
 *     summary: Kết quả học tập của tôi
 *     tags: [Reports - Student]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: lopHocId
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Kết quả học tập
 */
router.get(
  '/results',
  authMiddleware,
  roleMiddleware(['HOC_VIEN']),
  controller.getResults
);

/**
 * @swagger
 * /api/reports/student/attendance:
 *   get:
 *     summary: Lịch sử điểm danh
 *     tags: [Reports - Student]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fromDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: toDate
 *         schema: { type: string, format: date }
 *     responses:
 *       200:
 *         description: Lịch sử điểm danh
 */
router.get(
  '/attendance',
  authMiddleware,
  roleMiddleware(['HOC_VIEN']),
  controller.getAttendanceHistory
);

export default router;