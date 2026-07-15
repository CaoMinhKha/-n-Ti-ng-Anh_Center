// src/modules/lichhoc/controllers/lichhoc.controller.ts

import { Request, Response, NextFunction } from 'express';
import { LichHocService } from '../services/lichhoc.service.js';
import {
  createLichHocSchema,
  updateLichHocSchema,
  lichHocQuerySchema,
  validate,
} from '../validators/index.js';
import { AppError } from '../../../middleware/error.middleware.js';
import { getParamId, getParamString } from '../../../utils/param.util.js';

const lichHocService = new LichHocService();

export class LichHocController {
  async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const query = validate(lichHocQuerySchema, req.query);
      const result = await lichHocService.getList(query);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getListByLopHoc(req: Request, res: Response, next: NextFunction) {
    try {
      const lopHocId = getParamId(req.params.lopHocId);
      const result = await lichHocService.getListByLopHoc(lopHocId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getStatusOptions(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await lichHocService.getStatusOptions();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getThuOptions(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await lichHocService.getThuOptions();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParamId(req.params.id);
      const result = await lichHocService.getById(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = validate(createLichHocSchema, req.body);
      const result = await lichHocService.create(data);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParamId(req.params.id);
      const data = validate(updateLichHocSchema, req.body);
      const result = await lichHocService.update(id, data);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParamId(req.params.id);
      const result = await lichHocService.delete(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async generateBuoiHoc(req: Request, res: Response, next: NextFunction) {
    try {
      const id = getParamId(req.params.id);
      const result = await lichHocService.generateBuoiHoc(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}