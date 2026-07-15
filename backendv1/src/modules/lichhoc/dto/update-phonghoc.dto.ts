// src/modules/lichhoc/dto/update-phonghoc.dto.ts

export interface UpdatePhongHocDto {
  MaPhong?: string;
  TenPhong?: string;
  SucChua?: number;
  ToaNha?: string | null;
  TrangThai?: 'TRONG' | 'DANG_SU_DUNG' | 'BAO_TRI';
}

export interface UpdatePhongHocResponse {
  PhongHocID: number;
  MaPhong: string;
  TenPhong: string;
  SucChua: number;
  ToaNha: string | null;
  TrangThai: string;
  UpdatedAt: Date;
}