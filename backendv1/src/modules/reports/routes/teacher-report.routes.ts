// src/modules/reports/routes/teacher-report.routes.ts

import { Router } from 'express';
import { TeacherReportController } from '../controllers/teacher-report.controller.js';
import { authMiddleware, roleMiddleware } from '../../auth/middleware/auth.middleware.js';

const router = Router();
const controller = new TeacherReportController();

// ==================================================
// Tất cả API đều yêu cầu Giáo viên
// ==================================================

/**
 * @swagger
 * /api/reports/teacher/dashboard:
 *   get:
 *     summary: Tổng quan lớp học của tôi
 *     tags: [Reports - Teacher]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dữ liệu dashboard giáo viên
 */
router.get(
  '/dashboard',
  authMiddleware,
  roleMiddleware(['GIAO_VIEN']),
  controller.getDashboard
);

/**
 * @swagger
 * /api/reports/teacher/class-results/{lopHocId}:
 *   get:
 *     summary: Kết quả học tập của lớp
 *     tags: [Reports - Teacher]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lopHocId
 *         required: true
 *         schema: { type: integer }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Kết quả học tập của lớp
 */
router.get(
  '/class-results/:lopHocId',
  authMiddleware,
  roleMiddleware(['GIAO_VIEN']),
  controller.getClassResults
);

/**
 * @swagger
 * /api/reports/teacher/attendance/{lopHocId}:
 *   get:
 *     summary: Thống kê điểm danh lớp
 *     tags: [Reports - Teacher]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lopHocId
 *         required: true
 *         schema: { type: integer }
 *       - in: query
 *         name: fromDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: toDate
 *         schema: { type: string, format: date }
 *     responses:
 *       200:
 *         description: Thống kê điểm danh lớp
 */
router.get(
  '/attendance/:lopHocId',
  authMiddleware,
  roleMiddleware(['GIAO_VIEN']),
  controller.getAttendanceReport
);

export default router;