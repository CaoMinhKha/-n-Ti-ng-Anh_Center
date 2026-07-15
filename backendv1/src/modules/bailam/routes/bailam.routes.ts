// src/modules/bailam/routes/bailam.routes.ts

import { Router } from 'express';
import { BaiLamController } from '../controllers/bailam.controller.js';
import { authMiddleware, roleMiddleware } from '../../auth/middleware/auth.middleware.js';

const router = Router();
const controller = new BaiLamController();

// ==================================================
// Bài làm
// ==================================================

/**
 * @swagger
 * /api/bailam:
 *   get:
 *     summary: Lấy danh sách bài làm
 *     tags: [BaiLam]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: baiKiemTra
 *         schema: { type: integer }
 *       - in: query
 *         name: hocVien
 *         schema: { type: integer }
 *       - in: query
 *         name: lopHoc
 *         schema: { type: integer }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [DANG_LAM, DA_NOP, HET_GIO, ALL] }
 *       - in: query
 *         name: sort_by
 *         schema: { type: string, enum: [CreatedAt, ThoiGianNop, TongDiem] }
 *       - in: query
 *         name: order
 *         schema: { type: string, enum: [asc, desc] }
 *     responses:
 *       200:
 *         description: Danh sách bài làm
 */
router.get('/', controller.getList);

/**
 * @swagger
 * /api/bailam/hocvien/{hocVienId}:
 *   get:
 *     summary: Lấy danh sách bài làm của học viên
 *     tags: [BaiLam]
 *     parameters:
 *       - in: path
 *         name: hocVienId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Danh sách bài làm của học viên
 */
router.get('/hocvien/:hocVienId', controller.getListByHocVien);

/**
 * @swagger
 * /api/bailam/baikiemtra/{baiKiemTraId}:
 *   get:
 *     summary: Lấy danh sách bài làm của bài kiểm tra
 *     tags: [BaiLam]
 *     parameters:
 *       - in: path
 *         name: baiKiemTraId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Danh sách bài làm của bài kiểm tra
 */
router.get('/baikiemtra/:baiKiemTraId', controller.getListByBaiKiemTra);

/**
 * @swagger
 * /api/bailam/status-options:
 *   get:
 *     summary: Lấy danh sách trạng thái bài làm (dropdown)
 *     tags: [BaiLam]
 *     responses:
 *       200:
 *         description: Danh sách trạng thái
 */
router.get('/status-options', controller.getStatusOptions);

/**
 * @swagger
 * /api/bailam/{id}:
 *   get:
 *     summary: Xem chi tiết bài làm
 *     tags: [BaiLam]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Chi tiết bài làm
 *       404:
 *         description: Bài làm không tồn tại
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /api/bailam:
 *   post:
 *     summary: Tạo bài làm mới
 *     tags: [BaiLam]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [BaiKiemTraID, HocVienID, LopHocID, ThoiGianBatDau]
 *             properties:
 *               BaiKiemTraID: { type: integer }
 *               HocVienID: { type: integer }
 *               LopHocID: { type: integer }
 *               ThoiGianBatDau: { type: string, format: date-time }
 *               ThoiGianNop: { type: string, format: date-time }
 *               TongDiem: { type: number }
 *               TrangThai: { type: string, enum: [DANG_LAM, DA_NOP, HET_GIO] }
 *     responses:
 *       201:
 *         description: Tạo bài làm thành công
 *       409:
 *         description: Học viên đã làm bài
 */
router.post('/', controller.create);

/**
 * @swagger
 * /api/bailam/{id}:
 *   put:
 *     summary: Cập nhật bài làm
 *     tags: [BaiLam]
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
 *               ThoiGianNop: { type: string, format: date-time }
 *               TongDiem: { type: number }
 *               TrangThai: { type: string, enum: [DANG_LAM, DA_NOP, HET_GIO] }
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put('/:id', controller.update);

/**
 * @swagger
 * /api/bailam/{id}:
 *   delete:
 *     summary: Xóa bài làm
 *     tags: [BaiLam]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.delete('/:id', controller.delete);

// ==================================================
// Chi tiết bài làm
// ==================================================

/**
 * @swagger
 * /api/bailam/{baiLamId}/chitiet:
 *   post:
 *     summary: Thêm chi tiết bài làm
 *     tags: [BaiLamChiTiet]
 *     parameters:
 *       - in: path
 *         name: baiLamId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [CauHoiID]
 *             properties:
 *               CauHoiID: { type: integer }
 *               DapAnID: { type: integer }
 *               NoiDungTraLoi: { type: string }
 *               LaDung: { type: boolean }
 *     responses:
 *       201:
 *         description: Thêm chi tiết thành công
 */
router.post('/:baiLamId/chitiet', controller.addChiTiet);

/**
 * @swagger
 * /api/bailam/{baiLamId}/chitiet/{cauHoiId}:
 *   put:
 *     summary: Cập nhật chi tiết bài làm
 *     tags: [BaiLamChiTiet]
 *     parameters:
 *       - in: path
 *         name: baiLamId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: cauHoiId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               DapAnID: { type: integer }
 *               NoiDungTraLoi: { type: string }
 *               LaDung: { type: boolean }
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put('/:baiLamId/chitiet/:cauHoiId', controller.updateChiTiet);

/**
 * @swagger
 * /api/bailam/{baiLamId}/chitiet/{cauHoiId}:
 *   delete:
 *     summary: Xóa chi tiết bài làm
 *     tags: [BaiLamChiTiet]
 *     parameters:
 *       - in: path
 *         name: baiLamId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: cauHoiId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.delete('/:baiLamId/chitiet/:cauHoiId', controller.deleteChiTiet);

export default router;