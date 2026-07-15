// src/modules/bailam/dto/update-bailam.dto.ts

export interface UpdateBaiLamDto {
  ThoiGianNop?: Date | null;
  TongDiem?: number;
  TrangThai?: 'DANG_LAM' | 'DA_NOP' | 'HET_GIO';
}

export interface UpdateBaiLamResponse {
  BaiLamID: number;
  BaiKiemTraID: number;
  HocVienID: number;
  LopHocID: number;
  ThoiGianBatDau: Date;
  ThoiGianNop: Date | null;
  TongDiem: number | null;
  TrangThai: string;
  UpdatedAt: Date;
}