// src/modules/taikhoan/dto/create-taikhoan.dto.ts

export interface CreateTaiKhoanDto {
  email: string;
  password: string;
  hoVaTen: string;
  vaiTro: 'ADMIN' | 'GIAO_VIEN' | 'HOC_VIEN';
  ngaySinh?: Date | null;
  gioiTinh?: 'NAM' | 'NU' | 'KHAC';
  avatarUrl?: string | null;
}

export interface CreateTaiKhoanResponse {
  taiKhoanID: number;
  email: string;
  hoVaTen: string;
  vaiTro: string;
  trangThai: string;
  createdAt: Date;
}