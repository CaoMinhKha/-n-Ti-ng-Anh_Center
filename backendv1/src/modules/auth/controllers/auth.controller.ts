// src/modules/auth/controllers/auth.controller.ts

import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resendOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  refreshTokenSchema,
  validate,
} from '../validators/auth.validator.js';
import { AppError } from '../../../middleware/error.middleware.js';

const authService = new AuthService();

export class AuthController {
  /**
   * Đăng ký tài khoản học viên
   * POST /api/auth/register
   */
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data = validate(registerSchema, req.body);
      const result = await authService.register(data);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Xác thực email
   * POST /api/auth/verify-email
   */
  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const data = validate(verifyEmailSchema, req.body);
      const result = await authService.verifyEmail(data);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Gửi lại OTP
   * POST /api/auth/resend-otp
   */
  async resendOTP(req: Request, res: Response, next: NextFunction) {
    try {
      const data = validate(resendOtpSchema, req.body);
      const result = await authService.resendOTP(data.email, data.type);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Đăng nhập
   * POST /api/auth/login
   */
// src/modules/auth/controllers/auth.controller.ts

async login(req: Request, res: Response, next: NextFunction) {
  try {
    const data = validate(loginSchema, req.body);
    const result = await authService.login(data);

    //  Set Access Token Cookie (HttpOnly)
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000, // 1 giờ
      path: '/',
    });

    //  Set Refresh Token Cookie (HttpOnly)
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
      path: '/',
    });

    //  Log để debug
    console.log(' Đã set cookie accessToken');
    console.log('📌 accessToken:', result.accessToken);

    res.status(200).json({
      message: 'Đăng nhập thành công',
      user: result.user ,
      
    });
  } catch (error) {
    next(error);
  }
}

  /**
   * Làm mới Access Token
   * POST /api/auth/refresh-token
   */
  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
        throw new AppError('Refresh token không tìm thấy', 401);
      }

      const data = validate(refreshTokenSchema, { refreshToken });
      const result = await authService.refreshToken(data);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Đăng xuất
   * POST /api/auth/logout
   */
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        throw new AppError('Unauthorized', 401);
      }

      await authService.logout(userId);

      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      res.status(200).json({
        message: 'Đăng xuất thành công',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Quên mật khẩu
   * POST /api/auth/forgot-password
   */
  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const data = validate(forgotPasswordSchema, req.body);
      const result = await authService.forgotPassword(data);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Đặt lại mật khẩu
   * POST /api/auth/reset-password
   */
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const data = validate(resetPasswordSchema, req.body);
      const result = await authService.resetPassword(data);

      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Đổi mật khẩu (khi đã đăng nhập)
   * POST /api/auth/change-password
   */
  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        throw new AppError('Unauthorized', 401);
      }

      const data = validate(changePasswordSchema, req.body);
      const result = await authService.changePassword(userId, data);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy thông tin user hiện tại
   * GET /api/auth/me
   */
  async getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    const result = await authService.getMe(userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
  }
}