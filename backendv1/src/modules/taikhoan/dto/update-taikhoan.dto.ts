// src/modules/taikhoan/dto/update-taikhoan.dto.ts

export interface UpdateTaiKhoanDto {
  hoVaTen?: string;
  ngaySinh?: Date | null;
  gioiTinh?: 'NAM' | 'NU' | 'KHAC';
  avatarUrl?: string | null;
  vaiTro?: 'ADMIN' | 'GIAO_VIEN' | 'HOC_VIEN';
  trangThai?: 'HOAT_DONG' | 'KHOA' | 'CHO_XAC_THUC';
}

export interface UpdateTaiKhoanResponse {
  taiKhoanID: number;
  email: string;
  hoVaTen: string;
  vaiTro: string;
  trangThai: string;
  updatedAt: Date;
}