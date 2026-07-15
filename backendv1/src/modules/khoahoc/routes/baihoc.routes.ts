// src/modules/khoahoc/routes/baihoc.routes.ts

import { Router } from 'express';
import { KhoaHocController } from '../controllers/khoahoc.controller.js';
import { authMiddleware, roleMiddleware } from '../../auth/middleware/auth.middleware.js';

const router = Router();
const controller = new KhoaHocController();

// =============================================
// BÀI HỌC - Public
// =============================================

/**
 * @swagger
 * /api/baihoc/{id}:
 *   get:
 *     summary: Xem chi tiết bài học
 *     tags: [BaiHoc]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Thông tin chi tiết bài học
 *       404:
 *         description: Bài học không tồn tại
 */
router.get('/:id', controller.getBaiHocById);

// =============================================
// BÀI HỌC - Protected (Admin/GV)
// =============================================

/**
 * @swagger
 * /api/baihoc/{id}:
 *   put:
 *     summary: Cập nhật bài học
 *     tags: [BaiHoc]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tenBaiHoc: { type: string }
 *               moTa: { type: string }
 *               thuTuHienThi: { type: integer }
 *               trangThai: { type: string, enum: [AN, HIEN] }
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 */
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['ADMIN', 'GIAO_VIEN']),
  controller.updateBaiHoc
);

/**
 * @swagger
 * /api/baihoc/{id}:
 *   delete:
 *     summary: Xóa bài học
 *     tags: [BaiHoc]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 */
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['ADMIN', 'GIAO_VIEN']),
  controller.deleteBaiHoc
);

export default router;