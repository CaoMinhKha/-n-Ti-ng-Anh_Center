// src/modules/lophoc/dto/dang-ky-hoc-vien.dto.ts

export interface DangKyHocVienDto {
  HocVienID: number;
  HocPhi?: number;
}

export interface DangKyHocVienResponse {
  HocVien_LopHocID: number;
  HocVienID: number;
  LopHocID: number;
  HocPhi: number | null;
  NgayDangKy: Date;
  DongHocPhi: boolean;
  TrangThai: string;
}