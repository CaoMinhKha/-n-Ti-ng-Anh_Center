// src/modules/dotkhaigiang/routes/dotkhaigiang.routes.ts

import { Router } from 'express';
import { DotKhaiGiangController } from '../controllers/dotkhaigiang.controller.js';
import { authMiddleware, roleMiddleware } from '../../auth/middleware/auth.middleware.js';

const router = Router();
const controller = new DotKhaiGiangController();

// ==================================================
// Public APIs
// ==================================================

/**
 * @swagger
 * /api/dotkhaigiang:
 *   get:
 *     summary: Lấy danh sách đợt khai giảng (phân trang, tìm kiếm, lọc, sắp xếp)
 *     tags: [DotKhaiGiang]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [SAP_MO, DANG_MO, DA_DONG, ALL] }
 *       - in: query
 *         name: sort_by
 *         schema: { type: string, enum: [CreatedAt, MaDot, TenDot, NgayMoDangKy] }
 *       - in: query
 *         name: order
 *         schema: { type: string, enum: [asc, desc] }
 *     responses:
 *       200:
 *         description: Danh sách đợt khai giảng
 */
router.get('/', controller.getList);

/**
 * @swagger
 * /api/dotkhaigiang/status-options:
 *   get:
 *     summary: Lấy danh sách trạng thái (dropdown)
 *     tags: [DotKhaiGiang]
 *     responses:
 *       200:
 *         description: Danh sách trạng thái
 */
router.get('/status-options', controller.getStatusOptions);

/**
 * @swagger
 * /api/dotkhaigiang/options:
 *   get:
 *     summary: Lấy danh sách đợt khai giảng (dropdown)
 *     tags: [DotKhaiGiang]
 *     responses:
 *       200:
 *         description: Danh sách đợt khai giảng cho dropdown
 */
router.get('/options', controller.getOptions);

/**
 * @swagger
 * /api/dotkhaigiang/{id}:
 *   get:
 *     summary: Xem chi tiết đợt khai giảng
 *     tags: [DotKhaiGiang]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Thông tin chi tiết đợt khai giảng
 *       404:
 *         description: Đợt khai giảng không tồn tại
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /api/dotkhaigiang/ma/{maDot}:
 *   get:
 *     summary: Lấy đợt khai giảng theo mã
 *     tags: [DotKhaiGiang]
 *     parameters:
 *       - in: path
 *         name: maDot
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Thông tin đợt khai giảng
 *       404:
 *         description: Mã đợt không tồn tại
 */
router.get('/ma/:maDot', controller.getByMaDot);

// ==================================================
// Protected APIs (Cần Admin)
// ==================================================

/**
 * @swagger
 * /api/dotkhaigiang:
 *   post:
 *     summary: Thêm mới đợt khai giảng
 *     tags: [DotKhaiGiang]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [MaDot, TenDot, NgayMoDangKy, NgayDongDangKy]
 *             properties:
 *               MaDot: { type: string }
 *               TenDot: { type: string }
 *               NgayMoDangKy: { type: string, format: date }
 *               NgayDongDangKy: { type: string, format: date }
 *               MoTa: { type: string }
 *               TrangThai: { type: string, enum: [SAP_MO, DANG_MO, DA_DONG] }
 *     responses:
 *       201:
 *         description: Tạo đợt khai giảng thành công
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 */
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  controller.create
);

/**
 * @swagger
 * /api/dotkhaigiang/{id}:
 *   put:
 *     summary: Cập nhật đợt khai giảng
 *     tags: [DotKhaiGiang]
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
 *               MaDot: { type: string }
 *               TenDot: { type: string }
 *               NgayMoDangKy: { type: string, format: date }
 *               NgayDongDangKy: { type: string, format: date }
 *               MoTa: { type: string }
 *               TrangThai: { type: string, enum: [SAP_MO, DANG_MO, DA_DONG] }
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
  roleMiddleware(['ADMIN']),
  controller.update
);

/**
 * @swagger
 * /api/dotkhaigiang/{id}:
 *   delete:
 *     summary: Xóa đợt khai giảng
 *     tags: [DotKhaiGiang]
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
  roleMiddleware(['ADMIN']),
  controller.delete
);

export default router;