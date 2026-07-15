// src/modules/cauhoi/controllers/cauhoi.controller.ts

import { Request, Response, NextFunction } from 'express';
import { CauHoiService } from '../services/cauhoi.service.js';
import { DapAnService } from '../services/dapan.service.js';
import {
  createCauHoiSchema,
  updateCauHoiSchema,
  cauHoiQuerySchema,
  createDapAnSchema,
  updateDapAnSchema,
  validate,
} from '../validators/index.js';
import { AppError } from '../../../middleware/error.middleware.js';
import { getParamId, getParamString } from '../../../utils/param.util.js';

const cauHoiService = new CauHoiService();
const dapAnService = new DapAnService();

export class CauHoiController {
  // =============================================
  // CÂU HỎI
  // =============================================

  async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const query = validate(cauHoiQuerySchema, req.query);
      const result = await cauHoiService.getList(query);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getTypes(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await cauHoiService.getTypes();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getStatusOptions(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await cauHoiService.getStatusOptions();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getOptions(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await cauHoiService.getOptions();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getChildren(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParamId(req.params.id);
      const result = await cauHoiService.getChildren(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParamId(req.params.id);
      const result = await cauHoiService.getById(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = validate(createCauHoiSchema, req.body);
      const result = await cauHoiService.create(data);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParamId(req.params.id);
      const data = validate(updateCauHoiSchema, req.body);
      const result = await cauHoiService.update(id, data);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParamId(req.params.id);
      const result = await cauHoiService.delete(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // =============================================
  // ĐÁP ÁN
  // =============================================

  async getDapAnList(req: Request, res: Response, next: NextFunction) {
    try {
      const cauHoiId = getParamId(req.params.cauHoiId);
      const result = await dapAnService.getListByCauHoi(cauHoiId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async createDapAn(req: Request, res: Response, next: NextFunction) {
    try {
      const cauHoiId = getParamId(req.params.cauHoiId);
      const data = validate(createDapAnSchema, req.body);
      const result = await dapAnService.create(cauHoiId, data);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateDapAn(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParamId(req.params.id);
      const data = validate(updateDapAnSchema, req.body);
      const result = await dapAnService.update(id, data);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async deleteDapAn(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParamId(req.params.id);
      const result = await dapAnService.delete(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}