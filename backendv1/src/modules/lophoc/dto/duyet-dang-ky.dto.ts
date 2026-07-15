// src/modules/lophoc/dto/duyet-dang-ky.dto.ts

export interface DuyetDangKyDto {
  trangThai: 'DA_DUYET' | 'TU_CHOI';
}

export interface DuyetDangKyResponse {
  HocVien_LopHocID: number;
  HocVienID: number;
  LopHocID: number;
  TrangThai: string;
  UpdatedAt: Date;
}