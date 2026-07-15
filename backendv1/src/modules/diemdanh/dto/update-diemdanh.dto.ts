// src/modules/diemdanh/dto/update-diemdanh.dto.ts

export interface UpdateDiemDanhDto {
  TrangThaiDiemDanh?: 'CO_MAT' | 'VANG_CO_PHEP' | 'VANG_KHONG_PHEP' | 'DI_MUON';
  ThoiGianCheckIn?: Date | null;
  GhiChu?: string | null;
}

export interface UpdateDiemDanhResponse {
  HocVienID: number;
  BuoiHocID: number;
  TrangThaiDiemDanh: string;
  ThoiGianCheckIn: Date | null;
  GhiChu: string | null;
  UpdatedAt: Date;
}