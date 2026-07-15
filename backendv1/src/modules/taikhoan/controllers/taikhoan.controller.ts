// src/modules/taikhoan/controllers/taikhoan.controller.ts

import { Request, Response, NextFunction } from 'express';
import { TaiKhoanService } from '../services/taikhoan.service.js';
import {
  createTaiKhoanSchema,
  updateTaiKhoanSchema,
  taiKhoanQuerySchema,
  resetPasswordSchema,
  toggleStatusSchema,
  validate,
} from '../validators/taikhoan.validator.js';
import { AppError } from '../../../middleware/error.middleware.js';
import { getParamId, getParamString } from '../../../utils/param.util.js';

const taiKhoanService = new TaiKhoanService();

export class TaiKhoanController {
  /**
   * Lấy danh sách tài khoản (Phân trang, tìm kiếm, lọc, sắp xếp)
   * GET /api/taikhoan
   */
  async getList(req: Request, res: Response, next: NextFunction) {
    try {
      //  Zod validation cho query params
      const query = validate(taiKhoanQuerySchema, req.query);

      const result = await taiKhoanService.getList(query);
      console.log("da goi")
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy danh sách role (Dropdown)
   * GET /api/taikhoan/roles
   */
  async getRoles(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await taiKhoanService.getRoles();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy danh sách trạng thái (Dropdown)
   * GET /api/taikhoan/statuses
   */
  async getStatuses(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await taiKhoanService.getStatuses();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy danh sách tài khoản theo role (Dropdown)
   * GET /api/taikhoan/by-role/:role
   */
  async getByRole(req: Request, res: Response, next: NextFunction) {
    try {
      const  role  = getParamString(req.params.role);
      if (!role || !['ADMIN', 'GIAO_VIEN', 'HOC_VIEN'].includes(role)) {
        throw new AppError('Vai trò không hợp lệ. Chỉ chấp nhận: ADMIN, GIAO_VIEN, HOC_VIEN', 400);
      }

      const result = await taiKhoanService.getByRole(role as any);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Xem chi tiết tài khoản
   * GET /api/taikhoan/:id
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParamId(req.params.id);
      const result = await taiKhoanService.getById(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Thêm mới tài khoản (Admin)
   * POST /api/taikhoan
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      //  Zod validation
      const data = validate(createTaiKhoanSchema, req.body);

      // Admin không thể tạo Admin khác
      const currentUser = (req as any).user;
      if (data.vaiTro === 'ADMIN') {
        throw new AppError('Bạn không có quyền tạo tài khoản Admin', 403);
      }

      const result = await taiKhoanService.create(data);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cập nhật tài khoản
   * PUT /api/taikhoan/:id
   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParamId(req.params.id);
      //  Zod validation
      const data = validate(updateTaiKhoanSchema, req.body);

      // Không cho Admin tự thay đổi role của chính mình
      const currentUser = (req as any).user;
      if (id === currentUser.userId && data.vaiTro) {
        throw new AppError('Bạn không thể thay đổi vai trò của chính mình', 403);
      }

      const result = await taiKhoanService.update(id, data);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Khóa/Mở khóa tài khoản
   * PATCH /api/taikhoan/:id/toggle-status
   */
  async toggleStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParamId(req.params.id);
      //  Zod validation
      const data = validate(toggleStatusSchema, req.body);

      // Không cho Admin tự khóa chính mình
      const currentUser = (req as any).user;
      if (id === currentUser.userId && data.trangThai === 'KHOA') {
        throw new AppError('Bạn không thể khóa chính mình', 403);
      }

      const result = await taiKhoanService.toggleStatus(id, data.trangThai);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Đặt lại mật khẩu (Admin)
   * POST /api/taikhoan/:id/reset-password
   */
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParamId(req.params.id);
      //  Zod validation
      const data = validate(resetPasswordSchema, req.body);

      const result = await taiKhoanService.resetPassword(id, data.newPassword);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Xóa tài khoản (xóa mềm)
   * DELETE /api/taikhoan/:id
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParamId(req.params.id);

      // Không cho Admin tự xóa chính mình
      const currentUser = (req as any).user;
      if (id === currentUser.userId) {
        throw new AppError('Bạn không thể xóa chính mình', 403);
      }

      const result = await taiKhoanService.delete(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}