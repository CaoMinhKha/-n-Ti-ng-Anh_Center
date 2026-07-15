// src/modules/dotkhaigiang/controllers/dotkhaigiang.controller.ts

import { Request, Response, NextFunction } from 'express';
import { DotKhaiGiangService } from '../services/dotkhaigiang.service.js';
import {
  createDotKhaiGiangSchema,
  updateDotKhaiGiangSchema,
  dotKhaiGiangQuerySchema,
  validate,
} from '../validators/index.js'
import { AppError } from '../../../middleware/error.middleware.js';
import { getParamId, getParamString } from '../../../utils/param.util.js';

const dotKhaiGiangService = new DotKhaiGiangService();

export class DotKhaiGiangController {
  /**
   * Lấy danh sách đợt khai giảng (Phân trang, tìm kiếm, lọc, sắp xếp)
   * GET /api/dotkhaigiang
   */
  async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const query = validate(dotKhaiGiangQuerySchema, req.query);
      const result = await dotKhaiGiangService.getList(query);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy danh sách trạng thái (Dropdown)
   * GET /api/dotkhaigiang/status-options
   */
  async getStatusOptions(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await dotKhaiGiangService.getStatusOptions();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy danh sách đợt khai giảng (Dropdown)
   * GET /api/dotkhaigiang/options
   */
  async getOptions(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await dotKhaiGiangService.getOptions();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Xem chi tiết đợt khai giảng
   * GET /api/dotkhaigiang/:id
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParamId(req.params.id);
      const result = await dotKhaiGiangService.getById(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy đợt khai giảng theo mã
   * GET /api/dotkhaigiang/ma/:maDot
   */
  async getByMaDot(req: Request, res: Response, next: NextFunction) {
    try {
      const maDot = getParamString(req.params.maDot);
      if (!maDot) {
        throw new AppError('Mã đợt không được để trống', 400);
      }

      const result = await dotKhaiGiangService.getByMaDot(maDot);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Thêm mới đợt khai giảng
   * POST /api/dotkhaigiang
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = validate(createDotKhaiGiangSchema, req.body);
      const result = await dotKhaiGiangService.create(data);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cập nhật đợt khai giảng
   * PUT /api/dotkhaigiang/:id
   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParamId(req.params.id);
      const data = validate(updateDotKhaiGiangSchema, req.body);
      const result = await dotKhaiGiangService.update(id, data);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Xóa đợt khai giảng
   * DELETE /api/dotkhaigiang/:id
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParamId(req.params.id);
      const result = await dotKhaiGiangService.delete(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}