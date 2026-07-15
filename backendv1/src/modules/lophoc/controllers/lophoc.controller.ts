// src/modules/lophoc/controllers/lophoc.controller.ts

import { Request, Response, NextFunction } from 'express';
import { LopHocService } from '../services/lophoc.service.js';
import { DangKyService } from '../services/dangky.service.js';
import {
  createLopHocSchema,
  updateLopHocSchema,
  lopHocQuerySchema,
  dangKyHocVienSchema,
  duyetDangKySchema,
  validate,
} from '../validators/index.js';
import { AppError } from '../../../middleware/error.middleware.js';
import { getParamId, getParamString } from '../../../utils/param.util.js';

const lopHocService = new LopHocService();
const dangKyService = new DangKyService();

export class LopHocController {
  // =============================================
  // LỚP HỌC
  // =============================================

  /**
   * Lấy danh sách lớp học (Phân trang, tìm kiếm, lọc, sắp xếp)
   * GET /api/lophoc
   */
  async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const query = validate(lopHocQuerySchema, req.query);
      const result = await lopHocService.getList(query);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy danh sách hình thức học (Dropdown)
   * GET /api/lophoc/hinhthuc-options
   */
  async getHinhThucOptions(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await lopHocService.getHinhThucOptions();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy danh sách trạng thái (Dropdown)
   * GET /api/lophoc/status-options
   */
  async getStatusOptions(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await lopHocService.getStatusOptions();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy danh sách lớp học (Dropdown)
   * GET /api/lophoc/options
   */
  async getOptions(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await lopHocService.getOptions();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Xem chi tiết lớp học
   * GET /api/lophoc/:id
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParamId(req.params.id);
      const result = await lopHocService.getById(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Thêm mới lớp học
   * POST /api/lophoc
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = validate(createLopHocSchema, req.body);
      const result = await lopHocService.create(data);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cập nhật lớp học
   * PUT /api/lophoc/:id
   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParamId(req.params.id);
      const data = validate(updateLopHocSchema, req.body);
      const result = await lopHocService.update(id, data);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Xóa lớp học
   * DELETE /api/lophoc/:id
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParamId(req.params.id);
      const result = await lopHocService.delete(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // =============================================
  // ĐĂNG KÝ HỌC VIÊN
  // =============================================

  /**
   * Lấy danh sách đăng ký của lớp
   * GET /api/lophoc/:lopHocId/dangky
   */
  async getDanhSachDangKy(req: Request, res: Response, next: NextFunction) {
    try {
      const lopHocId = getParamId(req.params.lopHocId);
      const result = await dangKyService.getListByLopHoc(lopHocId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Đăng ký học viên vào lớp
   * POST /api/lophoc/:lopHocId/dangky
   */
  async dangKyHocVien(req: Request, res: Response, next: NextFunction) {
    try {
      const lopHocId = getParamId(req.params.lopHocId);
      const data = validate(dangKyHocVienSchema, req.body);
      const result = await dangKyService.dangKy(lopHocId, data);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Duyệt đăng ký học viên
   * PUT /api/lophoc/dangky/:dangKyId/duyet
   */
  async duyetDangKy(req: Request, res: Response, next: NextFunction) {
    try {
      const dangKyId = getParamId(req.params.dangKyId);
      const data = validate(duyetDangKySchema, req.body);
      const result = await dangKyService.duyetDangKy(dangKyId, data);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}