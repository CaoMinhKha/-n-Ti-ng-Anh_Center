// src/modules/ketqua/routes/ketqua.routes.ts

import { Router } from 'express';
import { KetQuaController } from '../controllers/ketqua.controller.js';
import { authMiddleware, roleMiddleware } from '../../auth/middleware/auth.middleware.js';

const router = Router();
const controller = new KetQuaController();

// ==================================================
// Kết quả học tập
// ==================================================

/**
 * @swagger
 * /api/ketqua:
 *   get:
 *     summary: Lấy danh sách kết quả học tập
 *     tags: [KetQua]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: hocVien
 *         schema: { type: integer }
 *       - in: query
 *         name: lopHoc
 *         schema: { type: integer }
 *       - in: query
 *         name: xepLoai
 *         schema: { type: string, enum: [XUAT_SAC, GIOI, KHA, TRUNG_BINH, KHONG_DAT, ALL] }
 *       - in: query
 *         name: sort_by
 *         schema: { type: string, enum: [CreatedAt, TongDiem, DiemChuyenCan, DiemBaiTap, DiemKiemTra] }
 *       - in: query
 *         name: order
 *         schema: { type: string, enum: [asc, desc] }
 *     responses:
 *       200:
 *         description: Danh sách kết quả học tập
 */
router.get('/', controller.getList);

/**
 * @swagger
 * /api/ketqua/hocvien/{hocVienId}:
 *   get:
 *     summary: Lấy kết quả của học viên
 *     tags: [KetQua]
 *     parameters:
 *       - in: path
 *         name: hocVienId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Kết quả của học viên
 */
router.get('/hocvien/:hocVienId', controller.getListByHocVien);

/**
 * @swagger
 * /api/ketqua/lophoc/{lopHocId}:
 *   get:
 *     summary: Lấy kết quả của lớp học
 *     tags: [KetQua]
 *     parameters:
 *       - in: path
 *         name: lopHocId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Kết quả của lớp học
 */
router.get('/lophoc/:lopHocId', controller.getListByLopHoc);

/**
 * @swagger
 * /api/ketqua/xep-loai-options:
 *   get:
 *     summary: Lấy danh sách xếp loại (dropdown)
 *     tags: [KetQua]
 *     responses:
 *       200:
 *         description: Danh sách xếp loại
 */
router.get('/xep-loai-options', controller.getXepLoaiOptions);

/**
 * @swagger
 * /api/ketqua/{id}:
 *   get:
 *     summary: Xem chi tiết kết quả học tập
 *     tags: [KetQua]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Chi tiết kết quả học tập
 *       404:
 *         description: Kết quả không tồn tại
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /api/ketqua:
 *   post:
 *     summary: Tạo kết quả học tập mới
 *     tags: [KetQua]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [HocVienID, LopHocID]
 *             properties:
 *               HocVienID: { type: integer }
 *               LopHocID: { type: integer }
 *               DiemChuyenCan: { type: number }
 *               DiemBaiTap: { type: number }
 *               DiemKiemTra: { type: number }
 *               TongDiem: { type: number }
 *               XepLoai: { type: string, enum: [XUAT_SAC, GIOI, KHA, TRUNG_BINH, KHONG_DAT] }
 *     responses:
 *       201:
 *         description: Tạo kết quả thành công
 *       409:
 *         description: Học viên đã có kết quả
 */
router.post('/', controller.create);

/**
 * @swagger
 * /api/ketqua/{id}:
 *   put:
 *     summary: Cập nhật kết quả học tập
 *     tags: [KetQua]
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
 *               DiemChuyenCan: { type: number }
 *               DiemBaiTap: { type: number }
 *               DiemKiemTra: { type: number }
 *               TongDiem: { type: number }
 *               XepLoai: { type: string, enum: [XUAT_SAC, GIOI, KHA, TRUNG_BINH, KHONG_DAT] }
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put('/:id', controller.update);

/**
 * @swagger
 * /api/ketqua/{id}:
 *   delete:
 *     summary: Xóa kết quả học tập
 *     tags: [KetQua]
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
// Tiến độ học tập
// ==================================================

/**
 * @swagger
 * /api/ketqua/tiendo:
 *   get:
 *     summary: Lấy danh sách tiến độ học tập
 *     tags: [TienDo]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: hocVien
 *         schema: { type: integer }
 *       - in: query
 *         name: lopHoc
 *         schema: { type: integer }
 *       - in: query
 *         name: phanBaiHoc
 *         schema: { type: integer }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [CHUA_BAT_DAU, DANG_HOC, HOAN_THANH, ALL] }
 *       - in: query
 *         name: sort_by
 *         schema: { type: string, enum: [CreatedAt, TongSoCauHoiDung, TongSoCauHoi] }
 *       - in: query
 *         name: order
 *         schema: { type: string, enum: [asc, desc] }
 *     responses:
 *       200:
 *         description: Danh sách tiến độ học tập
 */
router.get('/tiendo', controller.getTienDoList);

/**
 * @swagger
 * /api/ketqua/tiendo/hocvien/{hocVienId}/lophoc/{lopHocId}:
 *   get:
 *     summary: Lấy tiến độ của học viên theo lớp
 *     tags: [TienDo]
 *     parameters:
 *       - in: path
 *         name: hocVienId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: lopHocId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Tiến độ của học viên theo lớp
 */
router.get('/tiendo/hocvien/:hocVienId/lophoc/:lopHocId', controller.getTienDoByHocVienAndLopHoc);

/**
 * @swagger
 * /api/ketqua/tiendo/status-options:
 *   get:
 *     summary: Lấy danh sách trạng thái tiến độ (dropdown)
 *     tags: [TienDo]
 *     responses:
 *       200:
 *         description: Danh sách trạng thái tiến độ
 */
router.get('/tiendo/status-options', controller.getTienDoStatusOptions);

/**
 * @swagger
 * /api/ketqua/tiendo/hocvien/{hocVienId}/lophoc/{lopHocId}/phanbaihoc/{phanBaiHocId}:
 *   put:
 *     summary: Cập nhật tiến độ học tập
 *     tags: [TienDo]
 *     parameters:
 *       - in: path
 *         name: hocVienId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: lopHocId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: phanBaiHocId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Cập nhật tiến độ thành công
 */
router.put(
  '/tiendo/hocvien/:hocVienId/lophoc/:lopHocId/phanbaihoc/:phanBaiHocId',
  controller.updateTienDo
);

export default router;