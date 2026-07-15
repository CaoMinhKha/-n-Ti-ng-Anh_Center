// src/modules/cauhoi/routes/dapan.routes.ts

import { Router } from 'express';
import { CauHoiController } from '../controllers/cauhoi.controller.js';
import { authMiddleware, roleMiddleware } from '../../auth/middleware/auth.middleware.js';

const router = Router();
const controller = new CauHoiController();

// =============================================
// SWAGGER SCHEMAS
// =============================================

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateDapAnRequest:
 *       type: object
 *       properties:
 *         noiDungText:
 *           type: string
 *         noiDungUrl:
 *           type: string
 *           nullable: true
 *         laDapAnDung:
 *           type: boolean
 *         thuTuHienThi:
 *           type: integer
 *         giaTriKhop:
 *           type: string
 *           nullable: true
 */

// =============================================
// ĐÁP ÁN - Protected (Admin/GV)
// =============================================

/**
 * @swagger
 * /api/dapan/{id}:
 *   put:
 *     summary: Cập nhật đáp án
 *     tags: [DapAn]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateDapAnRequest'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 *       404:
 *         description: Đáp án không tồn tại
 */
router.put(
  '/dapan/:id',
  authMiddleware,
  roleMiddleware(['ADMIN', 'GIAO_VIEN']),
  controller.updateDapAn
);

/**
 * @swagger
 * /api/dapan/{id}:
 *   delete:
 *     summary: Xóa đáp án
 *     tags: [DapAn]
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
 *       404:
 *         description: Đáp án không tồn tại
 */
router.delete(
  '/dapan/:id',
  authMiddleware,
  roleMiddleware(['ADMIN', 'GIAO_VIEN']),
  controller.deleteDapAn
);

export default router;