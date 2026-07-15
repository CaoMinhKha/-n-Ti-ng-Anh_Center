// src/modules/khoahoc/routes/baikiemtra.routes.ts

import { Router } from 'express';
import { KhoaHocController } from '../controllers/khoahoc.controller.js';
import { authMiddleware, roleMiddleware } from '../../auth/middleware/auth.middleware.js';

const router = Router();
const controller = new KhoaHocController();

// =============================================
// ⚠️ QUAN TRỌNG: Routes CỤ THỂ (có prefix dài hơn) phải đặt TRƯỚC
// =============================================

// =============================================
// ROUTES CỤ THỂ (có nhiều segment) - ĐẶT TRƯỚC
// =============================================

/**
 * @swagger
 * /api/baikiemtra/{baiKiemTraId}/cauhoi:
 *   get:
 *     summary: Lấy danh sách câu hỏi của bài kiểm tra
 *     tags: [BaiKiemTraCauHoi]
 *     parameters:
 *       - in: path
 *         name: baiKiemTraId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Danh sách câu hỏi của bài kiểm tra
 */
router.get(
  '/baikiemtra/:baiKiemTraId/cauhoi',
  controller.getCauHoiListByBaiKiemTra
);

/**
 * @swagger
 * /api/baikiemtra/{baiKiemTraId}/cauhoi/available:
 *   get:
 *     summary: Lấy danh sách câu hỏi có thể thêm vào bài kiểm tra
 *     tags: [BaiKiemTraCauHoi]
 *     parameters:
 *       - in: path
 *         name: baiKiemTraId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Danh sách câu hỏi có thể thêm
 */
router.get(
  '/baikiemtra/:baiKiemTraId/cauhoi/available',
  controller.getAvailableCauHoisForBaiKiemTra
);

/**
 * @swagger
 * /api/baikiemtra/{baiKiemTraId}/cauhoi:
 *   post:
 *     summary: Thêm câu hỏi vào bài kiểm tra
 *     tags: [BaiKiemTraCauHoi]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: baiKiemTraId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [cauHoiID]
 *             properties:
 *               cauHoiID:
 *                 type: integer
 *               thuTuHienThi:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Thêm câu hỏi thành công
 */
router.post(
  '/baikiemtra/:baiKiemTraId/cauhoi',
  authMiddleware,
  roleMiddleware(['ADMIN', 'GIAO_VIEN']),
  controller.addCauHoiToBaiKiemTra
);

/**
 * @swagger
 * /api/baikiemtra/{baiKiemTraId}/cauhoi/{cauHoiId}:
 *   delete:
 *     summary: Xóa câu hỏi khỏi bài kiểm tra
 *     tags: [BaiKiemTraCauHoi]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: baiKiemTraId
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
router.delete(
  '/baikiemtra/:baiKiemTraId/cauhoi/:cauHoiId',
  authMiddleware,
  roleMiddleware(['ADMIN', 'GIAO_VIEN']),
  controller.removeCauHoiFromBaiKiemTra
);

/**
 * @swagger
 * /api/baikiemtra/{baiKiemTraId}/cauhoi/{cauHoiId}/order:
 *   patch:
 *     summary: Cập nhật thứ tự câu hỏi trong bài kiểm tra
 *     tags: [BaiKiemTraCauHoi]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: baiKiemTraId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: cauHoiId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [thuTuHienThi]
 *             properties:
 *               thuTuHienThi:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.patch(
  '/baikiemtra/:baiKiemTraId/cauhoi/:cauHoiId/order',
  authMiddleware,
  roleMiddleware(['ADMIN', 'GIAO_VIEN']),
  controller.updateCauHoiOrderInBaiKiemTra
);

// =============================================
// BÀI KIỂM TRA CRUD (ĐẶT SAU)
// =============================================

/**
 * @swagger
 * /api/baikiemtra/{id}:
 *   get:
 *     summary: Xem chi tiết bài kiểm tra
 *     tags: [BaiKiemTra]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Thông tin chi tiết bài kiểm tra
 *       404:
 *         description: Bài kiểm tra không tồn tại
 */
router.get('/baikiemtra/:id', controller.getBaiKiemTraById);

/**
 * @swagger
 * /api/baikiemtra/{id}:
 *   put:
 *     summary: Cập nhật bài kiểm tra
 *     tags: [BaiKiemTra]
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
 *               tenBaiKiemTra: { type: string }
 *               thoiGianBatDau: { type: string, format: date-time }
 *               thoiGianLamBai: { type: integer }
 *               diemDat: { type: number }
 *               diemMax: { type: number }
 *               trangThai: { type: string, enum: [AN, HIEN] }
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put(
  '/baikiemtra/:id',
  authMiddleware,
  roleMiddleware(['ADMIN', 'GIAO_VIEN']),
  controller.updateBaiKiemTra
);

/**
 * @swagger
 * /api/baikiemtra/{id}:
 *   delete:
 *     summary: Xóa bài kiểm tra
 *     tags: [BaiKiemTra]
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
 */
router.delete(
  '/baikiemtra/:id',
  authMiddleware,
  roleMiddleware(['ADMIN', 'GIAO_VIEN']),
  controller.deleteBaiKiemTra
);

// =============================================
// TẠO BÀI KIỂM TRA (nested trong phần bài học)
// =============================================

/**
 * @swagger
 * /api/phanbaihoc/{phanBaiHocId}/baikiemtra:
 *   post:
 *     summary: Thêm bài kiểm tra mới
 *     tags: [BaiKiemTra]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: phanBaiHocId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [tenBaiKiemTra, thoiGianLamBai]
 *             properties:
 *               tenBaiKiemTra: { type: string }
 *               thoiGianBatDau: { type: string, format: date-time }
 *               thoiGianLamBai: { type: integer }
 *               diemDat: { type: number }
 *               diemMax: { type: number }
 *               trangThai: { type: string, enum: [AN, HIEN] }
 *     responses:
 *       201:
 *         description: Tạo bài kiểm tra thành công
 */
router.post(
  '/:phanBaiHocId/baikiemtra',
  authMiddleware,
  roleMiddleware(['ADMIN', 'GIAO_VIEN']),
  controller.createBaiKiemTra
);

export default router;