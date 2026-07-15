// src/config/swagger.ts

import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Trung tâm Anh ngữ API',
      version: '1.0.0',
      description: 'API Documentation cho hệ thống quản lý trung tâm Anh ngữ',
      contact: {
        name: 'Support',
        email: 'support@example.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'refreshToken',
        },
      },
      schemas: {
        // ===== Auth Schemas =====
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password', 'hoVaTen'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'student@example.com',
              description: 'Email đăng ký',
            },
            password: {
              type: 'string',
              minLength: 6,
              example: '123456',
              description: 'Mật khẩu (ít nhất 6 ký tự)',
            },
            hoVaTen: {
              type: 'string',
              example: 'Nguyễn Văn A',
              description: 'Họ và tên',
            },
            ngaySinh: {
              type: 'string',
              format: 'date',
              example: '2000-01-01T00:00:00.000Z',
              description: 'Ngày sinh (không bắt buộc)',
            },
            gioiTinh: {
              type: 'string',
              enum: ['NAM', 'NU', 'KHAC'],
              example: 'NAM',
              description: 'Giới tính (không bắt buộc)',
            },
          },
        },
        RegisterResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Đăng ký thành công. Vui lòng kiểm tra email để xác thực.',
            },
            userId: {
              type: 'integer',
              example: 1,
            },
            email: {
              type: 'string',
              example: 'student@example.com',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'student@example.com',
            },
            password: {
              type: 'string',
              example: '123456',
            },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            accessToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIs...',
            },
            user: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 1 },
                email: { type: 'string', example: 'student@example.com' },
                hoVaTen: { type: 'string', example: 'Nguyễn Văn A' },
                vaiTro: { type: 'string', example: 'HOC_VIEN' },
                avatarUrl: { type: 'string', nullable: true },
              },
            },
          },
        },
        VerifyEmailRequest: {
          type: 'object',
          required: ['email', 'otp'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'student@example.com',
            },
            otp: {
              type: 'string',
              pattern: '^[0-9]{6}$',
              example: '123456',
              description: 'Mã OTP 6 chữ số',
            },
          },
        },
        ForgotPasswordRequest: {
          type: 'object',
          required: ['email'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'student@example.com',
            },
          },
        },
        ResetPasswordRequest: {
          type: 'object',
          required: ['email', 'otp', 'newPassword'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'student@example.com',
            },
            otp: {
              type: 'string',
              pattern: '^[0-9]{6}$',
              example: '123456',
            },
            newPassword: {
              type: 'string',
              minLength: 6,
              example: 'newpassword123',
            },
          },
        },
        ChangePasswordRequest: {
          type: 'object',
          required: ['oldPassword', 'newPassword'],
          properties: {
            oldPassword: {
              type: 'string',
              example: 'oldpassword123',
            },
            newPassword: {
              type: 'string',
              minLength: 6,
              example: 'newpassword123',
            },
          },
        },
        RefreshTokenRequest: {
          type: 'object',
          properties: {
            refreshToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIs...',
              description: 'Refresh token (có thể lấy từ cookie)',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Email đã được sử dụng',
            },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Thành công',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: 'Auth',
        description: 'Xác thực và quản lý tài khoản',
      },
      {
        name: 'Health',
        description: 'Kiểm tra trạng thái server',
      },
    ],
  },
  apis: ['./src/modules/**/routes/*.ts', './src/app.ts'],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'Trung tâm Anh ngữ API Documentation',
    })
  );

  console.log('📚 Swagger UI: http://localhost:5000/api-docs');
};