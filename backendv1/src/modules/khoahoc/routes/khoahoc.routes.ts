// src/modules/khoahoc/routes/khoahoc.routes.ts

import { Router } from 'express';
import { KhoaHocController } from '../controllers/khoahoc.controller.js';
import { authMiddleware, roleMiddleware } from '../../auth/middleware/auth.middleware.js';

const router = Router();
const controller = new KhoaHocController();

// =============================================
// KHÓA HỌC - Public
// =============================================

/**
 * @swagger
 * /api/khoahoc:
 *   get:
 *     summary: Lấy danh sách khóa học (phân trang, tìm kiếm, lọc, sắp xếp)
 *     tags: [KhoaHoc]
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
 *         name: trinhDo
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [SAP_MO, DANG_MO, TAM_DUNG, ALL] }
 *       - in: query
 *         name: sort_by
 *         schema: { type: string, enum: [createdAt, tenKhoaHoc, hocPhi, trangThai] }
 *       - in: query
 *         name: order
 *         schema: { type: string, enum: [asc, desc] }
 *     responses:
 *       200:
 *         description: Danh sách khóa học
 */
router.get('/', controller.getList);

/**
 * @swagger
 * /api/khoahoc/options:
 *   get:
 *     summary: Lấy danh sách khóa học (dropdown)
 *     tags: [KhoaHoc]
 *     responses:
 *       200:
 *         description: Danh sách khóa học cho dropdown
 */
router.get('/options', controller.getOptions);

/**
 * @swagger
 * /api/khoahoc/trinhdo-options:
 *   get:
 *     summary: Lấy danh sách trình độ (dropdown)
 *     tags: [KhoaHoc]
 *     responses:
 *       200:
 *         description: Danh sách trình độ
 */
router.get('/trinhdo-options', controller.getTrinhDoOptions);

/**
 * @swagger
 * /api/khoahoc/status-options:
 *   get:
 *     summary: Lấy danh sách trạng thái khóa học (dropdown)
 *     tags: [KhoaHoc]
 *     responses:
 *       200:
 *         description: Danh sách trạng thái
 */
router.get('/status-options', controller.getStatusOptions);

/**
 * @swagger
 * /api/khoahoc/{id}:
 *   get:
 *     summary: Xem chi tiết khóa học
 *     tags: [KhoaHoc]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Thông tin chi tiết khóa học
 *       404:
 *         description: Khóa học không tồn tại
 */
router.get('/:id', controller.getById);

// =============================================
// KHÓA HỌC - Protected (Admin/GV)
// =============================================

/**
 * @swagger
 * /api/khoahoc:
 *   post:
 *     summary: Thêm mới khóa học
 *     tags: [KhoaHoc]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [tenKhoaHoc, trinhDoID]
 *             properties:
 *               tenKhoaHoc: { type: string }
 *               trinhDoID: { type: integer }
 *               hocPhi: { type: number }
 *               moTa: { type: string }
 *               trangThai: { type: string, enum: [SAP_MO, DANG_MO, TAM_DUNG] }
 *     responses:
 *       201:
 *         description: Tạo khóa học thành công
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 */
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['ADMIN', 'GIAO_VIEN']),
  controller.create
);

/**
 * @swagger
 * /api/khoahoc/{id}:
 *   put:
 *     summary: Cập nhật khóa học
 *     tags: [KhoaHoc]
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
 *               tenKhoaHoc: { type: string }
 *               trinhDoID: { type: integer }
 *               hocPhi: { type: number }
 *               moTa: { type: string }
 *               trangThai: { type: string, enum: [SAP_MO, DANG_MO, TAM_DUNG] }
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
  controller.update
);

/**
 * @swagger
 * /api/khoahoc/{id}:
 *   delete:
 *     summary: Xóa khóa học
 *     tags: [KhoaHoc]
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

// =============================================
// BÀI HỌC (Nested trong khóa học)
// =============================================

/**
 * @swagger
 * /api/khoahoc/{khoaHocId}/baihoc:
 *   get:
 *     summary: Lấy danh sách bài học của khóa học
 *     tags: [BaiHoc]
 *     parameters:
 *       - in: path
 *         name: khoaHocId
 *         required: true
 *         schema: { type: integer }
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
 *         schema: { type: string, enum: [AN, HIEN, ALL] }
 *       - in: query
 *         name: sort_by
 *         schema: { type: string, enum: [createdAt, tenBaiHoc, thuTuHienThi] }
 *       - in: query
 *         name: order
 *         schema: { type: string, enum: [asc, desc] }
 *     responses:
 *       200:
 *         description: Danh sách bài học
 */
router.get('/:khoaHocId/baihoc', controller.getBaiHocList);

/**
 * @swagger
 * /api/khoahoc/{khoaHocId}/baihoc:
 *   post:
 *     summary: Thêm bài học mới
 *     tags: [BaiHoc]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: khoaHocId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [tenBaiHoc]
 *             properties:
 *               tenBaiHoc: { type: string }
 *               moTa: { type: string }
 *               thuTuHienThi: { type: integer }
 *               trangThai: { type: string, enum: [AN, HIEN] }
 *     responses:
 *       201:
 *         description: Tạo bài học thành công
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 */
router.post(
  '/:khoaHocId/baihoc',
  authMiddleware,
  roleMiddleware(['ADMIN', 'GIAO_VIEN']),
  controller.createBaiHoc
);

/**
 * @swagger
 * /api/khoahoc/{khoaHocId}/baihoc/order:
 *   put:
 *     summary: Cập nhật thứ tự bài học (Bulk update)
 *     tags: [BaiHoc]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: khoaHocId
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
 *                   required: [baiHocID, thuTuHienThi]
 *                   properties:
 *                     baiHocID: { type: integer }
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
  '/:khoaHocId/baihoc/order',
  authMiddleware,
  roleMiddleware(['ADMIN', 'GIAO_VIEN']),
  controller.updateBaiHocOrder
);

export default router;