// src/modules/lichhoc/routes/phonghoc.routes.ts

import { Router } from 'express';
import { PhongHocController } from '../controllers/phonghoc.controller.js';
import { authMiddleware, roleMiddleware } from '../../auth/middleware/auth.middleware.js';

const router = Router();
const controller = new PhongHocController();

/**
 * @swagger
 * /api/phonghoc:
 *   get:
 *     summary: Lấy danh sách phòng học
 *     tags: [PhongHoc]
 *     responses:
 *       200:
 *         description: Danh sách phòng học
 */
router.get('/', controller.getList);

/**
 * @swagger
 * /api/phonghoc/options:
 *   get:
 *     summary: Lấy danh sách phòng học (dropdown)
 *     tags: [PhongHoc]
 *     responses:
 *       200:
 *         description: Danh sách phòng học cho dropdown
 */
router.get('/options', controller.getOptions);

/**
 * @swagger
 * /api/phonghoc/status-options:
 *   get:
 *     summary: Lấy danh sách trạng thái phòng (dropdown)
 *     tags: [PhongHoc]
 *     responses:
 *       200:
 *         description: Danh sách trạng thái phòng
 */
router.get('/status-options', controller.getStatusOptions);

/**
 * @swagger
 * /api/phonghoc/{id}:
 *   get:
 *     summary: Xem chi tiết phòng học
 *     tags: [PhongHoc]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Thông tin chi tiết phòng học
 *       404:
 *         description: Phòng học không tồn tại
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /api/phonghoc/ma/{maPhong}:
 *   get:
 *     summary: Lấy phòng học theo mã
 *     tags: [PhongHoc]
 *     parameters:
 *       - in: path
 *         name: maPhong
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Thông tin phòng học
 *       404:
 *         description: Mã phòng không tồn tại
 */
router.get('/ma/:maPhong', controller.getByMaPhong);

/**
 * @swagger
 * /api/phonghoc:
 *   post:
 *     summary: Thêm mới phòng học
 *     tags: [PhongHoc]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [MaPhong, TenPhong, SucChua]
 *             properties:
 *               MaPhong: { type: string }
 *               TenPhong: { type: string }
 *               SucChua: { type: integer }
 *               ToaNha: { type: string }
 *               TrangThai: { type: string, enum: [TRONG, DANG_SU_DUNG, BAO_TRI] }
 *     responses:
 *       201:
 *         description: Tạo phòng học thành công
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
 * /api/phonghoc/{id}:
 *   put:
 *     summary: Cập nhật phòng học
 *     tags: [PhongHoc]
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
 *               MaPhong: { type: string }
 *               TenPhong: { type: string }
 *               SucChua: { type: integer }
 *               ToaNha: { type: string }
 *               TrangThai: { type: string, enum: [TRONG, DANG_SU_DUNG, BAO_TRI] }
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
 * /api/phonghoc/{id}:
 *   delete:
 *     summary: Xóa phòng học
 *     tags: [PhongHoc]
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