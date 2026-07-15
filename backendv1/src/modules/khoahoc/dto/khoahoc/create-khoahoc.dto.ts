// src/modules/khoahoc/dto/khoahoc/create-khoahoc.dto.ts

export interface CreateKhoaHocDto {
  tenKhoaHoc: string;
  trinhDoID: number;
  hocPhi?: number;
  moTa?: string | null;
  trangThai?: 'SAP_MO' | 'DANG_MO' | 'TAM_DUNG';
}

export interface CreateKhoaHocResponse {
  khoaHocID: number;
  tenKhoaHoc: string;
  trinhDoID: number;
  hocPhi: number | null;
  moTa: string | null;
  trangThai: string;
  createdAt: Date;
}