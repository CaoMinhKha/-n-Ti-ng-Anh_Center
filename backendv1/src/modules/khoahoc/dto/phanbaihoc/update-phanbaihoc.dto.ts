// src/modules/khoahoc/dto/phanbaihoc/update-phanbaihoc.dto.ts

export interface UpdatePhanBaiHocDto {
  tenPhanBaiHoc?: string;
  loaiPhanBaiHocID?: number;
  tieuDe?: string | null;    //  Cho phép null
  videoUrl?: string | null;  //  Cho phép null
  thuTuHienThi?: number;
  trangThai?: 'AN' | 'HIEN';
}

export interface UpdatePhanBaiHocResponse {
  phanBaiHocID: number;
  tenPhanBaiHoc: string;
  tieuDe: string | null;
  videoUrl: string | null;
  loaiPhanBaiHocID: number;
  thuTuHienThi: number;
  trangThai: string;
  updatedAt: Date;
}