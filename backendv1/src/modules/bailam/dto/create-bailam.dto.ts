// src/modules/bailam/dto/create-bailam.dto.ts

export interface CreateBaiLamDto {
  BaiKiemTraID: number;
  HocVienID: number;
  LopHocID: number;
  ThoiGianBatDau: Date;
  ThoiGianNop?: Date | null;
  TongDiem?: number;
  TrangThai?: 'DANG_LAM' | 'DA_NOP' | 'HET_GIO';
}

export interface CreateBaiLamResponse {
  BaiLamID: number;
  BaiKiemTraID: number;
  HocVienID: number;
  LopHocID: number;
  ThoiGianBatDau: Date;
  ThoiGianNop: Date | null;
  TongDiem: number | null;
  TrangThai: string;
  CreatedAt: Date;
}