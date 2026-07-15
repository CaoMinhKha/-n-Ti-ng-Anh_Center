// src/modules/bailam/controllers/bailam.controller.ts

import { Request, Response, NextFunction } from 'express';
import { BaiLamService } from '../services/bailam.service.js';
import {
  createBaiLamSchema,
  updateBaiLamSchema,
  baiLamQuerySchema,
  createBaiLamChiTietSchema,
  updateBaiLamChiTietSchema,
  validate,
} from '../validators/index.js';
import { AppError } from '../../../middleware/error.middleware.js';
import { getParamId, getParamString } from '../../../utils/param.util.js';

const baiLamService = new BaiLamService();

export class BaiLamController {
  // =============================================
  // BÀI LÀM
  // =============================================

  /**
   * Lấy danh sách bài làm
   * GET /api/bailam
   */
  async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const query = validate(baiLamQuerySchema, req.query);
      const result = await baiLamService.getList(query);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy danh sách bài làm của học viên
   * GET /api/bailam/hocvien/:hocVienId
   */
  async getListByHocVien(req: Request, res: Response, next: NextFunction) {
    try {
      const hocVienId = getParamId(req.params.hocVienId);
      const result = await baiLamService.getListByHocVien(hocVienId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy danh sách bài làm của bài kiểm tra
   * GET /api/bailam/baikiemtra/:baiKiemTraId
   */
  async getListByBaiKiemTra(req: Request, res: Response, next: NextFunction) {
    try {
      const baiKiemTraId = getParamId(req.params.baiKiemTraId);
      const result = await baiLamService.getListByBaiKiemTra(baiKiemTraId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy danh sách trạng thái (dropdown)
   * GET /api/bailam/status-options
   */
  async getStatusOptions(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await baiLamService.getStatusOptions();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Xem chi tiết bài làm
   * GET /api/bailam/:id
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParamId(req.params.id);
      const result = await baiLamService.getById(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Tạo bài làm mới
   * POST /api/bailam
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = validate(createBaiLamSchema, req.body);
      const result = await baiLamService.create(data);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cập nhật bài làm
   * PUT /api/bailam/:id
   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParamId(req.params.id);
      const data = validate(updateBaiLamSchema, req.body);
      const result = await baiLamService.update(id, data);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Xóa bài làm
   * DELETE /api/bailam/:id
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParamId(req.params.id);
      const result = await baiLamService.delete(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // =============================================
  // CHI TIẾT BÀI LÀM
  // =============================================

  /**
   * Thêm chi tiết bài làm
   * POST /api/bailam/:baiLamId/chitiet
   */
  async addChiTiet(req: Request, res: Response, next: NextFunction) {
    try {
      const baiLamId = getParamId(req.params.baiLamId);
      const data = validate(createBaiLamChiTietSchema, req.body);
      const result = await baiLamService.addChiTiet(baiLamId, data);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cập nhật chi tiết bài làm
   * PUT /api/bailam/:baiLamId/chitiet/:cauHoiId
   */
  async updateChiTiet(req: Request, res: Response, next: NextFunction) {
    try {
      const baiLamId = getParamId(req.params.baiLamId);
      const cauHoiId = getParamId(req.params.cauHoiId);
      const data = validate(updateBaiLamChiTietSchema, req.body);
      const result = await baiLamService.updateChiTiet(baiLamId, cauHoiId, data);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Xóa chi tiết bài làm
   * DELETE /api/bailam/:baiLamId/chitiet/:cauHoiId
   */
  async deleteChiTiet(req: Request, res: Response, next: NextFunction) {
    try {
      const baiLamId = getParamId(req.params.baiLamId);
      const cauHoiId = getParamId(req.params.cauHoiId);
      const result = await baiLamService.deleteChiTiet(baiLamId, cauHoiId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}