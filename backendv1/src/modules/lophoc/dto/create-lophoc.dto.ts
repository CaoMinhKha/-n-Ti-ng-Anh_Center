// src/modules/lophoc/dto/create-lophoc.dto.ts

export interface CreateLopHocDto {
  DotKhaiGiangID: number;
  KhoaHocID: number;
  GiaoVienID: number;
  TenLopHoc: string;
  HinhThucHoc: 'ONLLINE' | 'OFFLINE';
  HocPhi?: number;
  SiSoToiDa?: number;
  NgayBatDau: Date;
  NgayKetThuc: Date;
  TrangThai?: 'SAP_KHAI_GIANG' | 'DANG_HOC' | 'DA_KET_THUC' | 'DA_HUY';
}

export interface CreateLopHocResponse {
  LopHocID: number;
  DotKhaiGiangID: number;
  KhoaHocID: number;
  GiaoVienID: number;
  TenLopHoc: string;
  HinhThucHoc: string;
  HocPhi: number | null;
  SiSoToiDa: number;
  NgayBatDau: Date;
  NgayKetThuc: Date;
  TrangThai: string;
  CreatedAt: Date;
}