// src/middleware/error.middleware.ts

import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('❌ Error:', err);

  // Lỗi từ AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

  // Lỗi validation (Prisma)
  if (err.code === 'P2002') {
    return res.status(409).json({
      error: 'Dữ liệu đã tồn tại',
      field: err.meta?.target?.[0],
    });
  }

  // Lỗi validation (Prisma)
  if (err.code === 'P2025') {
    return res.status(404).json({
      error: 'Không tìm thấy dữ liệu',
    });
  }

  // Lỗi JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Token không hợp lệ',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token đã hết hạn',
    });
  }

  // Lỗi không xác định
  return res.status(500).json({
    error: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
  });
}