// src/modules/danhmuc/controllers/danhmuc.controller.ts

import { Request, Response, NextFunction } from 'express';
import { DanhMucService } from '../services/danhmuc.service.js';
import {
  createDanhMucSchema,
  updateDanhMucSchema,
  danhMucQuerySchema,
  validate,
} from '../validators/danhmuc.validator.js';
import { getParamId } from '../../../utils/param.util.js';

const danhMucService = new DanhMucService();

export class DanhMucController {
  /**
   * Lấy danh sách danh mục (Phân trang, tìm kiếm, lọc, sắp xếp)
   * GET /api/danhmuc
   */
  async getList(req: Request, res: Response, next: NextFunction) {
    try {
      //  Zod validation cho query params
      const query = validate(danhMucQuerySchema, req.query);

      const result = await danhMucService.getList(query);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy danh sách loại danh mục (Dropdown)
   * GET /api/danhmuc/types
   */
  async getTypes(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await danhMucService.getTypes();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy danh sách danh mục cha (Dropdown)
   * GET /api/danhmuc/parents
   */
  async getParents(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await danhMucService.getParents();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy tất cả danh mục (không phân trang - dùng cho dropdown)
   * GET /api/danhmuc/all-options
   */
  async getAllOptions(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await danhMucService.getAllOptions();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Xem chi tiết danh mục
   * GET /api/danhmuc/:id
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParamId(req.params.id);
      const result = await danhMucService.getById(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Thêm mới danh mục
   * POST /api/danhmuc
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      //  Zod validation
      const data = validate(createDanhMucSchema, req.body);

      const result = await danhMucService.create(data);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cập nhật danh mục
   * PUT /api/danhmuc/:id
   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParamId(req.params.id);
      //  Zod validation
      const data = validate(updateDanhMucSchema, req.body);

      const result = await danhMucService.update(id, data);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Xóa danh mục
   * DELETE /api/danhmuc/:id
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParamId(req.params.id);
      const result = await danhMucService.delete(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}