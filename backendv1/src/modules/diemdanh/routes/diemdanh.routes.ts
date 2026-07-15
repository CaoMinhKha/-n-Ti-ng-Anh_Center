// src/modules/diemdanh/routes/diemdanh.routes.ts

import { Router } from 'express';
import { DiemDanhController } from '../controllers/diemdanh.controller.js';
import { authMiddleware, roleMiddleware } from '../../auth/middleware/auth.middleware.js';

const router = Router();
const controller = new DiemDanhController();

// ==================================================
// Điểm danh học viên
// ==================================================

/**
 * @swagger
 * /api/diemdanh:
 *   get:
 *     summary: Lấy danh sách điểm danh
 *     tags: [DiemDanh]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: buoiHoc
 *         schema: { type: integer }
 *       - in: query
 *         name: hocVien
 *         schema: { type: integer }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [CO_MAT, VANG_CO_PHEP, VANG_KHONG_PHEP, DI_MUON, ALL] }
 *       - in: query
 *         name: sort_by
 *         schema: { type: string, enum: [CreatedAt, ThoiGianCheckIn] }
 *       - in: query
 *         name: order
 *         schema: { type: string, enum: [asc, desc] }
 *     responses:
 *       200:
 *         description: Danh sách điểm danh
 */
router.get('/', controller.getList);

/**
 * @swagger
 * /api/diemdanh/buoihoc/{buoiHocId}:
 *   get:
 *     summary: Lấy danh sách điểm danh của buổi học
 *     tags: [DiemDanh]
 *     parameters:
 *       - in: path
 *         name: buoiHocId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Danh sách điểm danh của buổi học
 */
router.get('/buoihoc/:buoiHocId', controller.getListByBuoiHoc);

/**
 * @swagger
 * /api/diemdanh/hocvien/{hocVienId}:
 *   get:
 *     summary: Lấy danh sách điểm danh của học viên
 *     tags: [DiemDanh]
 *     parameters:
 *       - in: path
 *         name: hocVienId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Danh sách điểm danh của học viên
 */
router.get('/hocvien/:hocVienId', controller.getListByHocVien);

/**
 * @swagger
 * /api/diemdanh/status-options:
 *   get:
 *     summary: Lấy danh sách trạng thái điểm danh (dropdown)
 *     tags: [DiemDanh]
 *     responses:
 *       200:
 *         description: Danh sách trạng thái
 */
router.get('/status-options', controller.getStatusOptions);

/**
 * @swagger
 * /api/diemdanh:
 *   post:
 *     summary: Tạo điểm danh mới
 *     tags: [DiemDanh]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [HocVienID, BuoiHocID, TrangThaiDiemDanh]
 *             properties:
 *               HocVienID: { type: integer }
 *               BuoiHocID: { type: integer }
 *               TrangThaiDiemDanh: { type: string, enum: [CO_MAT, VANG_CO_PHEP, VANG_KHONG_PHEP, DI_MUON] }
 *               ThoiGianCheckIn: { type: string, format: date-time }
 *               GhiChu: { type: string }
 *     responses:
 *       201:
 *         description: Tạo điểm danh thành công
 *       409:
 *         description: Học viên đã được điểm danh
 */
router.post('/', controller.create);

/**
 * @swagger
 * /api/diemdanh/{hocVienId}/{buoiHocId}:
 *   put:
 *     summary: Cập nhật điểm danh
 *     tags: [DiemDanh]
 *     parameters:
 *       - in: path
 *         name: hocVienId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: buoiHocId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               TrangThaiDiemDanh: { type: string, enum: [CO_MAT, VANG_CO_PHEP, VANG_KHONG_PHEP, DI_MUON] }
 *               ThoiGianCheckIn: { type: string, format: date-time }
 *               GhiChu: { type: string }
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put('/:hocVienId/:buoiHocId', controller.update);

/**
 * @swagger
 * /api/diemdanh/{hocVienId}/{buoiHocId}:
 *   delete:
 *     summary: Xóa điểm danh
 *     tags: [DiemDanh]
 *     parameters:
 *       - in: path
 *         name: hocVienId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: buoiHocId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.delete('/:hocVienId/:buoiHocId', controller.delete);

// ==================================================
// Mã điểm danh
// ==================================================

/**
 * @swagger
 * /api/diemdanh/madiemdanh:
 *   post:
 *     summary: Tạo mã điểm danh
 *     tags: [MaDiemDanh]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [BuoiHocID, GiaoVienID]
 *             properties:
 *               BuoiHocID: { type: integer }
 *               GiaoVienID: { type: integer }
 *               ThoiGianHetHan: { type: string, format: date-time }
 *               TrangThai: { type: string, enum: [DANG_HOAT_DONG, HET_HAN, DA_DONG] }
 *     responses:
 *       201:
 *         description: Tạo mã điểm danh thành công
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 */
router.post(
  '/madiemdanh',
  authMiddleware,
  roleMiddleware(['ADMIN', 'GIAO_VIEN']),
  controller.createMaDiemDanh
);

/**
 * @swagger
 * /api/diemdanh/madiemdanh/buoihoc/{buoiHocId}:
 *   get:
 *     summary: Lấy mã điểm danh của buổi học
 *     tags: [MaDiemDanh]
 *     parameters:
 *       - in: path
 *         name: buoiHocId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Mã điểm danh của buổi học
 */
router.get('/madiemdanh/buoihoc/:buoiHocId', controller.getMaDiemDanhByBuoiHoc);

/**
 * @swagger
 * /api/diemdanh/madiemdanh/verify:
 *   post:
 *     summary: Xác thực mã điểm danh
 *     tags: [MaDiemDanh]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [maCode]
 *             properties:
 *               maCode: { type: string }
 *     responses:
 *       200:
 *         description: Mã điểm danh hợp lệ
 *       400:
 *         description: Mã điểm danh không hợp lệ hoặc đã hết hạn
 */
router.post('/madiemdanh/verify', controller.verifyMaDiemDanh);

/**
 * @swagger
 * /api/diemdanh/madiemdanh/{id}/close:
 *   put:
 *     summary: Đóng mã điểm danh
 *     tags: [MaDiemDanh]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Đóng mã điểm danh thành công
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 */
router.put(
  '/madiemdanh/:id/close',
  authMiddleware,
  roleMiddleware(['ADMIN', 'GIAO_VIEN']),
  controller.closeMaDiemDanh
);

/**
 * @swagger
 * /api/diemdanh/madiemdanh/status-options:
 *   get:
 *     summary: Lấy danh sách trạng thái mã điểm danh (dropdown)
 *     tags: [MaDiemDanh]
 *     responses:
 *       200:
 *         description: Danh sách trạng thái
 */
router.get('/madiemdanh/status-options', controller.getMaStatusOptions);

export default router;