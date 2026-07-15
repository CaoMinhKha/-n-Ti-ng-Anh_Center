// src/modules/ketqua/controllers/ketqua.controller.ts

import { Request, Response, NextFunction } from 'express';
import { KetQuaService } from '../services/ketqua.service.js';
import {
  createKetQuaSchema,
  updateKetQuaSchema,
  ketQuaQuerySchema,
  tienDoQuerySchema,
  validate,
} from '../validators/index.js';
import { AppError } from '../../../middleware/error.middleware.js';
import { getParamId, getParamString } from '../../../utils/param.util.js';

const ketQuaService = new KetQuaService();

export class KetQuaController {
  // =============================================
  // KẾT QUẢ HỌC TẬP
  // =============================================

  /**
   * Lấy danh sách kết quả học tập
   * GET /api/ketqua
   */
  async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const query = validate(ketQuaQuerySchema, req.query);
      const result = await ketQuaService.getList(query);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy kết quả của học viên
   * GET /api/ketqua/hocvien/:hocVienId
   */
  async getListByHocVien(req: Request, res: Response, next: NextFunction) {
    try {
      const hocVienId = getParamId(req.params.hocVienId);
      const result = await ketQuaService.getListByHocVien(hocVienId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy kết quả của lớp học
   * GET /api/ketqua/lophoc/:lopHocId
   */
  async getListByLopHoc(req: Request, res: Response, next: NextFunction) {
    try {
      const lopHocId = getParamId(req.params.lopHocId);
      const result = await ketQuaService.getListByLopHoc(lopHocId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy danh sách xếp loại (dropdown)
   * GET /api/ketqua/xep-loai-options
   */
  async getXepLoaiOptions(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ketQuaService.getXepLoaiOptions();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Xem chi tiết kết quả học tập
   * GET /api/ketqua/:id
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParamId(req.params.id);
      const result = await ketQuaService.getById(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Tạo kết quả học tập mới
   * POST /api/ketqua
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = validate(createKetQuaSchema, req.body);
      const result = await ketQuaService.create(data);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cập nhật kết quả học tập
   * PUT /api/ketqua/:id
   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParamId(req.params.id);
      const data = validate(updateKetQuaSchema, req.body);
      const result = await ketQuaService.update(id, data);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Xóa kết quả học tập
   * DELETE /api/ketqua/:id
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParamId(req.params.id);
      const result = await ketQuaService.delete(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // =============================================
  // TIẾN ĐỘ HỌC TẬP
  // =============================================

  /**
   * Lấy danh sách tiến độ học tập
   * GET /api/ketqua/tiendo
   */
  async getTienDoList(req: Request, res: Response, next: NextFunction) {
    try {
      const query = validate(tienDoQuerySchema, req.query);
      const result = await ketQuaService.getTienDoList(query);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy tiến độ của học viên theo lớp
   * GET /api/ketqua/tiendo/hocvien/:hocVienId/lophoc/:lopHocId
   */
  async getTienDoByHocVienAndLopHoc(req: Request, res: Response, next: NextFunction) {
    try {
      const hocVienId = getParamId(req.params.hocVienId);
      const lopHocId = getParamId(req.params.lopHocId);
      const result = await ketQuaService.getTienDoByHocVienAndLopHoc(hocVienId, lopHocId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy danh sách trạng thái tiến độ (dropdown)
   * GET /api/ketqua/tiendo/status-options
   */
  async getTienDoStatusOptions(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ketQuaService.getTienDoStatusOptions();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cập nhật tiến độ học tập
   * PUT /api/ketqua/tiendo/hocvien/:hocVienId/lophoc/:lopHocId/phanbaihoc/:phanBaiHocId
   */
  async updateTienDo(req: Request, res: Response, next: NextFunction) {
    try {
      const hocVienId = getParamId(req.params.hocVienId);
      const lopHocId = getParamId(req.params.lopHocId);
      const phanBaiHocId = getParamId(req.params.phanBaiHocId);
      const result = await ketQuaService.updateTienDo(hocVienId, lopHocId, phanBaiHocId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}