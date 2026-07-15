// src/modules/khoahoc/dto/baihoc/create-baihoc.dto.ts

export interface CreateBaiHocDto {
  tenBaiHoc: string;
  moTa?: string | null;  //  Cho phép null
  thuTuHienThi?: number;
  trangThai?: 'AN' | 'HIEN';
}

export interface CreateBaiHocResponse {
  baiHocID: number;
  khoaHocID: number;
  tenBaiHoc: string;
  moTa: string | null;
  thuTuHienThi: number;
  trangThai: string;
  createdAt: Date;
}