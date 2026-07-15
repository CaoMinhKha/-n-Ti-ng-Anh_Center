// src/modules/khoahoc/dto/baikiemtra/create-baikiemtra.dto.ts

export interface CreateBaiKiemTraDto {
  tenBaiKiemTra: string;
  thoiGianBatDau?: Date | null;
  thoiGianLamBai: number;
  diemDat?: number;
  diemMax?: number;
  trangThai?: 'AN' | 'HIEN';
}

export interface CreateBaiKiemTraResponse {
  baiKiemTraID: number;
  phanBaiHocID: number;
  tenBaiKiemTra: string;
  thoiGianBatDau: Date | null;
  thoiGianLamBai: number;
  diemDat: number | null;
  diemMax: number | null;
  trangThai: string;
  createdAt: Date;
}