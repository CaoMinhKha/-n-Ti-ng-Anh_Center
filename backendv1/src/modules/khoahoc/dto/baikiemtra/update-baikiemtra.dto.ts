// src/modules/khoahoc/dto/baikiemtra/update-baikiemtra.dto.ts

export interface UpdateBaiKiemTraDto {
  tenBaiKiemTra?: string;
  thoiGianBatDau?: Date | null;
  thoiGianLamBai?: number;
  diemDat?: number;
  diemMax?: number;
  trangThai?: 'AN' | 'HIEN';
}

export interface UpdateBaiKiemTraResponse {
  baiKiemTraID: number;
  tenBaiKiemTra: string;
  thoiGianBatDau: Date | null;
  thoiGianLamBai: number;
  diemDat: number | null;
  diemMax: number | null;
  trangThai: string;
  updatedAt: Date;
}