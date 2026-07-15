// src/config/email.config.ts

import dotenv from 'dotenv';

dotenv.config();

export const emailConfig = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
  },
  from: process.env.EMAIL_FROM || '',
};

// Kiểm tra cấu hình email
if (!emailConfig.auth.user || !emailConfig.auth.pass) {
  console.warn('⚠️ Cấu hình email chưa được thiết lập. Vui lòng kiểm tra file .env');
}