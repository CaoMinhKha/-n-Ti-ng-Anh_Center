// src/modules/khoahoc/controllers/khoahoc.controller.ts

import { Request, Response, NextFunction } from 'express';
import { KhoaHocService } from '../services/khoahoc.service.js';
import { BaiHocService } from '../services/baihoc.service.js';
import { PhanBaiHocService } from '../services/phanbaihoc.service.js';
import { BaiKiemTraService } from '../services/baikiemtra.service.js';
import {
  createKhoaHocSchema,
  updateKhoaHocSchema,
  khoaHocQuerySchema,
  createBaiHocSchema,
  updateBaiHocSchema,
  baiHocQuerySchema,
  createPhanBaiHocSchema,
  updatePhanBaiHocSchema,
  createBaiKiemTraSchema,
  updateBaiKiemTraSchema,
  updateBaiHocOrderSchema,
  updatePhanBaiHocOrderSchema,
  validate,
} from '../validators/index.js';
import { AppError } from '../../../middleware/error.middleware.js';
import { getParamId, getParamString } from '../../../utils/param.util.js';

// Services
const khoaHocService = new KhoaHocService();
const baiHocService = new BaiHocService();
const phanBaiHocService = new PhanBaiHocService();
const baiKiemTraService = new BaiKiemTraService();

export class KhoaHocController {
  // =============================================
  // KHÓA HỌC
  // =============================================

  /**
   * Lấy danh sách khóa học (Phân trang, tìm kiếm, lọc, sắp xếp)
   * GET /api/khoahoc
   */
  async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const query = validate(khoaHocQuerySchema, req.query);
      const result = await khoaHocService.getList(query);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy danh sách khóa học (Dropdown)
   * GET /api/khoahoc/options
   */
  async getOptions(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await khoaHocService.getOptions();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy danh sách trình độ (Dropdown)
   * GET /api/khoahoc/trinhdo-options
   */
  async getTrinhDoOptions(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await khoaHocService.getTrinhDoOptions();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy danh sách trạng thái (Dropdown)
   * GET /api/khoahoc/status-options
   */
  async getStatusOptions(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await khoaHocService.getStatusOptions();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Xem chi tiết khóa học
   * GET /api/khoahoc/:id
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParamId(req.params.id);
      const result = await khoaHocService.getById(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Thêm mới khóa học
   * POST /api/khoahoc
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = validate(createKhoaHocSchema, req.body);
      const result = await khoaHocService.create(data);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cập nhật khóa học
   * PUT /api/khoahoc/:id
   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParamId(req.params.id);
      const data = validate(updateKhoaHocSchema, req.body);
      const result = await khoaHocService.update(id, data);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Xóa khóa học
   * DELETE /api/khoahoc/:id
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParamId(req.params.id);
      const result = await khoaHocService.delete(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // =============================================
  // BÀI HỌC
  // =============================================

  /**
   * Lấy danh sách bài học của khóa học
   * GET /api/khoahoc/:khoaHocId/baihoc
   */
  async getBaiHocList(req: Request, res: Response, next: NextFunction) {
    try {
      const khoaHocId = getParamId(req.params.khoaHocId);
      const query = validate(baiHocQuerySchema, req.query);
      const result = await baiHocService.getListByKhoaHoc(khoaHocId, query);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Xem chi tiết bài học
   * GET /api/baihoc/:id
   */
  async getBaiHocById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParamId(req.params.id);
      const result = await baiHocService.getById(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Thêm bài học mới
   * POST /api/khoahoc/:khoaHocId/baihoc
   */
  async createBaiHoc(req: Request, res: Response, next: NextFunction) {
    try {
      const khoaHocId = getParamId(req.params.khoaHocId);
      const data = validate(createBaiHocSchema, req.body);
      const result = await baiHocService.create(khoaHocId, data);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cập nhật bài học
   * PUT /api/baihoc/:id
   */
  async updateBaiHoc(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParamId(req.params.id);
      const data = validate(updateBaiHocSchema, req.body);
      const result = await baiHocService.update(id, data);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cập nhật thứ tự bài học
   * PUT /api/khoahoc/:khoaHocId/baihoc/order
   */
  async updateBaiHocOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const khoaHocId = getParamId(req.params.khoaHocId);
      const data = validate(updateBaiHocOrderSchema, req.body);
      const result = await baiHocService.updateOrder(khoaHocId, data.orders);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Xóa bài học
   * DELETE /api/baihoc/:id
   */
  async deleteBaiHoc(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParamId(req.params.id);
      const result = await baiHocService.delete(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // =============================================
  // PHẦN BÀI HỌC
  // =============================================

  /**
   * Lấy danh sách phần bài học của bài học
   * GET /api/baihoc/:baiHocId/phanbaihoc
   */
  async getPhanBaiHocList(req: Request, res: Response, next: NextFunction) {
    try {
      const baiHocId = getParamId(req.params.baiHocId);
      const result = await phanBaiHocService.getListByBaiHoc(baiHocId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Xem chi tiết phần bài học
   * GET /api/phanbaihoc/:id
   */
  async getPhanBaiHocById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParamId(req.params.id);
      const result = await phanBaiHocService.getById(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Thêm phần bài học mới
   * POST /api/baihoc/:baiHocId/phanbaihoc
   */
  async createPhanBaiHoc(req: Request, res: Response, next: NextFunction) {
    try {
      const baiHocId = getParamId(req.params.baiHocId);
      const data = validate(createPhanBaiHocSchema, req.body);
      const result = await phanBaiHocService.create(baiHocId, data);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cập nhật phần bài học
   * PUT /api/phanbaihoc/:id
   */
  async updatePhanBaiHoc(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParamId(req.params.id);
      const data = validate(updatePhanBaiHocSchema, req.body);
      const result = await phanBaiHocService.update(id, data);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cập nhật thứ tự phần bài học
   * PUT /api/baihoc/:baiHocId/phanbaihoc/order
   */
  async updatePhanBaiHocOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const baiHocId = getParamId(req.params.baiHocId);
      const data = validate(updatePhanBaiHocOrderSchema, req.body);
      const result = await phanBaiHocService.updateOrder(baiHocId, data.orders);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Xóa phần bài học
   * DELETE /api/phanbaihoc/:id
   */
  async deletePhanBaiHoc(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParamId(req.params.id);
      const result = await phanBaiHocService.delete(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // =============================================
  // BÀI KIỂM TRA
  // =============================================

  /**
   * Xem chi tiết bài kiểm tra
   * GET /api/baikiemtra/:id
   */
  async getBaiKiemTraById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParamId(req.params.id);
      const result = await baiKiemTraService.getById(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Thêm bài kiểm tra mới
   * POST /api/phanbaihoc/:phanBaiHocId/baikiemtra
   */
  async createBaiKiemTra(req: Request, res: Response, next: NextFunction) {
    try {
      const phanBaiHocId = getParamId(req.params.phanBaiHocId);
      const data = validate(createBaiKiemTraSchema, req.body);
      const result = await baiKiemTraService.create(phanBaiHocId, data);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cập nhật bài kiểm tra
   * PUT /api/baikiemtra/:id
   */
  async updateBaiKiemTra(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParamId(req.params.id);
      const data = validate(updateBaiKiemTraSchema, req.body);
      const result = await baiKiemTraService.update(id, data);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Xóa bài kiểm tra
   * DELETE /api/baikiemtra/:id
   */
  async deleteBaiKiemTra(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParamId(req.params.id);
      const result = await baiKiemTraService.delete(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
  // src/modules/khoahoc/controllers/khoahoc.controller.ts

// Thêm method này vào class KhoaHocController

/**
 * Lấy danh sách loại phần bài học (dropdown)
 * GET /api/phanbaihoc/loai-options
 */
async getLoaiPhanBaiHocOptions(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await phanBaiHocService.getLoaiPhanBaiHocOptions();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Lấy danh sách câu hỏi của bài kiểm tra
 * GET /api/baikiemtra/:baiKiemTraId/cauhoi
 */
async getCauHoiListByBaiKiemTra(req: Request, res: Response, next: NextFunction) {
  try {
    const baiKiemTraId = getParamId(req.params.baiKiemTraId);
    const result = await baiKiemTraService.getCauHoiList(baiKiemTraId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Lấy danh sách câu hỏi có thể thêm vào bài kiểm tra
 * GET /api/baikiemtra/:baiKiemTraId/cauhoi/available
 */
async getAvailableCauHoisForBaiKiemTra(req: Request, res: Response, next: NextFunction) {
  try {
    const baiKiemTraId = getParamId(req.params.baiKiemTraId);
    const result = await baiKiemTraService.getAvailableCauHois(baiKiemTraId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Thêm câu hỏi vào bài kiểm tra
 * POST /api/baikiemtra/:baiKiemTraId/cauhoi
 */
async addCauHoiToBaiKiemTra(req: Request, res: Response, next: NextFunction) {
  try {
    const baiKiemTraId = getParamId(req.params.baiKiemTraId);
    const { cauHoiID, thuTuHienThi } = req.body;

    if (!cauHoiID) {
      throw new AppError('CauHoiID không được để trống', 400);
    }

    const result = await baiKiemTraService.addCauHoi(baiKiemTraId, cauHoiID, thuTuHienThi);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Xóa câu hỏi khỏi bài kiểm tra
 * DELETE /api/baikiemtra/:baiKiemTraId/cauhoi/:cauHoiId
 */
async removeCauHoiFromBaiKiemTra(req: Request, res: Response, next: NextFunction) {
  try {
    const baiKiemTraId = getParamId(req.params.baiKiemTraId);
    const cauHoiId = getParamId(req.params.cauHoiId);

    const result = await baiKiemTraService.removeCauHoi(baiKiemTraId, cauHoiId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Cập nhật thứ tự câu hỏi trong bài kiểm tra
 * PATCH /api/baikiemtra/:baiKiemTraId/cauhoi/:cauHoiId/order
 */
async updateCauHoiOrderInBaiKiemTra(req: Request, res: Response, next: NextFunction) {
  try {
    const baiKiemTraId = getParamId(req.params.baiKiemTraId);
    const cauHoiId = getParamId(req.params.cauHoiId);
    const { thuTuHienThi } = req.body;

    if (thuTuHienThi === undefined) {
      throw new AppError('thuTuHienThi không được để trống', 400);
    }

    const result = await baiKiemTraService.updateCauHoiOrder(baiKiemTraId, cauHoiId, thuTuHienThi);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
}