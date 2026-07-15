// src/modules/lichhoc/routes/lichhoc.routes.ts

import { Router } from 'express';
import { LichHocController } from '../controllers/lichhoc.controller.js';
import { authMiddleware, roleMiddleware } from '../../auth/middleware/auth.middleware.js';

const router = Router();
const controller = new LichHocController();

// ==================================================
// Public APIs
// ==================================================

/**
 * @swagger
 * /api/lichhoc:
 *   get:
 *     summary: Lấy danh sách lịch học (phân trang, tìm kiếm, lọc, sắp xếp)
 *     tags: [LichHoc]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: lopHoc
 *         schema: { type: integer }
 *       - in: query
 *         name: caHoc
 *         schema: { type: integer }
 *       - in: query
 *         name: thuTrongTuan
 *         schema: { type: integer }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [HOAT_DONG, TAM_DUNG, ALL] }
 *       - in: query
 *         name: sort_by
 *         schema: { type: string, enum: [CreatedAt, ThuTrongTuan, NgayApDung, NgayKetThuc] }
 *       - in: query
 *         name: order
 *         schema: { type: string, enum: [asc, desc] }
 *     responses:
 *       200:
 *         description: Danh sách lịch học
 */
router.get('/', controller.getList);

/**
 * @swagger
 * /api/lichhoc/lophoc/{lopHocId}:
 *   get:
 *     summary: Lấy danh sách lịch học của lớp
 *     tags: [LichHoc]
 *     parameters:
 *       - in: path
 *         name: lopHocId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Danh sách lịch học của lớp
 *       404:
 *         description: Lớp học không tồn tại
 */
router.get('/lophoc/:lopHocId', controller.getListByLopHoc);

/**
 * @swagger
 * /api/lichhoc/status-options:
 *   get:
 *     summary: Lấy danh sách trạng thái (dropdown)
 *     tags: [LichHoc]
 *     responses:
 *       200:
 *         description: Danh sách trạng thái
 */
router.get('/status-options', controller.getStatusOptions);

/**
 * @swagger
 * /api/lichhoc/thu-options:
 *   get:
 *     summary: Lấy danh sách thứ trong tuần (dropdown)
 *     tags: [LichHoc]
 *     responses:
 *       200:
 *         description: Danh sách thứ trong tuần
 */
router.get('/thu-options', controller.getThuOptions);

/**
 * @swagger
 * /api/lichhoc/{id}:
 *   get:
 *     summary: Xem chi tiết lịch học
 *     tags: [LichHoc]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Thông tin chi tiết lịch học
 *       404:
 *         description: Lịch học không tồn tại
 */
router.get('/:id', controller.getById);

// ==================================================
// Protected APIs (Admin)
// ==================================================

/**
 * @swagger
 * /api/lichhoc:
 *   post:
 *     summary: Thêm mới lịch học
 *     tags: [LichHoc]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [LopHocID, ThuTrongTuan, CaHocID, NgayApDung, NgayKetThuc]
 *             properties:
 *               LopHocID: { type: integer }
 *               ThuTrongTuan: { type: integer, enum: [1,2,3,4,5,6,7] }
 *               CaHocID: { type: integer }
 *               PhongHocID: { type: integer }
 *               NgayApDung: { type: string, format: date }
 *               NgayKetThuc: { type: string, format: date }
 *               TrangThai: { type: string, enum: [HOAT_DONG, TAM_DUNG] }
 *     responses:
 *       201:
 *         description: Tạo lịch học thành công
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
 * /api/lichhoc/{id}:
 *   put:
 *     summary: Cập nhật lịch học
 *     tags: [LichHoc]
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
 *               LopHocID: { type: integer }
 *               ThuTrongTuan: { type: integer, enum: [1,2,3,4,5,6,7] }
 *               CaHocID: { type: integer }
 *               PhongHocID: { type: integer }
 *               NgayApDung: { type: string, format: date }
 *               NgayKetThuc: { type: string, format: date }
 *               TrangThai: { type: string, enum: [HOAT_DONG, TAM_DUNG] }
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
 * /api/lichhoc/{id}:
 *   delete:
 *     summary: Xóa lịch học
 *     tags: [LichHoc]
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

/**
 * @swagger
 * /api/lichhoc/{id}/generate-buoihoc:
 *   post:
 *     summary: Tạo buổi học từ lịch học
 *     tags: [LichHoc]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Tạo buổi học thành công
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 *       404:
 *         description: Lịch học không tồn tại
 */
router.post(
  '/:id/generate-buoihoc',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  controller.generateBuoiHoc
);

export default router;