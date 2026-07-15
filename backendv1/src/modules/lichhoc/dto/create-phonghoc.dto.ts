// src/modules/lichhoc/dto/create-phonghoc.dto.ts

export interface CreatePhongHocDto {
  MaPhong: string;
  TenPhong: string;
  SucChua: number;
  ToaNha?: string | null;
  TrangThai?: 'TRONG' | 'DANG_SU_DUNG' | 'BAO_TRI';
}

export interface CreatePhongHocResponse {
  PhongHocID: number;
  MaPhong: string;
  TenPhong: string;
  SucChua: number;
  ToaNha: string | null;
  TrangThai: string;
  CreatedAt: Date;
}