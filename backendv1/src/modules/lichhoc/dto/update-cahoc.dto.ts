// src/modules/lichhoc/dto/update-cahoc.dto.ts

export interface UpdateCaHocDto {
  MaCa?: string;
  TenCa?: string;
  GioBatDau?: string;
  GioKetThuc?: string;
  TrangThai?: 'HOAT_DONG' | 'NGUNG_HOAT_DONG';
}

export interface UpdateCaHocResponse {
  CaHocID: number;
  MaCa: string;
  TenCa: string;
  GioBatDau: Date;
  GioKetThuc: Date;
  TrangThai: string;
  UpdatedAt: Date;
}