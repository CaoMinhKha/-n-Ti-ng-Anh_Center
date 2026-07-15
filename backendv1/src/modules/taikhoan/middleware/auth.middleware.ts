// src/modules/auth/middleware/auth.middleware.ts

import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.util.js';
import { AppError } from '../../../middleware/error.middleware.js';

/**
 * Middleware xác thực JWT
 * Kiểm tra Access Token trong Header Authorization
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    // Lấy token từ header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      throw new AppError('Token không tìm thấy. Vui lòng đăng nhập lại.', 401);
    }
    
    // Format: "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new AppError('Token không đúng định dạng. Vui lòng đăng nhập lại.', 401);
    }
    
    const token = parts[1];
    
    // Xác thực token
    const decoded = verifyAccessToken(token);
    
    if (!decoded) {
      throw new AppError('Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.', 401);
    }
    
    // Gắn thông tin user vào request
    (req as any).user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };
    
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Middleware kiểm tra Role (phân quyền)
 * Sử dụng sau authMiddleware
 */
export function roleMiddleware(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    
    if (!user) {
      throw new AppError('Unauthorized', 401);
    }
    
    if (!allowedRoles.includes(user.role)) {
      throw new AppError('Bạn không có quyền truy cập chức năng này', 403);
    }
    
    next();
  };
}

/**
 * Middleware kiểm tra email đã xác thực chưa
 * Sử dụng sau authMiddleware
 */
export function verifiedMiddleware(req: Request, res: Response, next: NextFunction) {
  // Có thể kiểm tra thêm trong service
  // Hoặc để service xử lý
  next();
}