// src/modules/lophoc/routes/lophoc.routes.ts

import { Router } from 'express';
import { LopHocController } from '../controllers/lophoc.controller.js';
import { authMiddleware, roleMiddleware } from '../../auth/middleware/auth.middleware.js';

const router = Router();
const controller = new LopHocController();

// ==================================================
// Public APIs
// ==================================================

/**
 * @swagger
 * /api/lophoc:
 *   get:
 *     summary: Lấy danh sách lớp học (phân trang, tìm kiếm, lọc, sắp xếp)
 *     tags: [LopHoc]
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
 *         name: dotKhaiGiang
 *         schema: { type: integer }
 *       - in: query
 *         name: khoaHoc
 *         schema: { type: integer }
 *       - in: query
 *         name: giaoVien
 *         schema: { type: integer }
 *       - in: query
 *         name: hinhThucHoc
 *         schema: { type: string, enum: [ONLLINE, OFFLINE] }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [SAP_KHAI_GIANG, DANG_HOC, DA_KET_THUC, DA_HUY, ALL] }
 *       - in: query
 *         name: sort_by
 *         schema: { type: string, enum: [CreatedAt, TenLopHoc, NgayBatDau, NgayKetThuc] }
 *       - in: query
 *         name: order
 *         schema: { type: string, enum: [asc, desc] }
 *     responses:
 *       200:
 *         description: Danh sách lớp học
 */
router.get('/', controller.getList);

/**
 * @swagger
 * /api/lophoc/hinhthuc-options:
 *   get:
 *     summary: Lấy danh sách hình thức học (dropdown)
 *     tags: [LopHoc]
 *     responses:
 *       200:
 *         description: Danh sách hình thức học
 */
router.get('/hinhthuc-options', controller.getHinhThucOptions);

/**
 * @swagger
 * /api/lophoc/status-options:
 *   get:
 *     summary: Lấy danh sách trạng thái lớp học (dropdown)
 *     tags: [LopHoc]
 *     responses:
 *       200:
 *         description: Danh sách trạng thái
 */
router.get('/status-options', controller.getStatusOptions);

/**
 * @swagger
 * /api/lophoc/options:
 *   get:
 *     summary: Lấy danh sách lớp học (dropdown)
 *     tags: [LopHoc]
 *     responses:
 *       200:
 *         description: Danh sách lớp học cho dropdown
 */
router.get('/options', controller.getOptions);

/**
 * @swagger
 * /api/lophoc/{id}:
 *   get:
 *     summary: Xem chi tiết lớp học
 *     tags: [LopHoc]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Thông tin chi tiết lớp học
 *       404:
 *         description: Lớp học không tồn tại
 */
router.get('/:id', controller.getById);

// ==================================================
// Protected APIs (Admin)
// ==================================================

/**
 * @swagger
 * /api/lophoc:
 *   post:
 *     summary: Thêm mới lớp học
 *     tags: [LopHoc]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [DotKhaiGiangID, KhoaHocID, GiaoVienID, TenLopHoc, HinhThucHoc, NgayBatDau, NgayKetThuc]
 *             properties:
 *               DotKhaiGiangID: { type: integer }
 *               KhoaHocID: { type: integer }
 *               GiaoVienID: { type: integer }
 *               TenLopHoc: { type: string }
 *               HinhThucHoc: { type: string, enum: [ONLLINE, OFFLINE] }
 *               HocPhi: { type: number }
 *               SiSoToiDa: { type: integer, default: 30 }
 *               NgayBatDau: { type: string, format: date }
 *               NgayKetThuc: { type: string, format: date }
 *               TrangThai: { type: string, enum: [SAP_KHAI_GIANG, DANG_HOC, DA_KET_THUC, DA_HUY] }
 *     responses:
 *       201:
 *         description: Tạo lớp học thành công
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
 * /api/lophoc/{id}:
 *   put:
 *     summary: Cập nhật lớp học
 *     tags: [LopHoc]
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
 *               DotKhaiGiangID: { type: integer }
 *               KhoaHocID: { type: integer }
 *               GiaoVienID: { type: integer }
 *               TenLopHoc: { type: string }
 *               HinhThucHoc: { type: string, enum: [ONLLINE, OFFLINE] }
 *               HocPhi: { type: number }
 *               SiSoToiDa: { type: integer }
 *               NgayBatDau: { type: string, format: date }
 *               NgayKetThuc: { type: string, format: date }
 *               TrangThai: { type: string, enum: [SAP_KHAI_GIANG, DANG_HOC, DA_KET_THUC, DA_HUY] }
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
 * /api/lophoc/{id}:
 *   delete:
 *     summary: Xóa lớp học
 *     tags: [LopHoc]
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

// ==================================================
// Đăng ký học viên
// ==================================================

/**
 * @swagger
 * /api/lophoc/{lopHocId}/dangky:
 *   get:
 *     summary: Lấy danh sách đăng ký của lớp học
 *     tags: [DangKy]
 *     parameters:
 *       - in: path
 *         name: lopHocId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Danh sách đăng ký
 */
router.get('/:lopHocId/dangky', controller.getDanhSachDangKy);

/**
 * @swagger
 * /api/lophoc/{lopHocId}/dangky:
 *   post:
 *     summary: Đăng ký học viên vào lớp
 *     tags: [DangKy]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [HocVienID]
 *             properties:
 *               HocVienID: { type: integer }
 *               HocPhi: { type: number }
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *       400:
 *         description: Lớp đã đủ sĩ số hoặc đã đăng ký
 *       404:
 *         description: Lớp học hoặc học viên không tồn tại
 */
router.post('/:lopHocId/dangky', controller.dangKyHocVien);

/**
 * @swagger
 * /api/lophoc/dangky/{dangKyId}/duyet:
 *   put:
 *     summary: Duyệt hoặc từ chối đăng ký học viên
 *     tags: [DangKy]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: dangKyId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [trangThai]
 *             properties:
 *               trangThai: { type: string, enum: [DA_DUYET, TU_CHOI] }
 *     responses:
 *       200:
 *         description: Xử lý đăng ký thành công
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 *       404:
 *         description: Đăng ký không tồn tại
 */
router.put(
  '/dangky/:dangKyId/duyet',
  authMiddleware,
  roleMiddleware(['ADMIN', 'GIAO_VIEN']),
  controller.duyetDangKy
);

export default router;