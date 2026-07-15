// src/modules/dotkhaigiang/dto/create-dotkhaigiang.dto.ts

export interface CreateDotKhaiGiangDto {
  MaDot: string;
  TenDot: string;
  NgayMoDangKy: Date;
  NgayDongDangKy: Date;
  MoTa?: string | null;
  TrangThai?: 'SAP_MO' | 'DANG_MO' | 'DA_DONG';
}

export interface CreateDotKhaiGiangResponse {
  DotKhaiGiangID: number;
  MaDot: string;
  TenDot: string;
  NgayMoDangKy: Date;
  NgayDongDangKy: Date;
  MoTa: string | null;
  TrangThai: string;
  CreatedAt: Date;
}