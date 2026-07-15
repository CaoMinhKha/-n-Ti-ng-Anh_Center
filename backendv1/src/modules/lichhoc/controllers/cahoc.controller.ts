// src/modules/lichhoc/controllers/cahoc.controller.ts

import { Request, Response, NextFunction } from 'express';
import { CaHocService } from '../services/cahoc.service.js';
import {
  createCaHocSchema,
  updateCaHocSchema,
  validate,
} from '../validators/index.js';
import { AppError } from '../../../middleware/error.middleware.js';
import { getParamId, getParamString } from '../../../utils/param.util.js';

const caHocService = new CaHocService();

export class CaHocController {
  async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await caHocService.getList();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getOptions(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await caHocService.getOptions();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParamId(req.params.id);
      const result = await caHocService.getById(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getByMaCa(req: Request, res: Response, next: NextFunction) {
    try {
      const maCa  = getParamString(req.params.maCa);
      if (!maCa) {
        throw new AppError('Mã ca không được để trống', 400);
      }
      const result = await caHocService.getByMaCa(maCa);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = validate(createCaHocSchema, req.body);
      const result = await caHocService.create(data);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParamId(req.params.id);
      const data = validate(updateCaHocSchema, req.body);
      const result = await caHocService.update(id, data);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParamId(req.params.id);
      const result = await caHocService.delete(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}