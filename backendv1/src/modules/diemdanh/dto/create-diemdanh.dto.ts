// src/modules/diemdanh/dto/create-diemdanh.dto.ts

export interface CreateDiemDanhDto {
  HocVienID: number;
  BuoiHocID: number;
  TrangThaiDiemDanh: 'CO_MAT' | 'VANG_CO_PHEP' | 'VANG_KHONG_PHEP' | 'DI_MUON';
  ThoiGianCheckIn?: Date | null;
  GhiChu?: string | null;
}

export interface CreateDiemDanhResponse {
  HocVienID: number;
  BuoiHocID: number;
  TrangThaiDiemDanh: string;
  ThoiGianCheckIn: Date | null;
  GhiChu: string | null;
}