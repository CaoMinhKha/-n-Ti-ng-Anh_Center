// src/modules/dotkhaigiang/dto/update-dotkhaigiang.dto.ts

export interface UpdateDotKhaiGiangDto {
  MaDot?: string;
  TenDot?: string;
  NgayMoDangKy?: Date;
  NgayDongDangKy?: Date;
  MoTa?: string | null;
  TrangThai?: 'SAP_MO' | 'DANG_MO' | 'DA_DONG';
}

export interface UpdateDotKhaiGiangResponse {
  DotKhaiGiangID: number;
  MaDot: string;
  TenDot: string;
  NgayMoDangKy: Date;
  NgayDongDangKy: Date;
  MoTa: string | null;
  TrangThai: string;
  UpdatedAt: Date;
}