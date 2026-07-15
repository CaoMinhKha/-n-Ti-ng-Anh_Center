// src/modules/lichhoc/controllers/phonghoc.controller.ts

import { Request, Response, NextFunction } from 'express';
import { PhongHocService } from '../services/phonghoc.service.js';
import {
  createPhongHocSchema,
  updatePhongHocSchema,
  phongHocQuerySchema,
  validate,
} from '../validators/index.js';
import { AppError } from '../../../middleware/error.middleware.js';
import { getParamId, getParamString } from '../../../utils/param.util.js';

const phongHocService = new PhongHocService();

export class PhongHocController {
  async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const query = validate(phongHocQuerySchema, req.query);
      const result = await phongHocService.getList(query);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getOptions(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await phongHocService.getOptions();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getStatusOptions(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await phongHocService.getStatusOptions();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParamId(req.params.id);
      const result = await phongHocService.getById(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getByMaPhong(req: Request, res: Response, next: NextFunction) {
    try {
      const maPhong  = getParamString(req.params.maPhong);
      if (!maPhong) {
        throw new AppError('Mã phòng không được để trống', 400);
      }
      const result = await phongHocService.getByMaPhong(maPhong);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = validate(createPhongHocSchema, req.body);
      const result = await phongHocService.create(data);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParamId(req.params.id);
      const data = validate(updatePhongHocSchema, req.body);
      const result = await phongHocService.update(id, data);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParamId(req.params.id);
      const result = await phongHocService.delete(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}