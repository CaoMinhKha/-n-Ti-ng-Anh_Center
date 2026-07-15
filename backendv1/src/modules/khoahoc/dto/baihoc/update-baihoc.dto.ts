// src/modules/khoahoc/dto/baihoc/update-baihoc.dto.ts
export interface UpdateBaiHocDto {
  tenBaiHoc?: string;
  moTa?: string | null;  //  Cho phép null
  thuTuHienThi?: number;
  trangThai?: 'AN' | 'HIEN';
}

export interface UpdateBaiHocResponse {
  baiHocID: number;
  tenBaiHoc: string;
  moTa: string | null;
  thuTuHienThi: number;
  trangThai: string;
  updatedAt: Date;
}