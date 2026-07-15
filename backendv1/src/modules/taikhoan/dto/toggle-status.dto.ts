// src/modules/taikhoan/dto/toggle-status.dto.ts

export interface ToggleStatusDto {
  trangThai: 'HOAT_DONG' | 'KHOA';
}

export interface ToggleStatusResponse {
  taiKhoanID: number;
  email: string;
  trangThai: string;
  message: string;
}