// src/modules/khoahoc/routes/phanbaihoc.routes.ts

import { Router } from 'express';
import { KhoaHocController } from '../controllers/khoahoc.controller.js';
import { authMiddleware, roleMiddleware } from '../../auth/middleware/auth.middleware.js';

const router = Router();
const controller = new KhoaHocController();

// =============================================
// ⚠️ ROUTES CỤ THỂ (ĐẶT TRƯỚC ROUTES CÓ THAM SỐ)
// =============================================

/**
 * @swagger
 * /api/phanbaihoc/loai-options:
 *   get:
 *     summary: Lấy danh sách loại phần bài học (dropdown)
 *     tags: [PhanBaiHoc]
 *     responses:
 *       200:
 *         description: Danh sách loại phần bài học
 */
router.get('/phanbaihoc/loai-options', controller.getLoaiPhanBaiHocOptions);

// =============================================
// PHẦN BÀI HỌC CRUD (prefix: /phanbaihoc)
// =============================================

/**
 * @swagger
 * /api/phanbaihoc/{id}:
 *   get:
 *     summary: Xem chi tiết phần bài học
 *     tags: [PhanBaiHoc]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Thông tin chi tiết phần bài học
 *       404:
 *         description: Phần bài học không tồn tại
 */
router.get('/phanbaihoc/:id', controller.getPhanBaiHocById);

/**
 * @swagger
 * /api/phanbaihoc/{id}:
 *   put:
 *     summary: Cập nhật phần bài học
 *     tags: [PhanBaiHoc]
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
 *               tenPhanBaiHoc: { type: string }
 *               loaiPhanBaiHocID: { type: integer }
 *               tieuDe: { type: string }
 *               videoUrl: { type: string }
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
  '/phanbaihoc/:id',
  authMiddleware,
  roleMiddleware(['ADMIN', 'GIAO_VIEN']),
  controller.updatePhanBaiHoc
);

/**
 * @swagger
 * /api/phanbaihoc/{id}:
 *   delete:
 *     summary: Xóa phần bài học
 *     tags: [PhanBaiHoc]
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
  '/phanbaihoc/:id',
  authMiddleware,
  roleMiddleware(['ADMIN', 'GIAO_VIEN']),
  controller.deletePhanBaiHoc
);

// =============================================
// PHẦN BÀI HỌC THEO BÀI HỌC (prefix: /baihoc)
// =============================================

/**
 * @swagger
 * /api/baihoc/{baiHocId}/phanbaihoc:
 *   get:
 *     summary: Lấy danh sách phần bài học của bài học
 *     tags: [PhanBaiHoc]
 *     parameters:
 *       - in: path
 *         name: baiHocId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Danh sách phần bài học
 */
router.get('/baihoc/:baiHocId/phanbaihoc', controller.getPhanBaiHocList);

/**
 * @swagger
 * /api/baihoc/{baiHocId}/phanbaihoc:
 *   post:
 *     summary: Thêm phần bài học mới
 *     tags: [PhanBaiHoc]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: baiHocId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [tenPhanBaiHoc, loaiPhanBaiHocID]
 *             properties:
 *               tenPhanBaiHoc: { type: string }
 *               loaiPhanBaiHocID: { type: integer }
 *               tieuDe: { type: string }
 *               videoUrl: { type: string }
 *               thuTuHienThi: { type: integer }
 *               trangThai: { type: string, enum: [AN, HIEN] }
 *     responses:
 *       201:
 *         description: Tạo phần bài học thành công
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 */
router.post(
  '/baihoc/:baiHocId/phanbaihoc',
  authMiddleware,
  roleMiddleware(['ADMIN', 'GIAO_VIEN']),
  controller.createPhanBaiHoc
);

/**
 * @swagger
 * /api/baihoc/{baiHocId}/phanbaihoc/order:
 *   put:
 *     summary: Cập nhật thứ tự phần bài học (Bulk update)
 *     tags: [PhanBaiHoc]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: baiHocId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [orders]
 *             properties:
 *               orders:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [phanBaiHocID, thuTuHienThi]
 *                   properties:
 *                     phanBaiHocID: { type: integer }
 *                     thuTuHienThi: { type: integer }
 *     responses:
 *       200:
 *         description: Cập nhật thứ tự thành công
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 */
router.put(
  '/baihoc/:baiHocId/phanbaihoc/order',
  authMiddleware,
  roleMiddleware(['ADMIN', 'GIAO_VIEN']),
  controller.updatePhanBaiHocOrder
);

export default router;