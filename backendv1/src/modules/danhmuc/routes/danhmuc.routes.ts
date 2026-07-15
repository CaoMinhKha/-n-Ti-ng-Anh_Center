// src/modules/danhmuc/routes/danhmuc.routes.ts

import { Router } from 'express';
import { DanhMucController } from '../controllers/danhmuc.controller.js';
import { authMiddleware, roleMiddleware } from '../../auth/middleware/auth.middleware.js';

const router = Router();
const controller = new DanhMucController();

/**
 * @swagger
 * components:
 *   schemas:
 *     DanhMuc:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         tenDanhMuc:
 *           type: string
 *           example: "Trình độ"
 *         moTa:
 *           type: string
 *           nullable: true
 *           example: "Danh mục trình độ khóa học"
 *         thuTuHienThi:
 *           type: integer
 *           example: 1
 *         trangThai:
 *           type: string
 *           enum: [HOAT_DONG, NGUNG_HOAT_DONG]
 *           example: "HOAT_DONG"
 *         parentId:
 *           type: integer
 *           nullable: true
 *           example: null
 *         parentName:
 *           type: string
 *           nullable: true
 *           example: null
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     DanhMucListResponse:
 *       type: object
 *       properties:
 *         totalItems:
 *           type: integer
 *           example: 10
 *         totalPages:
 *           type: integer
 *           example: 2
 *         currentPage:
 *           type: integer
 *           example: 1
 *         limit:
 *           type: integer
 *           example: 10
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DanhMuc'
 *     CreateDanhMucRequest:
 *       type: object
 *       required:
 *         - tenDanhMuc
 *       properties:
 *         tenDanhMuc:
 *           type: string
 *           example: "Trình độ mới"
 *         moTa:
 *           type: string
 *           example: "Mô tả trình độ mới"
 *         thuTuHienThi:
 *           type: integer
 *           example: 10
 *         danhMucChaId:
 *           type: integer
 *           nullable: true
 *           example: null
 *         trangThai:
 *           type: string
 *           enum: [HOAT_DONG, NGUNG_HOAT_DONG]
 *           example: "HOAT_DONG"
 *     UpdateDanhMucRequest:
 *       type: object
 *       properties:
 *         tenDanhMuc:
 *           type: string
 *           example: "Trình độ cập nhật"
 *         moTa:
 *           type: string
 *           example: "Mô tả cập nhật"
 *         thuTuHienThi:
 *           type: integer
 *           example: 5
 *         danhMucChaId:
 *           type: integer
 *           nullable: true
 *         trangThai:
 *           type: string
 *           enum: [HOAT_DONG, NGUNG_HOAT_DONG]
 *           example: "HOAT_DONG"
 */

/**
 * @swagger
 * /api/danhmuc:
 *   get:
 *     summary: Lấy danh sách danh mục (phân trang, tìm kiếm, lọc, sắp xếp)
 *     tags: [DanhMuc]
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
 *         name: type
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [HOAT_DONG, NGUNG_HOAT_DONG, ALL] }
 *       - in: query
 *         name: sort_by
 *         schema: { type: string, enum: [createdAt, tenDanhMuc, thuTuHienThi, updatedAt] }
 *       - in: query
 *         name: order
 *         schema: { type: string, enum: [asc, desc] }
 *     responses:
 *       200:
 *         description: Danh sách danh mục
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DanhMucListResponse'
 */
router.get('/', controller.getList);

/**
 * @swagger
 * /api/danhmuc/types:
 *   get:
 *     summary: Lấy danh sách loại danh mục (dropdown)
 *     tags: [DanhMuc]
 *     responses:
 *       200:
 *         description: Danh sách loại danh mục
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   value:
 *                     type: integer
 *                   label:
 *                     type: string
 */
router.get('/types', controller.getTypes);

/**
 * @swagger
 * /api/danhmuc/parents:
 *   get:
 *     summary: Lấy danh sách danh mục cha (dropdown)
 *     tags: [DanhMuc]
 *     responses:
 *       200:
 *         description: Danh sách danh mục cha
 */
router.get('/parents', controller.getParents);

/**
 * @swagger
 * /api/danhmuc/all-options:
 *   get:
 *     summary: Lấy tất cả danh mục (dropdown)
 *     tags: [DanhMuc]
 *     responses:
 *       200:
 *         description: Tất cả danh mục
 */
router.get('/all-options', controller.getAllOptions);

/**
 * @swagger
 * /api/danhmuc/{id}:
 *   get:
 *     summary: Xem chi tiết danh mục
 *     tags: [DanhMuc]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Thông tin chi tiết danh mục
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DanhMuc'
 *       404:
 *         description: Danh mục không tồn tại
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /api/danhmuc:
 *   post:
 *     summary: Thêm mới danh mục
 *     tags: [DanhMuc]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDanhMucRequest'
 *     responses:
 *       201:
 *         description: Tạo danh mục thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DanhMuc'
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
 * /api/danhmuc/{id}:
 *   put:
 *     summary: Cập nhật danh mục
 *     tags: [DanhMuc]
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
 *             $ref: '#/components/schemas/UpdateDanhMucRequest'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DanhMuc'
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
 * /api/danhmuc/{id}:
 *   delete:
 *     summary: Xóa danh mục
 *     tags: [DanhMuc]
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