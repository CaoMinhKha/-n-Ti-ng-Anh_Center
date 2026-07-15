// src/modules/auth/dto/register.dto.ts

export interface RegisterDto {
  email: string;
  password: string;
  hoVaTen: string;
  ngaySinh?: Date;
  gioiTinh?: 'NAM' | 'NU' | 'KHAC';
}

export interface RegisterResponse {
  message: string;
  userId: number;
  email: string;
}