// src/modules/diemdanh/dto/create-madiemdanh.dto.ts

export interface CreateMaDiemDanhDto {
  BuoiHocID: number;
  GiaoVienID: number;
  ThoiGianHetHan?: Date | null;
  TrangThai?: 'DANG_HOAT_DONG' | 'HET_HAN' | 'DA_DONG';
}

export interface CreateMaDiemDanhResponse {
  MaDiemDanhID: number;
  BuoiHocID: number;
  GiaoVienID: number;
  NoiDungMaDiemDanh: string;
  ThoiGianHetHan: Date;
  TrangThai: string;
  CreatedAt: Date;
}