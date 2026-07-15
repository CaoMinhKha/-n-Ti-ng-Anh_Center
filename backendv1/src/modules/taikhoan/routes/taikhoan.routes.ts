// src/modules/taikhoan/routes/taikhoan.routes.ts

import { Router } from 'express';
import { TaiKhoanController } from '../controllers/taikhoan.controller.js';
import { authMiddleware, roleMiddleware } from '../../auth/middleware/auth.middleware.js';

const router = Router();
const taiKhoanController = new TaiKhoanController();

// ==================================================
// Tất cả API đều yêu cầu Admin
// ==================================================

/**
 * @swagger
 * /api/taikhoan:
 *   get:
 *     summary: Lấy danh sách tài khoản (phân trang, tìm kiếm, lọc, sắp xếp)
 *     tags: [TaiKhoan]
 *     security:
 *       - bearerAuth: []
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
 *         name: role
 *         schema: { type: string, enum: [ADMIN, GIAO_VIEN, HOC_VIEN, ALL] }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [HOAT_DONG, KHOA, CHO_XAC_THUC, ALL] }
 *       - in: query
 *         name: sort_by
 *         schema: { type: string, enum: [CreatedAt, Email, HoVaTen, VaiTro, TrangThai] }
 *       - in: query
 *         name: order
 *         schema: { type: string, enum: [asc, desc] }
 *     responses:
 *       200:
 *         description: Danh sách tài khoản
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 */
router.get(
  '/',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  taiKhoanController.getList
);

/**
 * @swagger
 * /api/taikhoan/roles:
 *   get:
 *     summary: Lấy danh sách role (dropdown)
 *     tags: [TaiKhoan]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách role
 */
router.get(
  '/roles',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  taiKhoanController.getRoles
);

/**
 * @swagger
 * /api/taikhoan/statuses:
 *   get:
 *     summary: Lấy danh sách trạng thái (dropdown)
 *     tags: [TaiKhoan]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách trạng thái
 */
router.get(
  '/statuses',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  taiKhoanController.getStatuses
);

/**
 * @swagger
 * /api/taikhoan/by-role/{role}:
 *   get:
 *     summary: Lấy danh sách tài khoản theo role (dropdown)
 *     tags: [TaiKhoan]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: role
 *         required: true
 *         schema: { type: string, enum: [ADMIN, GIAO_VIEN, HOC_VIEN] }
 *     responses:
 *       200:
 *         description: Danh sách tài khoản theo role
 */
router.get(
  '/by-role/:role',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  taiKhoanController.getByRole
);

/**
 * @swagger
 * /api/taikhoan/{id}:
 *   get:
 *     summary: Xem chi tiết tài khoản
 *     tags: [TaiKhoan]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Thông tin chi tiết tài khoản
 *       404:
 *         description: Tài khoản không tồn tại
 */
router.get(
  '/:id',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  taiKhoanController.getById
);

/**
 * @swagger
 * /api/taikhoan:
 *   post:
 *     summary: Thêm mới tài khoản (Admin tạo cho GV/HV)
 *     tags: [TaiKhoan]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, hoVaTen, vaiTro]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 6 }
 *               hoVaTen: { type: string }
 *               vaiTro: { type: string, enum: [GIAO_VIEN, HOC_VIEN] }
 *               ngaySinh: { type: string, format: date }
 *               gioiTinh: { type: string, enum: [NAM, NU, KHAC] }
 *               avatarUrl: { type: string }
 *     responses:
 *       201:
 *         description: Tạo tài khoản thành công
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 */
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  taiKhoanController.create
);

/**
 * @swagger
 * /api/taikhoan/{id}:
 *   put:
 *     summary: Cập nhật tài khoản
 *     tags: [TaiKhoan]
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
 *               hoVaTen: { type: string }
 *               ngaySinh: { type: string, format: date }
 *               gioiTinh: { type: string, enum: [NAM, NU, KHAC] }
 *               avatarUrl: { type: string }
 *               vaiTro: { type: string, enum: [ADMIN, GIAO_VIEN, HOC_VIEN] }
 *               trangThai: { type: string, enum: [HOAT_DONG, KHOA, CHO_XAC_THUC] }
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
  taiKhoanController.update
);

/**
 * @swagger
 * /api/taikhoan/{id}/toggle-status:
 *   patch:
 *     summary: Khóa/Mở khóa tài khoản
 *     tags: [TaiKhoan]
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
 *             type: object
 *             required: [trangThai]
 *             properties:
 *               trangThai: { type: string, enum: [HOAT_DONG, KHOA] }
 *     responses:
 *       200:
 *         description: Thay đổi trạng thái thành công
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 */
router.patch(
  '/:id/toggle-status',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  taiKhoanController.toggleStatus
);

/**
 * @swagger
 * /api/taikhoan/{id}/reset-password:
 *   post:
 *     summary: Đặt lại mật khẩu (Admin)
 *     tags: [TaiKhoan]
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
 *             type: object
 *             required: [newPassword]
 *             properties:
 *               newPassword: { type: string, minLength: 6 }
 *     responses:
 *       200:
 *         description: Đặt lại mật khẩu thành công
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền
 */
router.post(
  '/:id/reset-password',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  taiKhoanController.resetPassword
);

/**
 * @swagger
 * /api/taikhoan/{id}:
 *   delete:
 *     summary: Xóa tài khoản (xóa mềm)
 *     tags: [TaiKhoan]
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
  taiKhoanController.delete
);

export default router;