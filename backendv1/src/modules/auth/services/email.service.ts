// src/modules/auth/services/email.service.ts

import nodemailer from 'nodemailer';
import { emailConfig } from '../../../config/email.config.js';

// Tạo transporter
const transporter = nodemailer.createTransport({
  host: emailConfig.host,
  port: emailConfig.port,
  secure: emailConfig.secure,
  auth: {
    user: emailConfig.auth.user,
    pass: emailConfig.auth.pass,
  },
});

// Kiểm tra kết nối
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email transporter error:', error);
  } else {
    console.log(' Email transporter ready');
  }
});

/**
 * Gửi email OTP xác thực
 */
export async function sendOTPEmail(
  to: string,
  otp: string,
  type: 'DANG_KY' | 'QUEN_MAT_KHAU'
): Promise<void> {
  const subject = type === 'DANG_KY' 
    ? 'Xác thực email đăng ký tài khoản' 
    : 'Xác thực đặt lại mật khẩu';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Xác thực email</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 500px;
          margin: 0 auto;
          background: #ffffff;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #4CAF50;
          padding-bottom: 20px;
        }
        .header h1 {
          color: #4CAF50;
          margin: 0;
        }
        .otp-box {
          text-align: center;
          padding: 30px 0;
        }
        .otp-code {
          display: inline-block;
          font-size: 36px;
          font-weight: bold;
          color: #4CAF50;
          background: #f0f8f0;
          padding: 10px 30px;
          border-radius: 8px;
          letter-spacing: 8px;
        }
        .message {
          color: #555;
          line-height: 1.6;
        }
        .footer {
          text-align: center;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          color: #999;
          font-size: 12px;
        }
        .warning {
          color: #e74c3c;
          font-size: 13px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📧 Xác thực email</h1>
        </div>
        <div class="message">
          <p>Chào bạn,</p>
          <p>${type === 'DANG_KY' 
            ? 'Cảm ơn bạn đã đăng ký tài khoản. Vui lòng nhập mã OTP dưới đây để xác thực email của bạn:' 
            : 'Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng nhập mã OTP dưới đây để tiếp tục:'}
          </p>
        </div>
        <div class="otp-box">
          <div class="otp-code">${otp}</div>
        </div>
        <div class="message">
          <p><strong>Mã OTP có hiệu lực trong 5 phút.</strong></p>
          <p class="warning">⚠️ Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Trung tâm Anh ngữ. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: emailConfig.from,
    to,
    subject,
    html,
    text: `Mã OTP của bạn là: ${otp}. Có hiệu lực trong 5 phút.`,
  });
}

/**
 * Gửi email thông báo đăng ký thành công
 */
export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Chào mừng bạn</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 500px;
          margin: 0 auto;
          background: #ffffff;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #4CAF50;
          padding-bottom: 20px;
        }
        .header h1 {
          color: #4CAF50;
          margin: 0;
        }
        .message {
          color: #555;
          line-height: 1.8;
        }
        .footer {
          text-align: center;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          color: #999;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Chào mừng bạn!</h1>
        </div>
        <div class="message">
          <p>Xin chào <strong>${name}</strong>,</p>
          <p>Chúc mừng bạn đã đăng ký thành công tài khoản tại <strong>Trung tâm Anh ngữ</strong>!</p>
          <p>Bạn có thể bắt đầu khám phá các khóa học và tính năng ngay bây giờ.</p>
          <p>Nếu có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Trung tâm Anh ngữ. All rights reserved.</p>
        </div>
      </div>
    </html>
  `;

  await transporter.sendMail({
    from: emailConfig.from,
    to,
    subject: '🎉 Chào mừng bạn đến với Trung tâm Anh ngữ',
    html,
    text: `Xin chào ${name}, chúc mừng bạn đã đăng ký thành công!`,
  });
}

/**
 * Gửi email thông báo đặt lại mật khẩu thành công
 */
export async function sendPasswordResetSuccessEmail(to: string): Promise<void> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Đặt lại mật khẩu thành công</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 500px;
          margin: 0 auto;
          background: #ffffff;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #4CAF50;
          padding-bottom: 20px;
        }
        .header h1 {
          color: #4CAF50;
          margin: 0;
        }
        .message {
          color: #555;
          line-height: 1.8;
        }
        .footer {
          text-align: center;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          color: #999;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔑 Đặt lại mật khẩu thành công</h1>
        </div>
        <div class="message">
          <p>Mật khẩu của bạn đã được đặt lại thành công.</p>
          <p>Bạn có thể đăng nhập vào hệ thống bằng mật khẩu mới ngay bây giờ.</p>
          <p>Nếu bạn không thực hiện yêu cầu này, vui lòng liên hệ với chúng tôi ngay lập tức.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Trung tâm Anh ngữ. All rights reserved.</p>
        </div>
      </div>
    </html>
  `;

  await transporter.sendMail({
    from: emailConfig.from,
    to,
    subject: '🔑 Đặt lại mật khẩu thành công',
    html,
    text: 'Mật khẩu của bạn đã được đặt lại thành công.',
  });
}