// src/modules/diemdanh/controllers/diemdanh.controller.ts

import { Request, Response, NextFunction } from 'express';
import { DiemDanhService } from '../services/diemdanh.service.js';
import {
  createDiemDanhSchema,
  updateDiemDanhSchema,
  diemDanhQuerySchema,
  createMaDiemDanhSchema,
  verifyMaDiemDanhSchema,
  validate,
} from '../validators/index.js';
import { AppError } from '../../../middleware/error.middleware.js';
import { getParamId, getParamString } from '../../../utils/param.util.js';

const diemDanhService = new DiemDanhService();

export class DiemDanhController {
  // =============================================
  // ĐIỂM DANH HỌC VIÊN
  // =============================================

  /**
   * Lấy danh sách điểm danh
   * GET /api/diemdanh
   */
  async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const query = validate(diemDanhQuerySchema, req.query);
      const result = await diemDanhService.getList(query);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy danh sách điểm danh của buổi học
   * GET /api/diemdanh/buoihoc/:buoiHocId
   */
  async getListByBuoiHoc(req: Request, res: Response, next: NextFunction) {
    try {
      const buoiHocId = getParamId(req.params.buoiHocId);
      const result = await diemDanhService.getListByBuoiHoc(buoiHocId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy danh sách điểm danh của học viên
   * GET /api/diemdanh/hocvien/:hocVienId
   */
  async getListByHocVien(req: Request, res: Response, next: NextFunction) {
    try {
      const hocVienId = getParamId(req.params.hocVienId);
      const result = await diemDanhService.getListByHocVien(hocVienId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy danh sách trạng thái điểm danh (dropdown)
   * GET /api/diemdanh/status-options
   */
  async getStatusOptions(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await diemDanhService.getStatusOptions();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Tạo điểm danh mới
   * POST /api/diemdanh
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = validate(createDiemDanhSchema, req.body);
      const result = await diemDanhService.create(data);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cập nhật điểm danh
   * PUT /api/diemdanh/:hocVienId/:buoiHocId
   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const hocVienId = getParamId(req.params.hocVienId);
      const buoiHocId = getParamId(req.params.buoiHocId);
      const data = validate(updateDiemDanhSchema, req.body);
      const result = await diemDanhService.update(hocVienId, buoiHocId, data);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Xóa điểm danh
   * DELETE /api/diemdanh/:hocVienId/:buoiHocId
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const hocVienId = getParamId(req.params.hocVienId);
      const buoiHocId = getParamId(req.params.buoiHocId);
      const result = await diemDanhService.delete(hocVienId, buoiHocId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // =============================================
  // MÃ ĐIỂM DANH
  // =============================================

  /**
   * Tạo mã điểm danh
   * POST /api/diemdanh/madiemdanh
   */
  async createMaDiemDanh(req: Request, res: Response, next: NextFunction) {
    try {
      const data = validate(createMaDiemDanhSchema, req.body);
      const result = await diemDanhService.createMaDiemDanh(data);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy mã điểm danh của buổi học
   * GET /api/diemdanh/madiemdanh/buoihoc/:buoiHocId
   */
  async getMaDiemDanhByBuoiHoc(req: Request, res: Response, next: NextFunction) {
    try {
      const buoiHocId = getParamId(req.params.buoiHocId);
      const result = await diemDanhService.getMaDiemDanhByBuoiHoc(buoiHocId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Xác thực mã điểm danh
   * POST /api/diemdanh/madiemdanh/verify
   */
  async verifyMaDiemDanh(req: Request, res: Response, next: NextFunction) {
    try {
      const data = validate(verifyMaDiemDanhSchema, req.body);
      const result = await diemDanhService.verifyMaDiemDanh(data.maCode);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Đóng mã điểm danh
   * PUT /api/diemdanh/madiemdanh/:id/close
   */
  async closeMaDiemDanh(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParamId(req.params.id);
      const result = await diemDanhService.closeMaDiemDanh(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy danh sách trạng thái mã điểm danh (dropdown)
   * GET /api/diemdanh/madiemdanh/status-options
   */
  async getMaStatusOptions(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await diemDanhService.getMaStatusOptions();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}