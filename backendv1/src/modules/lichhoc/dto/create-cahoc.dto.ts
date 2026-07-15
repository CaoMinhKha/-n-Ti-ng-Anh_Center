// src/modules/lichhoc/dto/create-cahoc.dto.ts

export interface CreateCaHocDto {
  MaCa: string;
  TenCa: string;
  GioBatDau: string; // HH:mm
  GioKetThuc: string; // HH:mm
  TrangThai?: 'HOAT_DONG' | 'NGUNG_HOAT_DONG';
}

export interface CreateCaHocResponse {
  CaHocID: number;
  MaCa: string;
  TenCa: string;
  GioBatDau: Date;
  GioKetThuc: Date;
  TrangThai: string;
  CreatedAt: Date;
}