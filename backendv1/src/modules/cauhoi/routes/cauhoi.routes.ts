// src/modules/cauhoi/routes/cauhoi.routes.ts

import { Router } from 'express';
import { CauHoiController } from '../controllers/cauhoi.controller.js';
import { authMiddleware, roleMiddleware } from '../../auth/middleware/auth.middleware.js';

const router = Router();
const controller = new CauHoiController();

// =============================================
// ⚠️ QUAN TRỌNG: Routes CỤ THỂ phải đặt TRƯỚC routes có tham số
// =============================================

// =============================================
// ROUTES KHÔNG CÓ THAM SỐ - ĐẶT TRƯỚC
// =============================================

router.get('/', controller.getList);
router.get('/types', controller.getTypes);
router.get('/status-options', controller.getStatusOptions);
router.get('/options', controller.getOptions);

router.post(
  '/',
  authMiddleware,
  roleMiddleware(['ADMIN', 'GIAO_VIEN']),
  controller.create
);

// =============================================
//  ROUTES CÓ THAM SỐ NHƯNG CỤ THỂ HƠN - ĐẶT TRƯỚC ROUTES /:id
// =============================================

/**
 * @swagger
 * /api/cauhoi/{cauHoiId}/dapan:
 *   get:
 *     summary: Lấy danh sách đáp án của câu hỏi
 *     tags: [DapAn]
 *     parameters:
 *       - in: path
 *         name: cauHoiId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Danh sách đáp án
 */
router.get('/:cauHoiId/dapan', controller.getDapAnList);

/**
 * @swagger
 * /api/cauhoi/{cauHoiId}/dapan:
 *   post:
 *     summary: Thêm đáp án mới cho câu hỏi
 *     tags: [DapAn]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *             required: [noiDungText]
 *             properties:
 *               noiDungText:
 *                 type: string
 *               noiDungUrl:
 *                 type: string
 *                 nullable: true
 *               laDapAnDung:
 *                 type: boolean
 *                 default: false
 *               thuTuHienThi:
 *                 type: integer
 *               giaTriKhop:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Tạo đáp án thành công
 */
router.post(
  '/:cauHoiId/dapan',
  authMiddleware,
  roleMiddleware(['ADMIN', 'GIAO_VIEN']),
  controller.createDapAn
);

// =============================================
// ROUTES CÓ THAM SỐ /:id - ĐẶT SAU CÙNG
// =============================================

/**
 * @swagger
 * /api/cauhoi/{id}/children:
 *   get:
 *     summary: Lấy danh sách câu hỏi con của câu hỏi cha
 *     tags: [CauHoi]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Danh sách câu hỏi con
 */
router.get('/:id/children', controller.getChildren);

/**
 * @swagger
 * /api/cauhoi/{id}:
 *   get:
 *     summary: Xem chi tiết câu hỏi
 *     tags: [CauHoi]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Thông tin chi tiết câu hỏi
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /api/cauhoi/{id}:
 *   put:
 *     summary: Cập nhật câu hỏi
 *     tags: [CauHoi]
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
 *             $ref: '#/components/schemas/UpdateCauHoiRequest'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['ADMIN', 'GIAO_VIEN']),
  controller.update
);

/**
 * @swagger
 * /api/cauhoi/{id}:
 *   delete:
 *     summary: Xóa câu hỏi
 *     tags: [CauHoi]
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
  '/:id',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  controller.delete
);

export default router;