// src/modules/taikhoan/dto/reset-password.dto.ts

export interface ResetPasswordDto {
  newPassword: string;
}

export interface ResetPasswordResponse {
  taiKhoanID: number;
  email: string;
  message: string;
}