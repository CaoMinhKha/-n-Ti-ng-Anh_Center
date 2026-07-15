// src/modules/lichhoc/routes/cahoc.routes.ts

import { Router } from 'express';
import { CaHocController } from '../controllers/cahoc.controller.js';
import { authMiddleware, roleMiddleware } from '../../auth/middleware/auth.middleware.js';

const router = Router();
const controller = new CaHocController();

/**
 * @swagger
 * /api/cahoc:
 *   get:
 *     summary: Lấy danh sách ca học
 *     tags: [CaHoc]
 *     responses:
 *       200:
 *         description: Danh sách ca học
 */
router.get('/', controller.getList);

/**
 * @swagger
 * /api/cahoc/options:
 *   get:
 *     summary: Lấy danh sách ca học (dropdown)
 *     tags: [CaHoc]
 *     responses:
 *       200:
 *         description: Danh sách ca học cho dropdown
 */
router.get('/options', controller.getOptions);

/**
 * @swagger
 * /api/cahoc/{id}:
 *   get:
 *     summary: Xem chi tiết ca học
 *     tags: [CaHoc]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Thông tin chi tiết ca học
 *       404:
 *         description: Ca học không tồn tại
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /api/cahoc/ma/{maCa}:
 *   get:
 *     summary: Lấy ca học theo mã
 *     tags: [CaHoc]
 *     parameters:
 *       - in: path
 *         name: maCa
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Thông tin ca học
 *       404:
 *         description: Mã ca không tồn tại
 */
router.get('/ma/:maCa', controller.getByMaCa);

/**
 * @swagger
 * /api/cahoc:
 *   post:
 *     summary: Thêm mới ca học
 *     tags: [CaHoc]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [MaCa, TenCa, GioBatDau, GioKetThuc]
 *             properties:
 *               MaCa: { type: string }
 *               TenCa: { type: string }
 *               GioBatDau: { type: string, example: "07:30" }
 *               GioKetThuc: { type: string, example: "09:30" }
 *               TrangThai: { type: string, enum: [HOAT_DONG, NGUNG_HOAT_DONG] }
 *     responses:
 *       201:
 *         description: Tạo ca học thành công
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
 * /api/cahoc/{id}:
 *   put:
 *     summary: Cập nhật ca học
 *     tags: [CaHoc]
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
 *               MaCa: { type: string }
 *               TenCa: { type: string }
 *               GioBatDau: { type: string, example: "07:30" }
 *               GioKetThuc: { type: string, example: "09:30" }
 *               TrangThai: { type: string, enum: [HOAT_DONG, NGUNG_HOAT_DONG] }
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
 * /api/cahoc/{id}:
 *   delete:
 *     summary: Xóa ca học
 *     tags: [CaHoc]
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