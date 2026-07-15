// src/modules/khoahoc/dto/khoahoc/update-khoahoc.dto.ts

export interface UpdateKhoaHocDto {
  tenKhoaHoc?: string;
  trinhDoID?: number;
  hocPhi?: number;
  moTa?: string | null;
  trangThai?: 'SAP_MO' | 'DANG_MO' | 'TAM_DUNG';
}

export interface UpdateKhoaHocResponse {
  khoaHocID: number;
  tenKhoaHoc: string;
  trinhDoID: number;
  hocPhi: number | null;
  moTa: string | null;
  trangThai: string;
  updatedAt: Date;
}