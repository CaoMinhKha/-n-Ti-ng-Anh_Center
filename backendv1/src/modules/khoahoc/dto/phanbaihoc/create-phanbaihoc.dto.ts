// src/modules/khoahoc/dto/phanbaihoc/create-phanbaihoc.dto.ts

export interface CreatePhanBaiHocDto {
  tenPhanBaiHoc: string;
  loaiPhanBaiHocID: number;
  tieuDe?: string | null;    //  Cho phép null
  videoUrl?: string | null;  //  Cho phép null
  thuTuHienThi?: number;
  trangThai?: 'AN' | 'HIEN';
}

export interface CreatePhanBaiHocResponse {
  phanBaiHocID: number;
  baiHocID: number;
  tenPhanBaiHoc: string;
  tieuDe: string | null;
  videoUrl: string | null;
  loaiPhanBaiHocID: number;
  thuTuHienThi: number;
  trangThai: string;
  createdAt: Date;
}